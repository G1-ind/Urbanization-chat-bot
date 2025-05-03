import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
import tensorflow as tf
import joblib

# Load your CSV
df = pd.read_csv("urbanization_data.csv")

# Define the label and features
label_col = "urban_shift"  # You must have this in your CSV
numeric_features = [
    "population_density",
    "green_cover_percentage",
    "road_density",
    "nighttime_light_intensity",
    "water_bodies_nearby",
    "Male_Count",
    "Female_Count",
    "Year",
    "Slum Area Proportion (%)"
]

categorical_features = ["Place_Name", "Land Use Type", "Zoning Code or Urban Tier"]

X = df[numeric_features + categorical_features]
y = df[label_col]

# Create the preprocessor
preprocessor = ColumnTransformer(transformers=[
    ("num", StandardScaler(), numeric_features),
    ("cat", OneHotEncoder(handle_unknown="ignore", sparse_output=False), categorical_features)
])

# Preprocess and split data
X_processed = preprocessor.fit_transform(X)
X_train, X_test, y_train, y_test = train_test_split(X_processed, y, test_size=0.2, random_state=42)

# Define a simple model
model = tf.keras.Sequential([
    tf.keras.layers.Dense(64, activation='relu', input_shape=(X_processed.shape[1],)),
    tf.keras.layers.Dense(32, activation='relu'),
    tf.keras.layers.Dense(1, activation='sigmoid')
])

model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
model.fit(X_train, y_train, epochs=10, batch_size=16, validation_data=(X_test, y_test))

# Save the components
model.save("urbanization_model.h5")
joblib.dump(preprocessor.named_transformers_["num"], "scaler.pkl")
joblib.dump(preprocessor.named_transformers_["cat"], "encoder.pkl")

print("✅ Model, scaler, and encoder saved.")
