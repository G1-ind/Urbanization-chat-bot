from turtle import pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import tensorflow as tf
import joblib
import pandas as pd


app = FastAPI(title="Urbanization Shift Detection API")

# ✅ Add this middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],  # Angular dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load your trained model and scaler
model = tf.keras.models.load_model("urbanization_model.h5")
scaler = joblib.load("scaler.pkl")  # Make sure this file exists

# Define the structure of the input data
class InputData(BaseModel):
    population_density: float
    green_cover_percentage: float
    road_density: float
    nighttime_light_intensity: float
    water_bodies_nearby: float
    # Add more features based on your dataset

@app.get("/")
def read_root():
    return {"message": "Urbanization Shift Detection API is live 🚀"}

@app.post("/predict")
def predict(data: InputData):
    # Convert incoming data to NumPy array
    input_array = np.array([[ 
        data.population_density, 
        data.green_cover_percentage, 
        data.road_density, 
        data.nighttime_light_intensity,
        data.water_bodies_nearby,
        # Add more if needed
    ]])

    # Scale input using the same scaler used during training
    input_scaled = scaler.transform(input_array)

    # Make prediction
    # Predict using the model
    prediction = model.predict(input_scaled)
    confidence = float(prediction[0][0])
    predicted_class = int(confidence > 0.5)

    # Interpretation
    shift_status = "Urbanization Shift Detected" if predicted_class == 1 else "No Significant Urbanization Shift"
    confidence_percent = round(confidence * 100, 2) if predicted_class == 1 else round((1 - confidence) * 100, 2)

    return {
        "status": shift_status,
        "confidence_percent": confidence_percent,
        "interpretation": f"The model is {confidence_percent}% confident that this region is experiencing: '{shift_status}'.",
        "input_summary": {
            "population_density": data.population_density,
            "green_cover_percentage": data.green_cover_percentage,
            "road_density": data.road_density,
            "nighttime_light_intensity": data.nighttime_light_intensity,
            "water_bodies_nearby": data.water_bodies_nearby, # Useful if comparing prediction with ground truth
        }
    }
    
@app.get("/stats")
def get_urbanization_stats():
    try:
        df = pd.read_csv("urbanization_data.csv")

        feature_cols = [
            "population_density",
            "green_cover_percentage",
            "road_density",
            "nighttime_light_intensity",
            "water_bodies_nearby"
        ]
        input_data = df[feature_cols]
        scaled_data = scaler.transform(input_data)
        predictions = model.predict(scaled_data)

        predicted_classes = (predictions > 0.5).astype(int).flatten()
        confidence_scores = predictions.flatten()

        total = len(df)
        shifts = int(predicted_classes.sum())
        no_shifts = total - shifts
        avg_confidence = float(np.mean(confidence_scores))

        return {
            "total_samples": total,
            "urban_shifts_detected": shifts,
            "no_shift_detected": no_shifts,
            "urban_shift_percentage": round((shifts / total) * 100, 2),
            "average_model_confidence": round(avg_confidence * 100, 2),
        }
        
    except Exception as e:
        return {"error": str(e)}