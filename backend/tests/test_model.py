from pathlib import Path

import joblib
import pandas as pd
from sklearn.metrics import accuracy_score, f1_score
from sklearn.model_selection import train_test_split


DATASET_URL = "https://archive.ics.uci.edu/ml/machine-learning-databases/car/car.data"
DATASET_COLUMNS = ["buying", "maint", "doors", "persons", "lug_boot", "safety", "class"]
MIN_ACCURACY = 0.95
MIN_MACRO_F1 = 0.95


def test_model_meets_performance_threshold():
    model_path = Path("model.pkl")
    model = joblib.load(model_path)

    df = pd.read_csv(DATASET_URL, names=DATASET_COLUMNS)
    X = df.drop(columns=["class"])
    y = df["class"]

    _, X_test, _, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    predictions = model.predict(X_test)

    accuracy = accuracy_score(y_test, predictions)
    macro_f1 = f1_score(y_test, predictions, average="macro")

    assert accuracy >= MIN_ACCURACY, f"Accuracy abaixo do minimo: {accuracy:.4f}"
    assert macro_f1 >= MIN_MACRO_F1, f"Macro F1 abaixo do minimo: {macro_f1:.4f}"