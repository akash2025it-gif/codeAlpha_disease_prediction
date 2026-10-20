"""
Data preprocessing definitions and pipeline builders for disease prediction.
Ensures training and inference pipelines are 100% identical.
"""

import warnings
import numpy as np
import pandas as pd
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.calibration import CalibratedClassifierCV
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier

warnings.filterwarnings("ignore", category=FutureWarning)

def get_preprocessor():
    """
    Standard preprocessing pipeline:
    1. Impute missing values using median (robust to outliers and physiological zeros).
    2. Standardize features by removing mean and scaling to unit variance.
    """
    return [
        ('imputer', SimpleImputer(strategy='median')),
        ('scaler', StandardScaler())
    ]

def get_candidate_models(random_state=42):
    """
    Returns the four required classification algorithms.
    SVM uses calibrated probabilities to output calibrated risk scores.
    """
    base_svc = SVC(
        kernel='rbf', 
        random_state=random_state, 
        class_weight='balanced'
    )
    calibrated_svc = CalibratedClassifierCV(base_svc, cv=3)

    return {
        "Logistic Regression": LogisticRegression(
            max_iter=1000, 
            random_state=random_state, 
            class_weight='balanced'
        ),
        "SVM": calibrated_svc,
        "Random Forest": RandomForestClassifier(
            n_estimators=100, 
            random_state=random_state, 
            class_weight='balanced'
        ),
        "XGBoost": XGBClassifier(
            n_estimators=100, 
            learning_rate=0.1, 
            max_depth=4, 
            random_state=random_state, 
            eval_metric='logloss'
        )
    }

def build_pipeline(classifier):
    """
    Creates an end-to-end scikit-learn Pipeline with preprocessing and classifier.
    """
    steps = get_preprocessor() + [('classifier', classifier)]
    return Pipeline(steps)
