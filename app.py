from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import torch
import torch.nn as nn
import json
import os

app = Flask(__name__)
CORS(app)

# ============================================================
# LOAD MODEL & PREPROCESSING
# ============================================================
# Load CSVs for lookups
constructors_df = pd.read_csv("data/constructors.csv")
circuits_df = pd.read_csv("data/circuits.csv")
races_df = pd.read_csv("data/races.csv")
results_df = pd.read_csv("data/results.csv")

# Load preprocessing config
with open("model/preprocessing.json") as f:
    prep = json.load(f)

with open("model/model_config.json") as f:
    model_cfg = json.load(f)

# Build lookup dicts
# constructorId -> name
constructor_names = dict(zip(constructors_df["constructorId"].astype(str), constructors_df["name"]))
# circuitId -> name
circuit_names = dict(zip(circuits_df["circuitId"].astype(str), circuits_df["name"]))

# Get only constructors/circuits that are in the model's training data
valid_constructors = [str(c) for c in prep["constructor_classes"]]
valid_circuits = [str(c) for c in prep["circuit_classes"]]

# Build dropdown lists (sorted by name)
constructor_options = sorted(
    [(cid, constructor_names.get(cid, f"Constructor {cid}")) for cid in valid_constructors],
    key=lambda x: x[1]
)
circuit_options = sorted(
    [(cid, circuit_names.get(cid, f"Circuit {cid}")) for cid in valid_circuits],
    key=lambda x: x[1]
)

# Years available
years_available = [int(y) for y in sorted(races_df["year"].unique())]

# ============================================================
# NEURAL NETWORK (same architecture as training)
# ============================================================
class F1PointsNet(nn.Module):
    def __init__(self, n_constructors, n_circuits, embed_dim=24, hidden_dim=128, n_num=5):
        super().__init__()
        self.constructor_emb = nn.Embedding(n_constructors, embed_dim)
        self.circuit_emb = nn.Embedding(n_circuits, embed_dim)
        self.grid_group_emb = nn.Embedding(6, 4)

        input_dim = embed_dim * 2 + 4 + n_num
        self.net = nn.Sequential(
            nn.Linear(input_dim, hidden_dim),
            nn.BatchNorm1d(hidden_dim),
            nn.GELU(),
            nn.Dropout(0.35),
            nn.Linear(hidden_dim, hidden_dim),
            nn.BatchNorm1d(hidden_dim),
            nn.GELU(),
            nn.Dropout(0.25),
            nn.Linear(hidden_dim, hidden_dim // 2),
            nn.GELU(),
            nn.Dropout(0.15),
            nn.Linear(hidden_dim // 2, 1),
        )

    def forward(self, num, grid_group, constructor, circuit):
        x = torch.cat([
            self.constructor_emb(constructor),
            self.circuit_emb(circuit),
            self.grid_group_emb(grid_group),
            num,
        ], dim=1)
        return torch.clamp(self.net(x), min=0)

# Load model
model = F1PointsNet(
    n_constructors=model_cfg["n_constructors"],
    n_circuits=model_cfg["n_circuits"],
    embed_dim=model_cfg["embed_dim"],
    hidden_dim=model_cfg["hidden_dim"],
    n_num=model_cfg["n_num"],
)
model.load_state_dict(torch.load("model/best_model.pth", weights_only=True, map_location="cpu"))
model.eval()
print("Model loaded successfully!")

# ============================================================
# HELPER FUNCTIONS
# ============================================================
valid_points = [0, 1, 2, 4, 6, 8, 10, 12, 15, 18, 25]

def snap_to_valid_points(p):
    return min(valid_points, key=lambda x: abs(x - p))

def grid_group(g):
    if g <= 2: return 0
    elif g <= 5: return 1
    elif g <= 10: return 2
    elif g <= 15: return 3
    elif g <= 20: return 4
    else: return 5

def normalize(val, col_name):
    stats = prep["norm_stats"][col_name]
    return (val - stats["mean"]) / stats["std"]

def get_constructor_avg(constructor_id, year=None):
    """Get constructor's historical average points."""
    mask = results_df["constructorId"] == constructor_id
    if year:
        race_ids = races_df[races_df["year"] <= year]["raceId"]
        mask = mask & results_df["raceId"].isin(race_ids)
    subset = results_df[mask]
    if len(subset) == 0:
        return 0.0
    return float(subset["points"].mean())

def get_constructor_year_avg(constructor_id, year):
    """Get constructor's average points in a specific year (up to that year)."""
    race_ids = races_df[races_df["year"] == year]["raceId"]
    mask = (results_df["constructorId"] == constructor_id) & results_df["raceId"].isin(race_ids)
    subset = results_df[mask]
    if len(subset) == 0:
        return get_constructor_avg(constructor_id, year)
    return float(subset["points"].mean())

def get_circuit_avg(circuit_id):
    """Get circuit's historical average points."""
    race_ids = races_df[races_df["circuitId"] == circuit_id]["raceId"]
    subset = results_df[results_df["raceId"].isin(race_ids)]
    if len(subset) == 0:
        return 2.0
    return float(subset["points"].mean())

def predict_points(grid_pos, constructor_id, circuit_id, year):
    """Run model inference."""
    constructor_id = int(constructor_id)
    circuit_id = int(circuit_id)
    year = int(year)
    grid_pos = int(grid_pos)

    # Get encoded IDs
    try:
        c_idx = prep["constructor_classes"].index(constructor_id)
    except ValueError:
        c_idx = 0
    try:
        ci_idx = prep["circuit_classes"].index(circuit_id)
    except ValueError:
        ci_idx = 0

    # Compute features
    c_avg = get_constructor_avg(constructor_id, year)
    c_year_avg = get_constructor_year_avg(constructor_id, year)
    ci_avg = get_circuit_avg(circuit_id)
    gg = grid_group(grid_pos)

    # Normalize
    num_features = np.array([[
        normalize(grid_pos, "grid"),
        normalize(year, "year"),
        normalize(c_avg, "constructor_avg_pts"),
        normalize(c_year_avg, "constructor_year_avg_pts"),
        normalize(ci_avg, "circuit_avg_pts"),
    ]], dtype=np.float32)

    # Create tensors
    num_t = torch.FloatTensor(num_features)
    gg_t = torch.LongTensor([gg])
    c_t = torch.LongTensor([c_idx])
    ci_t = torch.LongTensor([ci_idx])

    # Inference
    with torch.no_grad():
        raw_pred = model(num_t, gg_t, c_t, ci_t).item()

    snapped = snap_to_valid_points(raw_pred)

    return {
        "raw_prediction": round(raw_pred, 2),
        "predicted_points": snapped,
        "details": {
            "grid_position": grid_pos,
            "grid_group": gg,
            "constructor_avg": round(c_avg, 2),
            "constructor_year_avg": round(c_year_avg, 2),
            "circuit_avg": round(ci_avg, 2),
        }
    }

# ============================================================
# ROUTES
# ============================================================
@app.route("/")
def index():
    return render_template(
        "index.html",
        constructors=constructor_options,
        circuits=circuit_options,
        years=years_available,
    )

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json
        grid_pos = int(data["grid_position"])
        constructor_id = int(data["constructor_id"])
        circuit_id = int(data["circuit_id"])
        year = int(data["year"])

        result = predict_points(grid_pos, constructor_id, circuit_id, year)
        return jsonify({"success": True, **result})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

@app.route("/api/constructors")
def api_constructors():
    return jsonify(constructor_options)

@app.route("/api/circuits")
def api_circuits():
    return jsonify(circuit_options)

@app.route("/api/years")
def api_years():
    return jsonify(years_available)

if __name__ == "__main__":
    app.run(debug=True, port=5000)
