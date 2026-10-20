"""
Dataset downloader and verifier.
Downloads or exports:
1. Heart Disease (UCI Cleveland processed dataset)
2. Diabetes (Pima Indians Diabetes dataset)
3. Breast Cancer (Wisconsin Diagnostic Breast Cancer dataset)
"""

import os
import urllib.request
import pandas as pd
import numpy as np
from sklearn.datasets import load_breast_cancer

DATASETS_DIR = os.path.dirname(os.path.abspath(__file__))

def prepare_heart_disease():
    path = os.path.join(DATASETS_DIR, "heart_disease.csv")
    if os.path.exists(path):
        print(f"[Heart] File already exists at {path}")
        return pd.read_csv(path)

    url = "https://archive.ics.uci.edu/ml/machine-learning-databases/heart-disease/processed.cleveland.data"
    columns = [
        "age", "sex", "cp", "trestbps", "chol", "fbs", 
        "restecg", "thalach", "exang", "oldpeak", "slope", 
        "ca", "thal", "target"
    ]
    print(f"[Heart] Downloading from {url}...")
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=15) as response:
            df = pd.read_csv(response, header=None, names=columns, na_values="?")
    except Exception as e:
        print(f"[Heart] UCI direct download failed ({e}), trying fallback mirror...")
        fallback_url = "https://raw.githubusercontent.com/ammarrvn/Heart-Disease-UCI/master/heart.csv"
        df = pd.read_csv(fallback_url)
        df.columns = [c.lower() for c in df.columns]

    if df['target'].max() > 1:
        df['target'] = (df['target'] > 0).astype(int)

    df.to_csv(path, index=False)
    print(f"[Heart] Saved to {path}. Shape: {df.shape}")
    return df

def prepare_diabetes():
    path = os.path.join(DATASETS_DIR, "diabetes.csv")
    if os.path.exists(path):
        print(f"[Diabetes] File already exists at {path}")
        return pd.read_csv(path)

    url = "https://raw.githubusercontent.com/jbrownlee/Datasets/master/pima-indians-diabetes.data.csv"
    columns = [
        "Pregnancies", "Glucose", "BloodPressure", "SkinThickness", 
        "Insulin", "BMI", "DiabetesPedigreeFunction", "Age", "Outcome"
    ]
    print(f"[Diabetes] Downloading from {url}...")
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=15) as response:
            df = pd.read_csv(response, header=None, names=columns)
    except Exception as e:
        print(f"[Diabetes] Download failed ({e}), trying fallback mirror...")
        fallback_url = "https://raw.githubusercontent.com/plotly/datasets/master/diabetes.csv"
        df = pd.read_csv(fallback_url)

    df.to_csv(path, index=False)
    print(f"[Diabetes] Saved to {path}. Shape: {df.shape}")
    return df

def prepare_breast_cancer():
    path = os.path.join(DATASETS_DIR, "breast_cancer.csv")
    if os.path.exists(path):
        print(f"[Breast Cancer] File already exists at {path}")
        return pd.read_csv(path)

    print("[Breast Cancer] Loading Wisconsin Breast Cancer dataset from sklearn...")
    raw = load_breast_cancer(as_frame=True)
    df = raw.frame.copy()
    # In sklearn: 0 = malignant, 1 = benign
    # For clinical risk scoring, 1 = Malignant (High Risk), 0 = Benign (Low Risk)
    df['target'] = (raw.target == 0).astype(int)
    # Clean column names (standardize python identifiers while keeping readability)
    df.columns = [col.replace(' ', '_') for col in df.columns]

    df.to_csv(path, index=False)
    print(f"[Breast Cancer] Saved to {path}. Shape: {df.shape}")
    return df

if __name__ == "__main__":
    prepare_heart_disease()
    prepare_diabetes()
    prepare_breast_cancer()
