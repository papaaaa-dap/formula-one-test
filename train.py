import pandas as pd
import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import json
import os

# ============================================================
# 1. LOAD & MERGE DATA
# ============================================================
print("=" * 60)
print("F1 Points Prediction - Neural Network Training (TUNED v2)")
print("=" * 60)

results = pd.read_csv("data/results.csv")
races = pd.read_csv("data/races.csv")
constructors = pd.read_csv("data/constructors.csv")
circuits = pd.read_csv("data/circuits.csv")

df = results.merge(races[["raceId", "year", "round", "circuitId"]], on="raceId")
df = df[df["grid"] > 0].copy()
df = df.dropna(subset=["points"])

for col in ["grid", "year", "round", "constructorId", "circuitId"]:
    df[col] = df[col].astype(int)
df["points"] = df["points"].astype(float)

print(f"\nTotal samples: {len(df)}")
print(f"Points distribution:")
print(df["points"].describe())

# ============================================================
# 2. FEATURE ENGINEERING (no data leakage)
# ============================================================
print("\nEngineering features...")

# Sort chronologically to avoid leakage
df = df.sort_values(["year", "round", "constructorId"]).reset_index(drop=True)

# 2a. Constructor rolling avg points (only from PAST races, shift(1))
constructor_avg = df.groupby("constructorId")["points"].transform(
    lambda x: x.expanding().mean().shift(1)
)
df["constructor_avg_pts"] = constructor_avg.fillna(0)

# 2b. Constructor's avg points in current season so far
constructor_year_avg = df.groupby(["constructorId", "year"])["points"].transform(
    lambda x: x.expanding().mean().shift(1)
)
df["constructor_year_avg_pts"] = constructor_year_avg.fillna(df["constructor_avg_pts"])

# 2c. Circuit historical avg (only past)
circuit_avg = df.groupby("circuitId")["points"].transform(
    lambda x: x.expanding().mean().shift(1)
)
df["circuit_avg_pts"] = circuit_avg.fillna(df["points"].mean())

# 2d. Grid position group
def grid_group(g):
    if g <= 2: return 0
    elif g <= 5: return 1
    elif g <= 10: return 2
    elif g <= 15: return 3
    elif g <= 20: return 4
    else: return 5

df["grid_group"] = df["grid"].apply(grid_group)

print("Features added: constructor_avg_pts, constructor_year_avg_pts, circuit_avg_pts, grid_group")

# ============================================================
# 3. ENCODE CATEGORICAL FEATURES
# ============================================================
constructor_encoder = LabelEncoder()
circuit_encoder = LabelEncoder()

df["constructor_encoded"] = constructor_encoder.fit_transform(df["constructorId"])
df["circuit_encoded"] = circuit_encoder.fit_transform(df["circuitId"])

n_constructors = len(constructor_encoder.classes_)
n_circuits = len(circuit_encoder.classes_)

print(f"\nUnique constructors: {n_constructors}")
print(f"Unique circuits: {n_circuits}")

# Normalize numerical features
norm_stats = {}
num_cols = ["grid", "year", "constructor_avg_pts", "constructor_year_avg_pts", "circuit_avg_pts"]
for col in num_cols:
    m, s = float(df[col].mean()), float(df[col].std())
    norm_stats[col] = {"mean": m, "std": s if s > 1e-8 else 1.0}
    df[f"{col}_norm"] = (df[col] - m) / (s if s > 1e-8 else 1.0)

artifacts = {
    "constructor_classes": constructor_encoder.classes_.tolist(),
    "circuit_classes": circuit_encoder.classes_.tolist(),
    "norm_stats": norm_stats,
    "n_constructors": n_constructors,
    "n_circuits": n_circuits,
}

os.makedirs("model", exist_ok=True)
with open("model/preprocessing.json", "w") as f:
    json.dump(artifacts, f)

# ============================================================
# 4. DATASET & DATALOADER
# ============================================================
NORM_COLS = ["grid_norm", "year_norm", "constructor_avg_pts_norm",
             "constructor_year_avg_pts_norm", "circuit_avg_pts_norm"]

class F1Dataset(Dataset):
    def __init__(self, df):
        self.num = torch.FloatTensor(
            np.column_stack([df[c].values.copy() for c in NORM_COLS])
        )
        self.grid_group = torch.LongTensor(df["grid_group"].values.copy())
        self.constructor = torch.LongTensor(df["constructor_encoded"].values.copy())
        self.circuit = torch.LongTensor(df["circuit_encoded"].values.copy())
        self.points = torch.FloatTensor(df["points"].values.copy()).unsqueeze(1)

    def __len__(self):
        return len(self.num)

    def __getitem__(self, idx):
        return self.num[idx], self.grid_group[idx], self.constructor[idx], self.circuit[idx], self.points[idx]

train_df, val_df = train_test_split(df, test_size=0.2, random_state=42)
print(f"\nTrain: {len(train_df)}, Val: {len(val_df)}")

train_loader = DataLoader(F1Dataset(train_df), batch_size=256, shuffle=True)
val_loader = DataLoader(F1Dataset(val_df), batch_size=512, shuffle=False)

# ============================================================
# 5. NEURAL NETWORK (BALANCED - no overfitting)
# ============================================================
class F1PointsNet(nn.Module):
    def __init__(self, n_constructors, n_circuits, embed_dim=24, hidden_dim=128, n_num=5):
        super().__init__()
        self.constructor_emb = nn.Embedding(n_constructors, embed_dim)
        self.circuit_emb = nn.Embedding(n_circuits, embed_dim)
        self.grid_group_emb = nn.Embedding(6, 4)

        input_dim = embed_dim * 2 + 4 + n_num  # 24*2 + 4 + 5 = 57

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


device = torch.device("cpu")
model = F1PointsNet(n_constructors, n_circuits).to(device)
total_params = sum(p.numel() for p in model.parameters())
print(f"\nModel: {total_params:,} params")

# ============================================================
# 6. TRAINING
# ============================================================
optimizer = optim.AdamW(model.parameters(), lr=0.001, weight_decay=5e-4)
scheduler = optim.lr_scheduler.ReduceLROnPlateau(optimizer, patience=15, factor=0.5)
criterion = nn.MSELoss()

n_epochs = 200
best_val_loss = float("inf")
patience = 40
patience_counter = 0
best_epoch = 0

print(f"\n{'='*60}")
print("Training...")
print(f"{'='*60}")

for epoch in range(n_epochs):
    model.train()
    train_loss = 0
    for num, grid_group, constructor, circuit, points in train_loader:
        num, grid_group, constructor, circuit, points = [
            x.to(device) for x in (num, grid_group, constructor, circuit, points)
        ]
        optimizer.zero_grad()
        pred = model(num, grid_group, constructor, circuit)
        loss = criterion(pred, points)
        loss.backward()
        torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
        optimizer.step()
        train_loss += loss.item() * len(num)
    train_loss /= len(train_loader.dataset)

    model.eval()
    val_loss = 0
    with torch.no_grad():
        for num, grid_group, constructor, circuit, points in val_loader:
            num, grid_group, constructor, circuit, points = [
                x.to(device) for x in (num, grid_group, constructor, circuit, points)
            ]
            pred = model(num, grid_group, constructor, circuit)
            loss = criterion(pred, points)
            val_loss += loss.item() * len(num)
    val_loss /= len(val_loader.dataset)
    scheduler.step(val_loss)

    if (epoch + 1) % 20 == 0 or epoch == 0:
        lr = optimizer.param_groups[0]["lr"]
        print(f"Epoch {epoch+1:3d}/{n_epochs} | Train: {train_loss:.4f} | Val: {val_loss:.4f} | LR: {lr:.6f}")

    if val_loss < best_val_loss:
        best_val_loss = val_loss
        best_epoch = epoch + 1
        patience_counter = 0
        torch.save(model.state_dict(), "model/best_model.pth")
    else:
        patience_counter += 1
        if patience_counter >= patience:
            print(f"\nEarly stopping at epoch {epoch+1} (best: {best_epoch})")
            break

model.load_state_dict(torch.load("model/best_model.pth", weights_only=True))
print(f"Best model from epoch {best_epoch}")

# ============================================================
# 7. EVALUATION
# ============================================================
print(f"\n{'='*60}")
print("Evaluation")
print(f"{'='*60}")

model.eval()
all_preds, all_targets = [], []
with torch.no_grad():
    for num, grid_group, constructor, circuit, points in val_loader:
        num, grid_group, constructor, circuit = [
            x.to(device) for x in (num, grid_group, constructor, circuit)
        ]
        pred = model(num, grid_group, constructor, circuit)
        all_preds.extend(pred.squeeze().cpu().numpy().tolist())
        all_targets.extend(points.squeeze().numpy().tolist())

all_preds = np.array(all_preds)
all_targets = np.array(all_targets)

valid_points = [0, 1, 2, 4, 6, 8, 10, 12, 15, 18, 25]

def snap_to_valid_points(p):
    return min(valid_points, key=lambda x: abs(x - p))

rounded = np.array([snap_to_valid_points(p) for p in all_preds])

mae = np.mean(np.abs(all_preds - all_targets))
rmse = np.sqrt(np.mean((all_preds - all_targets) ** 2))
exact = np.mean(rounded == all_targets) * 100
within2 = np.mean(np.abs(rounded - all_targets) <= 2) * 100
within4 = np.mean(np.abs(rounded - all_targets) <= 4) * 100

print(f"\nMAE:  {mae:.4f}")
print(f"RMSE: {rmse:.4f}")
print(f"Exact match:  {exact:.1f}%")
print(f"Within ±2pts: {within2:.1f}%")
print(f"Within ±4pts: {within4:.1f}%")

print(f"\nPer-point accuracy:")
for pv in valid_points:
    mask = all_targets == pv
    if mask.sum() > 0:
        acc = np.mean(rounded[mask] == pv) * 100
        avg_p = all_preds[mask].mean()
        print(f"  Pts={pv:>2d}  n={mask.sum():>5d}  acc={acc:.1f}%  avg_pred={avg_p:.2f}")

print(f"\nSample predictions:")
print(f"{'Actual':>8} | {'Raw':>8} | {'Snap':>6}")
print("-" * 30)
for i in range(25):
    print(f"{all_targets[i]:>8.0f} | {all_preds[i]:>8.2f} | {rounded[i]:>6.0f}")

# Save config
model_config = {
    "n_constructors": n_constructors,
    "n_circuits": n_circuits,
    "embed_dim": 24,
    "hidden_dim": 128,
    "n_num": len(NORM_COLS),
}
with open("model/model_config.json", "w") as f:
    json.dump(model_config, f)

print(f"\n{'='*60}")
print("Done! Model saved to model/")
print(f"{'='*60}")
