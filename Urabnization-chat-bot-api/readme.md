# 🌆 Urbanization Shift Detection API

This FastAPI backend serves a deep learning model that predicts urbanization shifts based on geospatial and infrastructure-related features. It is part of a chatbot-driven dashboard powered by a U-Net architecture.

---

## 🚀 Features

- Predicts whether a region is experiencing urbanization shift
- Accepts structured data inputs (e.g., population density, green cover)
- Returns prediction class with confidence score
- Provides statistical summaries via API
- Designed to integrate with an Angular chatbot frontend

---

## 📦 Requirements

Install dependencies via:

```bash
pip install -r requirements.txt
```

Typical dependencies include:

- `fastapi`
- `uvicorn`
- `tensorflow`
- `scikit-learn`
- `joblib`
- `numpy`

> ✅ Ensure `urbanization_model.h5` and `scaler.pkl` are in the project root.

---

## 📁 Project Structure

```
urbanization-api/
│
├── main.py                 # FastAPI app
├── urbanization_model.h5   # Trained deep learning model
├── scaler.pkl              # Scaler used during model training
├── requirements.txt        # Dependencies
└── sample_data.csv         # (Optional) Sample test data
```

---

## ⚙️ Running the API

```bash
uvicorn main:app --reload
```

Visit [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) to explore the interactive Swagger UI.

---

## 📡 API Endpoints

### `GET /`
Health check – confirms API is running.

### `POST /predict`
Sends structured input to the model for prediction.

**Input JSON Example:**

```json
{
  "population_density": 1800.0,
  "green_cover_percentage": 18.5,
  "road_density": 9.2,
  "nighttime_light_intensity": 75.0,
  "water_bodies_nearby": 2.0
}
```

**Response Example:**

```json
{
  "status": "Urbanization Shift Detected",
  "confidence_percent": 82.46,
  "interpretation": "The model is 82.46% confident that this region is experiencing: 'Urbanization Shift Detected'.",
  "input_summary": {
    "population_density": 1800.0,
    "green_cover_percentage": 18.5,
    "road_density": 9.2,
    "nighttime_light_intensity": 75.0,
    "water_bodies_nearby": 2.0
  }
}
```

---

### `GET /stats`
Returns summary stats based on the model's predictions over your dataset.

---

## 🔐 CORS Support

If you're connecting from a frontend like Angular:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or restrict to ["http://localhost:4200"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 👷‍♂️ Developer Notes

- Model trained using satellite image-derived tabular features
- Adjust threshold or features based on your use case
- Add more endpoints for bulk prediction or file upload if needed

---

## 📬 Contact

Need help or want to collaborate? Feel free to reach out.

---

Would you like me to generate this as a downloadable `README.md` file too?