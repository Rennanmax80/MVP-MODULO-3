from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import joblib
import numpy as np
import pandas as pd
import uvicorn
from pathlib import Path
from schemas import CarEvaluationData

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "model.pkl"

CLASS_LABELS = {
    "unacc": "Inaceitavel",
    "acc": "Aceitavel",
    "good": "Bom",
    "vgood": "Muito Bom",
}


def load_model():
    if not MODEL_PATH.exists():
        raise RuntimeError(
            f"Model file not found at {MODEL_PATH}. Train/export a model first."
        )

    if MODEL_PATH.stat().st_size == 0:
        raise RuntimeError(
            f"Model file at {MODEL_PATH} is empty/corrupted. Re-export model.pkl."
        )

    return joblib.load(MODEL_PATH)


model = load_model()

@app.get("/")
def home():
    return {"message": "Vehicle Evaluation API"}

@app.post("/predict")
def predict(data: CarEvaluationData):
    input_data = pd.DataFrame([
        {
            "buying": data.buying,
            "maint": data.maint,
            "doors": data.doors,
            "persons": data.persons,
            "lug_boot": data.lug_boot,
            "safety": data.safety,
        }
    ])

    prediction = str(model.predict(input_data)[0])
    confidence = None

    if hasattr(model, "predict_proba"):
        probabilities = model.predict_proba(input_data)[0]
        class_names = [str(class_name) for class_name in model.classes_]
        confidence = float(probabilities[class_names.index(prediction)])

    return {
        "prediction": prediction,
        "prediction_label": CLASS_LABELS.get(prediction, prediction),
        "confidence": confidence,
    }


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)