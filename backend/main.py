"""
FastAPI backend for MedPredict AI — Disease Prediction & Clinical SaaS Platform.

Endpoints:
  GET  /                      - Root info
  GET  /health                - Health check + models status
  GET  /models                - Available models info
  GET  /metrics               - All model training metrics
  GET  /metrics/{key}         - Metrics for a specific disease
  POST /auth/register         - Clinician/User registration
  POST /auth/login            - Clinician/User authentication
  GET  /auth/me               - Current authenticated user profile
  GET  /history               - Authenticated user's prediction history
  POST /history               - Save prediction to user history
  DELETE /history/{id}        - Delete history item
  DELETE /history             - Clear user's prediction history
  POST /predict/heart         - Heart disease prediction
  POST /predict/diabetes      - Diabetes prediction
  POST /predict/breast-cancer - Breast cancer prediction
"""

import os
import sys
import logging
import urllib.parse
import hashlib
from typing import Optional, List, Dict, Any

BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from fastapi import FastAPI, HTTPException, Depends, Header, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from schemas.models import (
    HeartDiseaseInput,
    DiabetesInput,
    BreastCancerInput,
    PredictionResponse,
)
from schemas.auth import (
    UserRegisterInput,
    UserLoginInput,
    UserResponse,
    AuthResponse,
    SaveHistoryInput,
    HistoryItemResponse,
)
from utils.predict import load_metrics, run_prediction
from utils.auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
    get_optional_user,
)
from utils.db import (
    init_db,
    create_user,
    get_user_by_email,
    get_user_by_id,
    save_prediction,
    get_user_history,
    delete_history_item,
    clear_user_history,
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize database tables
init_db()

ALLOWED_ORIGINS = [
    "https://akash2025it-gif.github.io",
    "http://localhost:5173",
    "http://localhost:4173",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:8000",
]

app = FastAPI(
    title="MedPredict AI — Clinical Intelligence & Disease Risk Platform",
    description=(
        "Enterprise-grade machine-learning disease risk estimation for Heart Disease, "
        "Diabetes, and Breast Cancer with clinician authentication and telemetry history."
    ),
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    redirect_slashes=False,
)

class VercelPathMiddleware:
    """
    ASGI middleware ensuring incoming requests on Vercel retain their original request paths.
    
    When Vercel processes rewrites (e.g. /(.*) -> /api/index.py?__path=/$1),
    the original request path is captured in the '__path' query parameter or headers.
    This middleware detects '__path' in query_string, extracts it as scope['path'],
    and cleans query_string so FastAPI routes (GET /health, POST /auth/login,
    POST /predict/heart) match seamlessly.
    """
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope.get("type") == "http":
            # 1. Check if rewritten query string has __path=
            qs_bytes = scope.get("query_string", b"")
            if b"__path=" in qs_bytes:
                qs = qs_bytes.decode("utf-8", errors="ignore")
                params = urllib.parse.parse_qs(qs)
                if "__path" in params and params["__path"]:
                    target_path = params["__path"][0]
                    if not target_path.startswith("/"):
                        target_path = "/" + target_path
                    if len(target_path) > 1 and target_path.endswith("/"):
                        target_path = target_path.rstrip("/")
                    scope["path"] = target_path
                    scope["raw_path"] = target_path.encode("utf-8")

                    # Strip __path from query_string
                    cleaned = {k: v for k, v in params.items() if k != "__path"}
                    scope["query_string"] = urllib.parse.urlencode(cleaned, doseq=True).encode("utf-8")

            path = scope.get("path", "")
            # 2. Check if path still points to serverless entrypoint without __path query
            if path in ("/main.py", "/api/index", "/api/index.py", "/api", "/api/"):
                headers = dict(scope.get("headers", []))
                for header_name in (b"x-matched-path", b"x-forwarded-uri", b"x-original-uri", b"x-rewrite-url"):
                    val = headers.get(header_name)
                    if val:
                        raw_str = val.decode("utf-8", errors="ignore").split("?")[0]
                        if raw_str and raw_str not in ("/main.py", "/api/index", "/api/index.py"):
                            scope["path"] = raw_str
                            scope["raw_path"] = raw_str.encode("utf-8")
                            break
                else:
                    scope["path"] = "/"
                    scope["raw_path"] = b"/"

            # 3. If path starts with /api/ (e.g. /api/predict/heart), strip prefix so both /predict/... and /api/predict/... work
            current_path = scope.get("path", "")
            if current_path.startswith("/api/") and current_path not in ("/api/docs", "/api/redoc", "/api/openapi.json"):
                new_path = current_path[4:]
                scope["path"] = new_path
                scope["raw_path"] = new_path.encode("utf-8")

            # 4. Trailing slash normalization: strip trailing slash for non-root paths
            current_path = scope.get("path", "")
            if len(current_path) > 1 and current_path.endswith("/"):
                normalized = current_path.rstrip("/")
                scope["path"] = normalized
                scope["raw_path"] = normalized.encode("utf-8")

        await self.app(scope, receive, send)

app.add_middleware(VercelPathMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_origin_regex=r"^https:\/\/.*\.github\.io$|^https:\/\/.*\.vercel\.app$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

HEART_FEATURES = [
    "age", "sex", "cp", "trestbps", "chol", "fbs",
    "restecg", "thalach", "exang", "oldpeak", "slope", "ca", "thal",
]
DIABETES_FEATURES = [
    "Pregnancies", "Glucose", "BloodPressure", "SkinThickness",
    "Insulin", "BMI", "DiabetesPedigreeFunction", "Age",
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
    "worst_concave_points", "worst_symmetry", "worst_fractal_dimension",
]


# ---------------------------------------------------------------------------
# System & Information Endpoints
# ---------------------------------------------------------------------------
@app.get("/")
def root():
    return {
        "message": "MedPredict AI — Clinical Intelligence API",
        "version": "2.0.0",
        "status": "online",
        "diseases": ["Heart Disease", "Diabetes", "Breast Cancer"],
        "algorithms": ["Logistic Regression", "SVM", "Random Forest", "XGBoost"],
        "docs": "/docs",
        "disclaimer": (
            "MedPredict AI provides clinical decision support risk analytics. "
            "Outputs represent probabilistic risk scores to assist professional clinical evaluation."
        ),
    }


@app.get("/health")
def health_check():
    try:
        metrics = load_metrics()
        models_loaded = list(metrics.keys())
        return {
            "status": "healthy",
            "models_available": models_loaded,
            "model_count": len(models_loaded),
        }
    except Exception as e:
        logger.error(f"Health check failed: {e}")
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
            detail=f"Unknown disease key '{disease_key}'. Valid keys: {valid_keys}",
        )
    try:
        metrics = load_metrics()
        return metrics.get(disease_key, {})
    except FileNotFoundError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        logger.error(f"Error in /metrics/{disease_key}: {e}")
        raise HTTPException(status_code=500, detail="Failed to load metrics")


# ---------------------------------------------------------------------------
# Authentication Endpoints
# ---------------------------------------------------------------------------
@app.post("/auth/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def register(data: UserRegisterInput):
    """Register a new clinician or user account."""
    existing = get_user_by_email(data.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists.",
        )
    pw_hash = hash_password(data.password)
    user = create_user(email=data.email, name=data.name, password_hash=pw_hash)
    token = create_access_token({"sub": user["id"], "email": user["email"], "name": user["name"]})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user,
    }


@app.post("/auth/login", response_model=AuthResponse)
def login(data: UserLoginInput):
    """Authenticate clinician with email and password."""
    user = get_user_by_email(data.email)
    if not user or not verify_password(data.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    token = create_access_token({"sub": user["id"], "email": user["email"], "name": user["name"]})
    user_info = {
        "id": user["id"],
        "email": user["email"],
        "name": user["name"],
        "created_at": user.get("created_at"),
    }
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user_info,
    }


@app.get("/auth/me", response_model=UserResponse)
def get_current_user_profile(user: dict = Depends(get_current_user)):
    """Fetch current authenticated user profile."""
    return user


@app.post("/auth/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(authorization: Optional[str] = Header(None), user: dict = Depends(get_current_user)):
    """Invalidate the current JWT until it expires."""
    from utils.auth import decode_access_token
    from utils.db import revoke_token

    token = authorization.split()[1]
    payload = decode_access_token(token) or {}
    revoke_token(hashlib.sha256(token.encode("utf-8")).hexdigest(), int(payload.get("exp", 0)))
    return None


# ---------------------------------------------------------------------------
# Prediction History Endpoints
# ---------------------------------------------------------------------------
@app.get("/history", response_model=List[HistoryItemResponse])
def get_history(user: dict = Depends(get_current_user)):
    """Fetch logged-in user's longitudinal prediction history."""
    try:
        return get_user_history(user["id"])
    except Exception as e:
        logger.error(f"Error fetching history: {e}")
        raise HTTPException(status_code=500, detail="Could not load prediction history.")


@app.post("/history", response_model=HistoryItemResponse, status_code=status.HTTP_201_CREATED)
def save_history_entry(data: SaveHistoryInput, user: dict = Depends(get_current_user)):
    """Manually or explicitly save a prediction result to user's history."""
    try:
        saved = save_prediction(
            user_id=user["id"],
            disease=data.disease,
            prediction=data.prediction,
            result=data.result,
            probability=data.probability,
            risk_category=data.risk_category,
            model=data.model,
            inputs=data.inputs,
        )
        return saved
    except Exception as e:
        logger.error(f"Error saving history: {e}")
        raise HTTPException(status_code=500, detail="Failed to save prediction record.")


@app.delete("/history/{item_id}", status_code=status.HTTP_200_OK)
def delete_history_entry(item_id: int, user: dict = Depends(get_current_user)):
    """Delete a specific prediction entry."""
    success = delete_history_item(user["id"], item_id)
    if not success:
        raise HTTPException(status_code=404, detail="History entry not found or access denied.")
    return {"status": "success", "message": f"History entry {item_id} deleted."}


@app.delete("/history", status_code=status.HTTP_200_OK)
def clear_all_history(user: dict = Depends(get_current_user)):
    """Clear all prediction records for the current user."""
    count = clear_user_history(user["id"])
    return {"status": "success", "message": f"Cleared {count} history records."}


# ---------------------------------------------------------------------------
# Prediction Endpoints
# ---------------------------------------------------------------------------
@app.post("/predict/heart", response_model=PredictionResponse)
def predict_heart_disease(
    data: HeartDiseaseInput,
    authorization: Optional[str] = Header(None),
):
    try:
        values = [getattr(data, f) for f in HEART_FEATURES]
        result = run_prediction(
            disease_key="heart",
            disease_name="Heart Disease",
            features=HEART_FEATURES,
            values=values,
        )

        # Automatically record to history if authenticated
        user = get_optional_user(authorization)
        if user:
            try:
                input_dict = {f: getattr(data, f) for f in HEART_FEATURES}
                save_prediction(
                    user_id=user["id"],
                    disease="Heart Disease",
                    prediction=result["prediction"],
                    result=result["result"],
                    probability=result["probability"],
                    risk_category=result["risk_category"],
                    model=result["model"],
                    inputs=input_dict,
                )
            except Exception as e:
                logger.warning(f"Auto-save to history failed: {e}")

        return result
    except FileNotFoundError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        logger.error(f"Heart prediction error: {e}", exc_info=True)
        raise HTTPException(
            status_code=500, detail="Prediction failed. Please check input values."
        )


@app.post("/predict/diabetes", response_model=PredictionResponse)
def predict_diabetes(
    data: DiabetesInput,
    authorization: Optional[str] = Header(None),
):
    try:
        values = [getattr(data, f) for f in DIABETES_FEATURES]
        result = run_prediction(
            disease_key="diabetes",
            disease_name="Diabetes",
            features=DIABETES_FEATURES,
            values=values,
        )

        # Automatically record to history if authenticated
        user = get_optional_user(authorization)
        if user:
            try:
                input_dict = {f: getattr(data, f) for f in DIABETES_FEATURES}
                save_prediction(
                    user_id=user["id"],
                    disease="Diabetes",
                    prediction=result["prediction"],
                    result=result["result"],
                    probability=result["probability"],
                    risk_category=result["risk_category"],
                    model=result["model"],
                    inputs=input_dict,
                )
            except Exception as e:
                logger.warning(f"Auto-save to history failed: {e}")

        return result
    except FileNotFoundError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        logger.error(f"Diabetes prediction error: {e}", exc_info=True)
        raise HTTPException(
            status_code=500, detail="Prediction failed. Please check input values."
        )


@app.post("/predict/breast-cancer", response_model=PredictionResponse)
def predict_breast_cancer(
    data: BreastCancerInput,
    authorization: Optional[str] = Header(None),
):
    try:
        values = [getattr(data, f) for f in BREAST_CANCER_FEATURES]
        result = run_prediction(
            disease_key="breast_cancer",
            disease_name="Breast Cancer",
            features=BREAST_CANCER_FEATURES,
            values=values,
        )

        # Automatically record to history if authenticated
        user = get_optional_user(authorization)
        if user:
            try:
                input_dict = {f: getattr(data, f) for f in BREAST_CANCER_FEATURES}
                save_prediction(
                    user_id=user["id"],
                    disease="Breast Cancer",
                    prediction=result["prediction"],
                    result=result["result"],
                    probability=result["probability"],
                    risk_category=result["risk_category"],
                    model=result["model"],
                    inputs=input_dict,
                )
            except Exception as e:
                logger.warning(f"Auto-save to history failed: {e}")

        return result
    except FileNotFoundError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        logger.error(f"Breast cancer prediction error: {e}", exc_info=True)
        raise HTTPException(
            status_code=500, detail="Prediction failed. Please check input values."
        )


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "An unexpected error occurred. Please try again."},
    )
