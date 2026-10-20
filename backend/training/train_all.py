"""
Comprehensive ML training script for:
1. Heart Disease
2. Diabetes
3. Breast Cancer

Trains 4 classification algorithms per disease:
- Logistic Regression
- Support Vector Machine (SVM)
- Random Forest
- XGBoost

Evaluates performance using Accuracy, Precision, Recall, F1-Score, ROC-AUC, and Confusion Matrix.
Selects and saves the best model along with full metrics and feature importances.
"""

import os
import sys
import json
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, confusion_matrix
)

# Add parent directory to sys.path so backend imports work regardless of working dir
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.abspath(os.path.join(CURRENT_DIR, ".."))
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from preprocessing.pipeline import build_pipeline, get_candidate_models
from datasets.download_datasets import prepare_heart_disease, prepare_diabetes, prepare_breast_cancer

MODELS_DIR = os.path.join(BACKEND_DIR, "models")
os.makedirs(MODELS_DIR, exist_ok=True)

# Human-readable labels and descriptions for feature importance & UI
FEATURE_METADATA = {
    "heart": {
        "age": {"name": "Age", "unit": "years", "category": "Demographics"},
        "sex": {"name": "Sex", "unit": "0=Female, 1=Male", "category": "Demographics"},
        "cp": {"name": "Chest Pain Type", "unit": "1:Typical, 2:Atypical, 3:Non-anginal, 4:Asymptomatic", "category": "Symptoms"},
        "trestbps": {"name": "Resting Blood Pressure", "unit": "mm Hg", "category": "Clinical Vitals"},
        "chol": {"name": "Serum Cholesterol", "unit": "mg/dl", "category": "Laboratory"},
        "fbs": {"name": "Fasting Blood Sugar > 120", "unit": "0=No, 1=Yes", "category": "Laboratory"},
        "restecg": {"name": "Resting ECG Results", "unit": "0:Normal, 1:ST-T wave abn, 2:LVH", "category": "Diagnostics"},
        "thalach": {"name": "Maximum Heart Rate Achieved", "unit": "bpm", "category": "Stress Test"},
        "exang": {"name": "Exercise Induced Angina", "unit": "0=No, 1=Yes", "category": "Stress Test"},
        "oldpeak": {"name": "ST Depression (Oldpeak)", "unit": "depression value", "category": "Stress Test"},
        "slope": {"name": "Slope of Peak Exercise ST", "unit": "1:Upsloping, 2:Flat, 3:Downsloping", "category": "Stress Test"},
        "ca": {"name": "Number of Major Vessels Colored", "unit": "0-3 vessels", "category": "Fluoroscopy"},
        "thal": {"name": "Thalassemia Status", "unit": "3:Normal, 6:Fixed defect, 7:Reversible defect", "category": "Hematology"}
    },
    "diabetes": {
        "Pregnancies": {"name": "Number of Pregnancies", "unit": "count", "category": "History"},
        "Glucose": {"name": "Plasma Glucose Concentration", "unit": "mg/dL (2h oral test)", "category": "Laboratory"},
        "BloodPressure": {"name": "Diastolic Blood Pressure", "unit": "mm Hg", "category": "Clinical Vitals"},
        "SkinThickness": {"name": "Triceps Skinfold Thickness", "unit": "mm", "category": "Anthropometry"},
        "Insulin": {"name": "2-Hour Serum Insulin", "unit": "mu U/ml", "category": "Laboratory"},
        "BMI": {"name": "Body Mass Index", "unit": "weight in kg/(height in m)^2", "category": "Anthropometry"},
        "DiabetesPedigreeFunction": {"name": "Diabetes Pedigree Function", "unit": "genetic score", "category": "Genetics"},
        "Age": {"name": "Age", "unit": "years", "category": "Demographics"}
    },
    "breast_cancer": {
        col: {"name": col.replace("_", " ").title(), "unit": "standard measurement", "category": "Cytology"}
        for col in [
            'mean_radius', 'mean_texture', 'mean_perimeter', 'mean_area', 'mean_smoothness',
            'mean_compactness', 'mean_concavity', 'mean_concave_points', 'mean_symmetry', 'mean_fractal_dimension',
            'radius_error', 'texture_error', 'perimeter_error', 'area_error', 'smoothness_error',
            'compactness_error', 'concavity_error', 'concave_points_error', 'symmetry_error', 'fractal_dimension_error',
            'worst_radius', 'worst_texture', 'worst_perimeter', 'worst_area', 'worst_smoothness',
            'worst_compactness', 'worst_concavity', 'worst_concave_points', 'worst_symmetry', 'worst_fractal_dimension'
        ]
    }
}

def extract_feature_importances(pipeline, feature_names):
    """
    Extracts normalized feature importance or absolute coefficients from trained pipeline.
    """
    clf = pipeline.named_steps['classifier']
    importances = None
    if hasattr(clf, 'feature_importances_'):
        importances = clf.feature_importances_
    elif hasattr(clf, 'coef_'):
        importances = np.abs(clf.coef_[0])

    if importances is not None and len(importances) == len(feature_names):
        total = np.sum(importances)
        if total > 0:
            norm_imp = (importances / total).tolist()
        else:
            norm_imp = (1.0 / len(feature_names) * np.ones(len(feature_names))).tolist()
        
        ranked = sorted(
            [{"feature": f, "importance": round(imp * 100, 2)} for f, imp in zip(feature_names, norm_imp)],
            key=lambda x: x["importance"],
            reverse=True
        )
        return ranked
    return []

def evaluate_models_for_disease(df, target_col, disease_key, disease_display_name, replace_zeros=None):
    """
    Train and evaluate 4 models for a single disease dataset.
    """
    print(f"\n{'='*50}")
    print(f"{disease_display_name.upper()}")
    print(f"{'='*50}")

    df_clean = df.copy()

    # In datasets like Pima diabetes, 0 values in certain columns represent physiological missing data
    if replace_zeros:
        for col in replace_zeros:
            if col in df_clean.columns:
                df_clean[col] = df_clean[col].replace(0, np.nan)

    X = df_clean.drop(columns=[target_col])
    y = df_clean[target_col].astype(int)

    feature_names = list(X.columns)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    candidate_models = get_candidate_models(random_state=42)
    trained_pipelines = {}
    metrics_summary = {}

    best_model_name = None
    best_score = -1.0
    selection_criterion = "F1-Score (Primary) & ROC-AUC (Secondary)"

    for name, clf in candidate_models.items():
        pipeline = build_pipeline(clf)
        pipeline.fit(X_train, y_train)
        trained_pipelines[name] = pipeline

        y_pred = pipeline.predict(X_test)
        if hasattr(pipeline, "predict_proba"):
            y_proba = pipeline.predict_proba(X_test)[:, 1]
            roc_auc = float(roc_auc_score(y_test, y_proba))
        else:
            roc_auc = float(roc_auc_score(y_test, y_pred))

        acc = float(accuracy_score(y_test, y_pred))
        prec = float(precision_score(y_test, y_pred, zero_division=0))
        rec = float(recall_score(y_test, y_pred, zero_division=0))
        f1 = float(f1_score(y_test, y_pred, zero_division=0))

        cm = confusion_matrix(y_test, y_pred)
        tn, fp, fn, tp = cm.ravel()

        feature_imp = extract_feature_importances(pipeline, feature_names)

        model_metrics = {
            "model_name": name,
            "accuracy": round(acc, 4),
            "precision": round(prec, 4),
            "recall": round(rec, 4),
            "f1_score": round(f1, 4),
            "roc_auc": round(roc_auc, 4),
            "confusion_matrix": {
                "tn": int(tn),
                "fp": int(fp),
                "fn": int(fn),
                "tp": int(tp),
                "matrix": cm.tolist()
            },
            "feature_importances": feature_imp[:10]  # top 10
        }
        metrics_summary[name] = model_metrics

        print(f"{name:20}: Accuracy={acc:.4f} | Precision={prec:.4f} | Recall={rec:.4f} | F1={f1:.4f} | ROC-AUC={roc_auc:.4f}")

        # Best model selection by F1-Score + ROC-AUC tie-breaker
        combined_score = f1 * 0.7 + roc_auc * 0.3
        if combined_score > best_score:
            best_score = combined_score
            best_model_name = name

    print(f"\nBest Model: {best_model_name} (Composite F1/ROC-AUC Score: {best_score:.4f})")

    best_pipeline = trained_pipelines[best_model_name]
    model_filename = f"{disease_key}_model.pkl"
    model_path = os.path.join(MODELS_DIR, model_filename)
    joblib.dump(best_pipeline, model_path)
    print(f"Saved best model to {model_path}")

    # Build disease summary
    disease_result = {
        "disease_key": disease_key,
        "disease_name": disease_display_name,
        "best_model": best_model_name,
        "selection_criterion": selection_criterion,
        "features": feature_names,
        "feature_details": FEATURE_METADATA.get(disease_key, {}),
        "test_sample_size": len(y_test),
        "train_sample_size": len(y_train),
        "models": metrics_summary,
        "best_model_metrics": metrics_summary[best_model_name],
        "all_feature_importances": metrics_summary.get("Random Forest", metrics_summary[best_model_name])["feature_importances"]
    }

    return disease_result

def train_all():
    print("Starting comprehensive model training pipeline...")

    # Load authentic datasets
    df_heart = prepare_heart_disease()
    df_diabetes = prepare_diabetes()
    df_breast = prepare_breast_cancer()

    all_metrics = {}

    # 1. Heart Disease
    all_metrics["heart"] = evaluate_models_for_disease(
        df=df_heart,
        target_col="target",
        disease_key="heart",
        disease_display_name="Heart Disease"
    )

    # 2. Diabetes
    all_metrics["diabetes"] = evaluate_models_for_disease(
        df=df_diabetes,
        target_col="Outcome",
        disease_key="diabetes",
        disease_display_name="Diabetes",
        replace_zeros=["Glucose", "BloodPressure", "SkinThickness", "Insulin", "BMI"]
    )

    # 3. Breast Cancer
    all_metrics["breast_cancer"] = evaluate_models_for_disease(
        df=df_breast,
        target_col="target",
        disease_key="breast_cancer",
        disease_display_name="Breast Cancer"
    )

    metrics_path = os.path.join(MODELS_DIR, "metrics.json")
    with open(metrics_path, "w") as f:
        json.dump(all_metrics, f, indent=2)

    print(f"\n{'='*50}")
    print(f"All models and metrics successfully saved to {MODELS_DIR}")
    print(f"Metrics saved to {metrics_path}")
    print(f"{'='*50}")

if __name__ == "__main__":
    train_all()
