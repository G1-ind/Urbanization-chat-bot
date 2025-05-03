from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import numpy as np
import tensorflow as tf
import joblib
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.model_selection import train_test_split
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline



app = FastAPI(title="Urbanization Shift Detection API")

# ✅ Add this middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],  # Angular dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model and preprocessors
model = tf.keras.models.load_model("urbanization_model.h5")
scaler = joblib.load("scaler.pkl")
encoder = joblib.load("encoder.pkl")

numerical_features = [
    "population_density", "green_cover_percentage", "road_density",
    "nighttime_light_intensity", "water_bodies_nearby", "Male_Count",
    "Female_Count", "Year", "Slum Area Proportion (%)"
]
categorical_features = [
    "Place_Name", "Land Use Type", "Zoning Code or Urban Tier"
]

# Define the structure of the input data
# Input model
class InputData(BaseModel):
    population_density: float
    green_cover_percentage: float
    road_density: float
    nighttime_light_intensity: float
    water_bodies_nearby: float
    Male_Count: int
    Female_Count: int
    Year: int
    Slum_Area_Proportion: float
    Place_Name: str
    Land_Use_Type: str
    Zoning_Code: str
    
menu_items = [
    { "count":"1","name": "Urban Trends Analysis", "url": "/trends" },
    {"count":"2","name": "FAQ / Expert Guidance", "url": "/about"},
    {"count":"3","name": "Predict", "url": "/predict"},
    {"count":"4","name": "Policy & Planning Insights", "url": "/policy"}
]

@app.get("/")
def read_root():
    return {"message": "Urbanization Shift Detection API is live 🚀"}

@app.get("/menu")
def get_menu():
 
    return {"menu_items": menu_items}

@app.get("/trends")
def urban_trends_analysis():
    """
    Returns urbanization trends dynamically from the dataset,
    including average population and green cover percentage over years.
    """
    try:
        df = pd.read_csv("urbanization_data.csv")

        # Calculate population from Male + Female
        df["population"] = df["Male_Count"] + df["Female_Count"]

        # Group by Year and calculate averages
        trends_df = df.groupby("Year").agg({
            "population": "mean",
            "green_cover_percentage": "mean"
        }).reset_index()

        # Format data for response
        trends_list = [
            {
                "year": int(row["Year"]),
                "average_population": int(row["population"]),
                "average_green_cover_percentage": round(row["green_cover_percentage"], 2)
            }
            for _, row in trends_df.iterrows()
        ]

        return {
            "feature": "Urban Trends Analysis",
            "description": (
                "This endpoint provides dynamic insights into urbanization trends based on the dataset, "
                "including yearly averages of population and green cover percentage."
            ),
            "data": trends_list
        }

    except Exception as e:
        return {"error": str(e)}
    
@app.get("/top-shift-trends")
def top_urban_shift_trends():
    """
    Returns urbanization trends for the top 5 places with the most detected urban shifts.
    """
    try:
        df = pd.read_csv("urbanization_data.csv")

        if "label" not in df.columns:
            return {"error": "Dataset must include a 'label' column indicating urban shift (1 or 0)."}

        shift_df = df[df["label"] == 1]
        shift_counts = shift_df["Place_Name"].value_counts().nlargest(5)
        top_places = shift_counts.index.tolist()

        trends_data = []

        for place in top_places:
            place_data = shift_df[shift_df["Place_Name"] == place]
            place_data["population"] = place_data["Male_Count"] + place_data["Female_Count"]

            yearly_trend = place_data.groupby("Year").agg({
                "population": "mean",
                "green_cover_percentage": "mean"
            }).reset_index()

            trends_data.append({
                "place_name": place,
                "shift_count": int(shift_counts[place]),
                "yearly_data": [
                    {
                        "year": int(row["Year"]),
                        "average_population": int(row["population"]),
                        "average_green_cover_percentage": round(row["green_cover_percentage"], 2)
                    }
                    for _, row in yearly_trend.iterrows()
                ]
            })

        return {
            "feature": "Top 5 Urban Shift Places",
            "description": (
                "Displays yearly urban trends (population and green cover) for the top 5 places "
                "with the highest number of detected urbanization shifts."
            ),
            "data": trends_data
        }

    except Exception as e:
        return {"error": str(e)}
    
@app.get("/gender-diff-trends")
def gender_population_difference_over_time():
    """
    Returns average male and female population differences over the years.
    """
    try:
        df = pd.read_csv("urbanization_data.csv")

        # Ensure required columns exist
        required_cols = {"Year", "Male_Count", "Female_Count"}
        if not required_cols.issubset(df.columns):
            return {"error": f"Missing columns in dataset: {required_cols - set(df.columns)}"}

        # Group by year and compute average male, female counts, and their difference
        gender_trends = df.groupby("Year").agg({
            "Male_Count": "mean",
            "Female_Count": "mean"
        }).reset_index()

        gender_trends["gender_difference"] = gender_trends["Male_Count"] - gender_trends["Female_Count"]

        # Format result
        result = [
            {
                "year": int(row["Year"]),
                "avg_male_population": int(row["Male_Count"]),
                "avg_female_population": int(row["Female_Count"]),
                "gender_difference": int(row["gender_difference"])
            }
            for _, row in gender_trends.iterrows()
        ]

        return {
            "feature": "Gender Population Difference Over Time",
            "description": (
                "Shows the average male and female population and their difference over the years."
            ),
            "data": result
        }

    except Exception as e:
        return {"error": str(e)}

@app.post("/predict")
def predict(data: InputData):
    # Prepare DataFrame
    df_input = pd.DataFrame([{
        "population_density": data.population_density,
        "green_cover_percentage": data.green_cover_percentage,
        "road_density": data.road_density,
        "nighttime_light_intensity": data.nighttime_light_intensity,
        "water_bodies_nearby": data.water_bodies_nearby,
        "Male_Count": data.Male_Count,
        "Female_Count": data.Female_Count,
        "Year": data.Year,
        "Slum Area Proportion (%)": data.Slum_Area_Proportion,
        "Place_Name": data.Place_Name,
        "Land Use Type": data.Land_Use_Type,
        "Zoning Code or Urban Tier": data.Zoning_Code
    }])

    # Preprocess input
    X_num = scaler.transform(df_input[numerical_features])
    X_cat = encoder.transform(df_input[categorical_features])
    X_combined = np.concatenate([X_num, X_cat], axis=1)

    prediction = model.predict(X_combined)
    confidence = float(prediction[0][0])
    predicted_class = int(confidence > 0.5)

    shift_status = "Urbanization Shift Detected" if predicted_class else "No Significant Urbanization Shift"
    confidence_percent = round(confidence * 100, 2) if predicted_class else round((1 - confidence) * 100, 2)

    # Retrain model after prediction
    retrain_model_from_csv()

    return {
        "status": shift_status,
        "confidence_percent": confidence_percent,
        "retraining": "Triggered"
    }

# Retraining function
def retrain_model_from_csv():
    try:
        df = pd.read_csv("urbanization_data.csv")
        X = df[numerical_features + categorical_features]
        y = df["label"]

        # Preprocessing
        new_scaler = StandardScaler()
        X_num = new_scaler.fit_transform(X[numerical_features])

        new_encoder = OneHotEncoder(handle_unknown='ignore', sparse=False)
        X_cat = encoder.transform(df_input[categorical_features])


        X_combined = np.concatenate([X_num, X_cat], axis=1)

        X_train, X_test, y_train, y_test = train_test_split(X_combined, y, test_size=0.2, random_state=42)

        # Model
        new_model = Sequential([
            Dense(32, activation='relu', input_shape=(X_combined.shape[1],)),
            Dense(16, activation='relu'),
            Dense(1, activation='sigmoid')
        ])
        new_model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
        new_model.fit(X_train, y_train, epochs=20, batch_size=16, verbose=0)

        new_model.save("urbanization_model.h5")
        joblib.dump(new_scaler, "scaler.pkl")
        joblib.dump(new_encoder, "encoder.pkl")

    except Exception as e:
        print("Retraining error:", e)
  
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
    
@app.get("/urbanization-vs-road-density")
def urbanization_vs_road_density():
    """
    Returns the relationship between urbanization and road density over time.
    This shows the average road density and percentage of urbanization shifts for each year.
    """
    try:
        df = pd.read_csv("urbanization_data.csv")

        # Ensure required columns exist
        required_cols = {"Year", "road_density", "label"}
        if not required_cols.issubset(df.columns):
            return {"error": f"Missing columns in dataset: {required_cols - set(df.columns)}"}

        # Group by Year and calculate average road density
        urbanization_data = df.groupby("Year").agg({
            "road_density": "mean",
            "label": "mean"  # Average of label will give the percentage of urban shifts
        }).reset_index()

        # Format data for response
        result = [
            {
                "year": int(row["Year"]),
                "average_road_density": round(row["road_density"], 2),
                "urbanization_shift_percentage": round(row["label"] * 100, 2)
            }
            for _, row in urbanization_data.iterrows()
        ]

        return {
            "feature": "Urbanization vs Road Density Over Time",
            "description": (
                "This endpoint shows the relationship between road density and urbanization shift "
                "percentage over the years. It provides insights on how road density might correlate with urbanization."
            ),
            "data": result
        }

    except Exception as e:
        return {"error": str(e)}
    
@app.get("/nighttime-intensity-trends")
def nighttime_light_intensity_trends():
    """
    Returns average nighttime light intensity over the years.
    """
    try:
        df = pd.read_csv("urbanization_data.csv")

        if "Year" not in df.columns or "nighttime_light_intensity" not in df.columns:
            return {"error": "Missing required columns in dataset."}

        # Group by year and calculate average nighttime light intensity
        intensity_trends = df.groupby("Year")["nighttime_light_intensity"].mean().reset_index()

        # Format result
        result = [
            {
                "year": int(row["Year"]),
                "average_nighttime_light_intensity": round(row["nighttime_light_intensity"], 2)
            }
            for _, row in intensity_trends.iterrows()
        ]

        return {
            "feature": "Nighttime Light Intensity Trends",
            "description": (
                "This endpoint shows the average nighttime light intensity over the years. "
                "It can be used as an indicator of increasing urban activity and infrastructure."
            ),
            "data": result
        }

    except Exception as e:
        return {"error": str(e)}
