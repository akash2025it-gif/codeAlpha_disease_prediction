"""
Integration test suite for MedPredict AI FastAPI backend endpoints.
Verifies health, authentication, machine learning inference for all 3 diseases,
user telemetry history persistence, and Vercel path normalization middleware.
"""
import os
import sys

# Add backend directory to module search path
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from main import (
    root,
    health_check,
    login,
    predict_heart_disease,
    predict_diabetes,
    predict_breast_cancer,
    get_history,
    VercelPathMiddleware,
)
from schemas.auth import UserLoginInput
from schemas.models import HeartDiseaseInput, DiabetesInput, BreastCancerInput


def test_system_endpoints():
    r = root()
    assert r["status"] == "online"
    assert "Heart Disease" in r["diseases"]

    h = health_check()
    assert h["status"] == "healthy"
    assert "heart" in h["models_available"]
    assert "diabetes" in h["models_available"]
    assert "breast_cancer" in h["models_available"]
    print("PASS: System & Health endpoints")


def test_auth_and_predictions():
    # Login with demo clinician
    creds = UserLoginInput(email="doctor@medpredict.ai", password="MedicalAI2026!")
    auth = login(creds)
    assert auth["access_token"]
    assert auth["user"]["name"] == "Dr. Sarah Mitchell"
    token = auth["access_token"]
    auth_header = f"Bearer {token}"
    print("PASS: Clinician authentication")

    # 1. Heart disease prediction (Cleveland UCI)
    heart_data = HeartDiseaseInput(
        age=45, sex=0, cp=1, trestbps=118, chol=195,
        fbs=0, restecg=0, thalach=168, exang=0, oldpeak=0.2,
        slope=1, ca=0, thal=3
    )
    heart_res = predict_heart_disease(heart_data, auth_header)
    assert heart_res["disease"] == "Heart Disease"
    assert heart_res["result"] in ["Lower Risk", "Higher Risk"]
    assert 0.0 <= heart_res["probability"] <= 1.0
    print("PASS: Heart disease prediction inference")

    # 2. Diabetes prediction (Pima Indians)
    diab_data = DiabetesInput(
        Pregnancies=1, Glucose=85, BloodPressure=66, SkinThickness=20,
        Insulin=79, BMI=22.5, DiabetesPedigreeFunction=0.238, Age=25
    )
    diab_res = predict_diabetes(diab_data, auth_header)
    assert diab_res["disease"] == "Diabetes"
    assert diab_res["result"] in ["Lower Risk", "Higher Risk"]
    assert 0.0 <= diab_res["probability"] <= 1.0
    print("PASS: Diabetes prediction inference")

    # 3. Breast Cancer prediction (Wisconsin WDBC)
    bc_dict = {
        "mean_radius": 13.54, "mean_texture": 14.36, "mean_perimeter": 87.46, "mean_area": 566.3,
        "mean_smoothness": 0.0978, "mean_compactness": 0.0813, "mean_concavity": 0.0666,
        "mean_concave_points": 0.0478, "mean_symmetry": 0.1885, "mean_fractal_dimension": 0.0577,
        "radius_error": 0.2699, "texture_error": 0.7886, "perimeter_error": 2.058, "area_error": 23.56,
        "smoothness_error": 0.0085, "compactness_error": 0.0146, "concavity_error": 0.0239,
        "concave_points_error": 0.0132, "symmetry_error": 0.0198, "fractal_dimension_error": 0.0023,
        "worst_radius": 15.11, "worst_texture": 19.26, "worst_perimeter": 99.7, "worst_area": 711.2,
        "worst_smoothness": 0.144, "worst_compactness": 0.1773, "worst_concavity": 0.239,
        "worst_concave_points": 0.1288, "worst_symmetry": 0.2977, "worst_fractal_dimension": 0.0726
    }
    bc_data = BreastCancerInput(**bc_dict)
    bc_res = predict_breast_cancer(bc_data, auth_header)
    assert bc_res["disease"] == "Breast Cancer"
    assert bc_res["result"] in ["Lower Risk", "Higher Risk"]
    assert 0.0 <= bc_res["probability"] <= 1.0
    print("PASS: Breast cancer prediction inference")

    # 4. User Telemetry History
    user = {"id": auth["user"]["id"], "email": auth["user"]["email"], "name": auth["user"]["name"]}
    hist = get_history(user)
    assert isinstance(hist, list)
    assert len(hist) >= 3
    print(f"PASS: Telemetry history persistence ({len(hist)} records)")


def test_vercel_path_middleware():
    class DummyApp:
        async def __call__(self, scope, receive, send):
            pass

    m = VercelPathMiddleware(DummyApp())

    cases = [
        ({"type": "http", "path": "/api/index.py", "query_string": b"__path=/predict/heart", "headers": []}, "/predict/heart"),
        ({"type": "http", "path": "/api/index.py", "query_string": b"__path=/auth/login", "headers": []}, "/auth/login"),
        ({"type": "http", "path": "/api/index.py", "query_string": b"__path=/health", "headers": []}, "/health"),
        ({"type": "http", "path": "/api/index.py", "query_string": b"__path=/", "headers": []}, "/"),
        ({"type": "http", "path": "/api/index", "headers": [(b"x-matched-path", b"/auth/login")]}, "/auth/login"),
        ({"type": "http", "path": "/main.py", "headers": [(b"x-matched-path", b"/predict/heart")]}, "/predict/heart"),
        ({"type": "http", "path": "/api/predict/diabetes", "headers": []}, "/predict/diabetes"),
        ({"type": "http", "path": "/health/", "headers": []}, "/health"),
        ({"type": "http", "path": "/api/index", "headers": []}, "/"),
    ]

    for scope, expected in cases:
        coro = m(scope, None, None)
        try:
            coro.send(None)
        except (StopIteration, Exception):
            pass
        assert scope["path"] == expected, f"Expected {expected}, got {scope['path']}"

    print("PASS: Vercel path normalization middleware")


if __name__ == "__main__":
    test_system_endpoints()
    test_auth_and_predictions()
    test_vercel_path_middleware()
    print("\nALL BACKEND TESTS PASSED SUCCESSFULLY!")
