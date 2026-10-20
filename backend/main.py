"""
FastAPI backend for Disease Prediction ML Application.

Endpoints:
  GET  /              - Root info
  GET  /health        - Health check
  GET  /models        - Available models info
  GET  /metrics       - All model training metrics
  GET  /metrics/{key} - Metrics for a specific disease
  POST /predict/heart       - Heart disease prediction
  POST /predict/diabetes    - Diabetes prediction
  POST /predict/breast-cancer - Breast cancer prediction
"""

import os
import sys
import logging
from pathlib import Path

# Ensure backend root is in path
BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIST = Path(BACKEND_DIR).parent / "frontend" / "dist"
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles

from schemas.models import (
    HeartDiseaseInput,
    DiabetesInput,
    BreastCancerInput,
    PredictionResponse,
)
from utils.predict import load_metrics, run_prediction

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Disease Prediction API",
    description="ML-powered disease risk prediction for Heart Disease, Diabetes, and Breast Cancer.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

HEART_FEATURES = [
    "age", "sex", "cp", "trestbps", "chol", "fbs",
    "restecg", "thalach", "exang", "oldpeak", "slope", "ca", "thal"
]
DIABETES_FEATURES = [
    "Pregnancies", "Glucose", "BloodPressure", "SkinThickness",
    "Insulin", "BMI", "DiabetesPedigreeFunction", "Age"
]
BREAST_CANCER_FEATURES = [
    "mean_radius", "mean_texture", "mean_perimeter", "mean_area",
    "mean_smoothness", "mean_compactness", "mean_concavity",
    "mean_concave_points", "mean_symmetry", "mean_fractal_dimension",
    "radius_error", "texture_error", "perimeter_error", "area_error",
    "smoothness_error", "compactness_error", "concavity_error",
    "concave_points_error", "symmetry_error", "fractal_dimension_error",
    "worst_radius", "worst_texture", "worst_perimeter", "worst_area",
    "worst_smoothness", "worst_compactness", "worst_concavity",
    "worst_concave_points", "worst_symmetry", "worst_fractal_dimension"
]


@app.get("/")
def root():
    index_file = FRONTEND_DIST / "index.html"
    if index_file.is_file():
        return FileResponse(index_file)
    return {
        "message": "Disease Prediction API is running",
        "version": "1.0.0",
        "diseases": ["Heart Disease", "Diabetes", "Breast Cancer"],
        "algorithms": ["Logistic Regression", "SVM", "Random Forest", "XGBoost"],
        "docs": "/docs"
    }


@app.get("/health")
def health_check():
    try:
        metrics = load_metrics()
        models_loaded = list(metrics.keys())
        return {
            "status": "healthy",
            "models_available": models_loaded,
            "model_count": len(models_loaded)
        }
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Service unavailable: {str(e)}")


@app.get("/models")
def get_models():
    try:
        metrics = load_metrics()
        result = {}
        for disease_key, disease_data in metrics.items():
            result[disease_key] = {
                "disease_name": disease_data.get("disease_name"),
                "best_model": disease_data.get("best_model"),
                "features": disease_data.get("features", []),
                "train_samples": disease_data.get("train_sample_size"),
                "test_samples": disease_data.get("test_sample_size"),
            }
        return result
    except FileNotFoundError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        logger.error(f"Error in /models: {e}")
        raise HTTPException(status_code=500, detail="Failed to load model info")


@app.get("/metrics")
def get_all_metrics():
    try:
        return load_metrics()
    except FileNotFoundError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        logger.error(f"Error in /metrics: {e}")
        raise HTTPException(status_code=500, detail="Failed to load metrics")


@app.get("/metrics/{disease_key}")
def get_disease_metrics(disease_key: str):
    valid_keys = ["heart", "diabetes", "breast_cancer"]
    if disease_key not in valid_keys:
        raise HTTPException(
            status_code=404,
            detail=f"Unknown disease key '{disease_key}'. Valid keys: {valid_keys}"
        )
    try:
        metrics = load_metrics()
        return metrics.get(disease_key, {})
    except FileNotFoundError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        logger.error(f"Error in /metrics/{disease_key}: {e}")
        raise HTTPException(status_code=500, detail="Failed to load metrics")


@app.post("/predict/heart", response_model=PredictionResponse)
def predict_heart_disease(data: HeartDiseaseInput):
    try:
        values = [getattr(data, f) for f in HEART_FEATURES]
        result = run_prediction(
            disease_key="heart",
            disease_name="Heart Disease",
            features=HEART_FEATURES,
            values=values,
        )
        return result
    except FileNotFoundError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        logger.error(f"Heart prediction error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Prediction failed. Please check input values.")


@app.post("/predict/diabetes", response_model=PredictionResponse)
def predict_diabetes(data: DiabetesInput):
    try:
        values = [getattr(data, f) for f in DIABETES_FEATURES]
        result = run_prediction(
            disease_key="diabetes",
            disease_name="Diabetes",
            features=DIABETES_FEATURES,
            values=values,
        )
        return result
    except FileNotFoundError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        logger.error(f"Diabetes prediction error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Prediction failed. Please check input values.")


@app.post("/predict/breast-cancer", response_model=PredictionResponse)
def predict_breast_cancer(data: BreastCancerInput):
    try:
        values = [getattr(data, f) for f in BREAST_CANCER_FEATURES]
        result = run_prediction(
            disease_key="breast_cancer",
            disease_name="Breast Cancer",
            features=BREAST_CANCER_FEATURES,
            values=values,
        )
        return result
    except FileNotFoundError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        logger.error(f"Breast cancer prediction error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Prediction failed. Please check input values.")


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "An unexpected error occurred. Please try again."}
    )


# Registered after API routes so existing prediction endpoints take priority.
# The pre-built React app is versioned with the project for one-service hosting.
if FRONTEND_DIST.is_dir():
    app.mount("/", StaticFiles(directory=FRONTEND_DIST, html=True), name="frontend")
