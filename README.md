# APEX VELOCITY — F1 Race Predictor

A full-stack Formula 1 race outcome predictor that estimates championship points a driver will score in a Grand Prix based on grid position, constructor (team), circuit, and season context.

## Architecture

- **Backend**: Flask REST API + PyTorch neural network inference
- **Frontend**: React SPA (Vite + Tailwind CSS) branded "APEX VELOCITY"
- **Model**: Trained on 15+ years of historical F1 data with ~81% accuracy within 2 points

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/predict` | POST | Run model inference |
| `/api/constructors` | GET | List constructors |
| `/api/circuits` | GET | List circuits |
| `/api/years` | GET | List available years |

## Quick Start

```bash
# Backend
pip install flask flask-cors pandas numpy torch scikit-learn
python app.py

# Frontend
cd frontend
npm install
npm run dev
```

## Model

Neural network with embedding layers for constructors, circuits, and grid groups, trained on 25,000+ race entries (2009–2024).

- MAE: ~1.53 points
- Exact match: ~48.4%
- Within ±2 points: ~81.1%
