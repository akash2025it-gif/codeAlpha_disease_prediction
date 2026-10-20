"""Pydantic schemas for all prediction request/response models."""

from pydantic import BaseModel, Field, field_validator
from typing import Optional, Dict, List, Any


class HeartDiseaseInput(BaseModel):
    age: float = Field(..., ge=1, le=120, description="Age in years")
    sex: float = Field(..., ge=0, le=1, description="Sex (0=Female, 1=Male)")
    cp: float = Field(..., ge=1, le=4, description="Chest pain type (1-4)")
    trestbps: float = Field(..., ge=60, le=250, description="Resting blood pressure (mm Hg)")
    chol: float = Field(..., ge=100, le=600, description="Serum cholesterol (mg/dl)")
    fbs: float = Field(..., ge=0, le=1, description="Fasting blood sugar > 120 mg/dl (0=No, 1=Yes)")
    restecg: float = Field(..., ge=0, le=2, description="Resting ECG results (0-2)")
    thalach: float = Field(..., ge=60, le=250, description="Maximum heart rate achieved")
    exang: float = Field(..., ge=0, le=1, description="Exercise induced angina (0=No, 1=Yes)")
    oldpeak: float = Field(..., ge=0.0, le=10.0, description="ST depression induced by exercise")
    slope: float = Field(..., ge=1, le=3, description="Slope of the peak exercise ST segment (1-3)")
    ca: float = Field(..., ge=0, le=3, description="Number of major vessels colored by fluoroscopy (0-3)")
    thal: float = Field(..., ge=3, le=7, description="Thalassemia (3=Normal, 6=Fixed defect, 7=Reversible defect)")


class DiabetesInput(BaseModel):
    Pregnancies: float = Field(..., ge=0, le=20, description="Number of times pregnant")
    Glucose: float = Field(..., ge=0, le=300, description="Plasma glucose concentration (mg/dL)")
    BloodPressure: float = Field(..., ge=0, le=200, description="Diastolic blood pressure (mm Hg)")
    SkinThickness: float = Field(..., ge=0, le=100, description="Triceps skin fold thickness (mm)")
    Insulin: float = Field(..., ge=0, le=900, description="2-Hour serum insulin (mu U/ml)")
    BMI: float = Field(..., ge=0.0, le=70.0, description="Body mass index (kg/m²)")
    DiabetesPedigreeFunction: float = Field(..., ge=0.0, le=3.0, description="Diabetes pedigree function")
    Age: float = Field(..., ge=1, le=120, description="Age in years")


class BreastCancerInput(BaseModel):
    mean_radius: float = Field(..., ge=0, description="Mean radius of cell nuclei")
    mean_texture: float = Field(..., ge=0, description="Mean texture of cell nuclei")
    mean_perimeter: float = Field(..., ge=0, description="Mean perimeter of cell nuclei")
    mean_area: float = Field(..., ge=0, description="Mean area of cell nuclei")
    mean_smoothness: float = Field(..., ge=0, description="Mean smoothness of cell nuclei")
    mean_compactness: float = Field(..., ge=0, description="Mean compactness of cell nuclei")
    mean_concavity: float = Field(..., ge=0, description="Mean concavity of cell nuclei")
    mean_concave_points: float = Field(..., ge=0, description="Mean concave points of cell nuclei")
    mean_symmetry: float = Field(..., ge=0, description="Mean symmetry of cell nuclei")
    mean_fractal_dimension: float = Field(..., ge=0, description="Mean fractal dimension of cell nuclei")
    radius_error: float = Field(..., ge=0, description="Standard error of radius")
    texture_error: float = Field(..., ge=0, description="Standard error of texture")
    perimeter_error: float = Field(..., ge=0, description="Standard error of perimeter")
    area_error: float = Field(..., ge=0, description="Standard error of area")
    smoothness_error: float = Field(..., ge=0, description="Standard error of smoothness")
    compactness_error: float = Field(..., ge=0, description="Standard error of compactness")
    concavity_error: float = Field(..., ge=0, description="Standard error of concavity")
    concave_points_error: float = Field(..., ge=0, description="Standard error of concave points")
    symmetry_error: float = Field(..., ge=0, description="Standard error of symmetry")
    fractal_dimension_error: float = Field(..., ge=0, description="Standard error of fractal dimension")
    worst_radius: float = Field(..., ge=0, description="Largest radius of cell nuclei")
    worst_texture: float = Field(..., ge=0, description="Largest texture of cell nuclei")
    worst_perimeter: float = Field(..., ge=0, description="Largest perimeter of cell nuclei")
    worst_area: float = Field(..., ge=0, description="Largest area of cell nuclei")
    worst_smoothness: float = Field(..., ge=0, description="Largest smoothness of cell nuclei")
    worst_compactness: float = Field(..., ge=0, description="Largest compactness of cell nuclei")
    worst_concavity: float = Field(..., ge=0, description="Largest concavity of cell nuclei")
    worst_concave_points: float = Field(..., ge=0, description="Largest concave points of cell nuclei")
    worst_symmetry: float = Field(..., ge=0, description="Largest symmetry of cell nuclei")
    worst_fractal_dimension: float = Field(..., ge=0, description="Largest fractal dimension of cell nuclei")


class PredictionResponse(BaseModel):
    disease: str
    prediction: int
    result: str
    probability: float
    risk_category: str
    model: str
    disclaimer: str = "This prediction is for educational purposes only. It is NOT a medical diagnosis. Please consult a qualified healthcare professional for medical advice."


class FeatureImportanceItem(BaseModel):
    feature: str
    importance: float


class ModelMetrics(BaseModel):
    model_name: str
    accuracy: float
    precision: float
    recall: float
    f1_score: float
    roc_auc: float
    confusion_matrix: Dict[str, Any]
    feature_importances: List[FeatureImportanceItem] = []


class DiseaseMetrics(BaseModel):
    disease_key: str
    disease_name: str
    best_model: str
    features: List[str]
    models: Dict[str, ModelMetrics]
    best_model_metrics: ModelMetrics
