"""Utility functions for prediction and model loading."""

import os
import json
import joblib
import numpy as np
import pandas as pd
from typing import Dict, Any, Tuple

BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(BACKEND_DIR, "models")

_model_cache: Dict[str, Any] = {}
_metrics_cache: Dict[str, Any] = {}


def load_model(disease_key: str):
    """Load model from disk (cached)."""
    if disease_key not in _model_cache:
        model_path = os.path.join(MODELS_DIR, f"{disease_key}_model.pkl")
        if not os.path.exists(model_path):
            raise FileNotFoundError(
                f"Model file not found: {model_path}. "
                f"Please run 'python training/train_all.py' first."
            )
        _model_cache[disease_key] = joblib.load(model_path)
    return _model_cache[disease_key]


def load_metrics() -> Dict[str, Any]:
    """Load metrics from disk (cached)."""
    if not _metrics_cache:
        metrics_path = os.path.join(MODELS_DIR, "metrics.json")
        if not os.path.exists(metrics_path):
            raise FileNotFoundError(
                f"Metrics file not found: {metrics_path}. "
                f"Please run 'python training/train_all.py' first."
            )
        with open(metrics_path) as f:
            data = json.load(f)
        _metrics_cache.update(data)
    return dict(_metrics_cache)


def get_risk_category(probability: float) -> str:
    """Classify probability into a risk category."""
    if probability <= 0.30:
        return "Lower Risk"
    elif probability <= 0.60:
        return "Moderate Risk"
    else:
        return "Higher Risk"


def run_prediction(
    disease_key: str,
    disease_name: str,
    features: list,
    values: list
) -> Dict[str, Any]:
    """
    Core prediction function. Runs the trained pipeline on input data.
    Returns prediction, probability and metadata.
    """
    model = load_model(disease_key)
    metrics = load_metrics()

    input_df = pd.DataFrame([dict(zip(features, values))])
    
    prediction = int(model.predict(input_df)[0])
    probabilities = model.predict_proba(input_df)[0]
    probability = float(probabilities[1])  # probability of positive class (disease present)

    risk_category = get_risk_category(probability)

    model_name = metrics.get(disease_key, {}).get("best_model", "Unknown Model")

    if prediction == 1:
        result_label = "Higher Risk"
    else:
        result_label = "Lower Risk"

    return {
        "disease": disease_name,
        "prediction": prediction,
        "result": result_label,
        "probability": round(probability, 4),
        "risk_category": risk_category,
        "model": model_name,
        "disclaimer": (
            "This prediction is for educational purposes only. "
            "It is NOT a medical diagnosis. "
            "Please consult a qualified healthcare professional for medical advice."
        )
    }
