# MedPredict AI — Disease Prediction from Medical Data

[![Frontend Deployment](https://github.com/akash2025it-gif/codeAlpha_disease_prediction/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/akash2025it-gif/codeAlpha_disease_prediction/actions/workflows/deploy-pages.yml)
[![Live Demo](https://img.shields.io/badge/Live_Demo-GitHub_Pages-2563EB?logo=github)](https://akash2025it-gif.github.io/codeAlpha_disease_prediction/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI_0.100+-009688?logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React_19_Vite-61DAFB?logo=react)](https://react.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> A full-stack, machine-learning-driven clinical risk estimation platform that benchmarks four classification algorithms across three authentic medical datasets.

---

## 1. Project Overview

**MedPredict AI** is an educational healthcare machine-learning application designed to evaluate patient disease risk from structured clinical data. The project provides an end-to-end solution: from raw dataset curation, missing value imputation, and pipeline serialization in Python, to a high-performance REST API powered by FastAPI, and an accessible, responsive dashboard built with React 19, Vite, and Tailwind CSS.

### Live Application Links
- **Frontend Dashboard (GitHub Pages):** [https://akash2025it-gif.github.io/codeAlpha_disease_prediction/](https://akash2025it-gif.github.io/codeAlpha_disease_prediction/)
- **Live Prediction API (Vercel):** [https://backend-teal-theta-65.vercel.app](https://backend-teal-theta-65.vercel.app)
- **Interactive API Documentation (Swagger UI):** [https://backend-teal-theta-65.vercel.app/docs](https://backend-teal-theta-65.vercel.app/docs)

---

## 2. Project Objectives

1. **Empirical Algorithm Benchmarking:** Systematically train and compare four core classification algorithms (**Logistic Regression**, **Support Vector Machines (SVM)**, **Random Forest**, and **XGBoost**) for each disease.
2. **Leakage-Free ML Pipelines:** Ensure 100% equivalence between training and inference using serialized `scikit-learn` `Pipeline` objects (median imputation + `StandardScaler`).
3. **Calibrated Probabilistic Scoring:** Provide transparent risk bandings (**Lower Risk [0–30%]**, **Moderate Risk [31–60%]**, **Higher Risk [61–100%]**) accompanied by model interpretability metrics.
4. **Professional Healthcare UX:** Deliver a modern, accessible interface with field validation, sample patient presets, interactive Recharts visualizations, and comprehensive legal disclaimers.

---

## 3. Key Features

- **Multi-Disease Risk Assessment:**
  - **Heart Disease:** Cardiovascular risk from 13 clinical biomarkers (Cleveland Clinic dataset).
  - **Diabetes:** Metabolic status from 8 diagnostic indicators (Pima Indians dataset).
  - **Breast Cancer:** Cytological malignancy classification from 30 cell nucleus features (Wisconsin WDBC dataset).
- **Automated Model Selection:** Evaluates candidate models on holdout sets and automatically deploys the best algorithm based on a composite score: \(0.70 \times \text{F1} + 0.30 \times \text{ROC-AUC}\).
- **Interactive Model Performance Dashboard:**
  - Real-time comparison bar charts for Accuracy, Precision, Recall, F1-Score, and ROC-AUC.
  - Interactive confusion matrix breakdowns (True Positives, True Negatives, False Positives, False Negatives).
  - Feature importance ranking for tree ensemble models.
- **Sample Patient Profiles:** One-click presets ("Load Lower Risk" and "Load Higher Risk") to rapidly test realistic clinical scenarios without manual data entry.
- **Stateless & Privacy-First:** No patient inputs or telemetry are stored in any persistent database or third-party tracking system.

---

## 4. Application Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     USER WEB BROWSER                        │
│         React 19 + Vite SPA (Hosted on GitHub Pages)        │
└──────────────┬───────────────────────────────▲──────────────┘
               │                               │
       POST /predict/heart                     │ JSON Risk Prediction
       POST /predict/diabetes                  │ & Calibration Score
       GET  /metrics                           │
               ▼                               │
┌──────────────────────────────────────────────┴──────────────┐
│                    FASTAPI BACKEND SERVICE                  │
│       Python 3.11 / ASGI (Hosted on Vercel Serverless)      │
│  - Input validation via Pydantic v2 schemas                 │
│  - CORS Middleware & safe error handling                    │
│  - Auto-scaled serverless compute with 1024MB RAM           │
└──────────────┬──────────────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────────────────┐
│               SERIALIZED MACHINE LEARNING PIPELINE          │
│       scikit-learn Pipeline (joblib model artifacts)        │
│  1. SimpleImputer (strategy = 'median')                     │
│  2. StandardScaler (unit variance scaling)                  │
│  3. Trained Classifier (Random Forest / Calibrated SVM)     │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend UI** | React 19, Vite 8, React Router v7, Tailwind CSS v4 |
| **Animation & Charts** | Framer Motion, Recharts, Lucide React Icons |
| **HTTP Client** | Axios (centralized in `src/services/api.js`) |
| **Backend API** | FastAPI 0.100+, Uvicorn (ASGI), Pydantic v2 |
| **Machine Learning** | scikit-learn 1.9+, XGBoost 3.4+, NumPy, pandas, SciPy |
| **Serialization** | joblib (Pipeline persistence) |
| **Deployment** | GitHub Actions (Pages SPA) + Render Web Service |

---

## 6. Supported Diseases & Datasets

| Condition | Dataset Origin | Sample Size | Feature Count | Target Variable | Selected Best Model |
|---|---|---|---|---|---|
| **Heart Disease** | UCI Cleveland Clinic | 303 records | 13 features | 0: Absence, 1: Presence | **Random Forest** (F1: 0.9000, AUC: 0.9589) |
| **Diabetes** | NIDDK Pima Indians | 768 records | 8 features | 0: Negative, 1: Positive | **Random Forest** (F1: 0.6667, AUC: 0.8241) |
| **Breast Cancer** | Wisconsin Diagnostic (WDBC) | 569 records | 30 features | 0: Benign, 1: Malignant | **Calibrated SVM** (F1: 0.9762, AUC: 0.9954) |

*Note: All datasets are publicly available academic benchmarks. The training script automatically downloads and verifies dataset files into `backend/datasets/`.*

---

## 7. Machine Learning Methodology

1. **Missing Data Handling:** In datasets such as Pima Indians Diabetes, physiological zeros (e.g., zero blood pressure or zero glucose) represent missing records and are imputed with feature medians.
2. **Feature Normalization:** Standardized through unit variance transformations to prevent features with wide scales from dominating gradient steps.
3. **Cross-Validation & Holdout Testing:** Models are trained on an 80% split and tested on a stratified 20% holdout split to preserve class balances.
4. **SVM Calibration:** Support Vector Machines employ Platt scaling / cross-validated probability calibration (`CalibratedClassifierCV`) to output true posterior probabilities.
5. **Model Selection Criterion:**
   $$\text{Composite Score} = 0.70 \times \text{F1-Score} + 0.30 \times \text{ROC-AUC}$$

---

## 8. Repository Structure

```
disease-prediction/
│
├── .github/
│   └── workflows/
│       └── deploy-pages.yml          # GitHub Pages build and deploy workflow
│
├── backend/
│   ├── main.py                       # FastAPI application & route declarations
│   ├── requirements.txt              # Production runtime dependencies
│   ├── requirements-training.txt     # ML training dependencies (includes XGBoost)
│   ├── datasets/
│   │   ├── download_datasets.py      # Automated data acquisition script
│   │   ├── heart_disease.csv         # Cleveland Heart Disease data
│   │   ├── diabetes.csv              # Pima Indians Diabetes data
│   │   └── breast_cancer.csv         # Wisconsin Diagnostic Breast Cancer data
│   ├── models/
│   │   ├── heart_model.pkl           # Best trained Heart Disease pipeline
│   │   ├── diabetes_model.pkl        # Best trained Diabetes pipeline
│   │   ├── breast_cancer_model.pkl   # Best trained Breast Cancer pipeline
│   │   └── metrics.json              # Empirical evaluation metrics & importances
│   ├── preprocessing/
│   │   └── pipeline.py               # Preprocessing pipelines & model factories
│   ├── schemas/
│   │   └── models.py                 # Pydantic request & response schemas
│   ├── training/
│   │   └── train_all.py              # 4-algorithm benchmark training suite
│   └── utils/
│       └── predict.py                # Prediction inference utilities
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx            # Responsive navigation header
│   │   │   ├── Footer.jsx            # Application footer & medical notices
│   │   │   ├── FormField.jsx         # Accessible form field with tooltip & validation
│   │   │   ├── PredictionCard.jsx    # Visual risk gauge & prediction results
│   │   │   └── forms/
│   │   │       ├── HeartForm.jsx     # 13-feature Heart Disease form with presets
│   │   │       ├── DiabetesForm.jsx  # 8-feature Diabetes form with presets
│   │   │       └── BreastCancerForm.jsx # 30-feature WDBC grouped form with presets
│   │   ├── pages/
│   │   │   ├── Home.jsx              # Landing page
│   │   │   ├── Predict.jsx           # Tabbed prediction interface
│   │   │   ├── Performance.jsx       # Analytics dashboard & Recharts charts
│   │   │   ├── About.jsx             # Technical methodology documentation
│   │   │   └── Disclaimer.jsx        # Dedicated medical & legal disclaimer
│   │   ├── services/
│   │   │   └── api.js                # Centralized Axios API service
│   │   ├── App.jsx                   # Application router (React Router v7)
│   │   ├── index.css                 # Design tokens & Tailwind CSS styling
│   │   └── main.jsx                  # React application entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── render.yaml                       # Render Web Service blueprint
├── .gitignore
├── README.md
└── PROJECT_EXPLANATION.md            # Plain-English technical explanation
```

---

## 9. Local Installation & Setup

### Prerequisites
- **Python:** 3.10, 3.11, or 3.12 (Python 3.14 compatible)
- **Node.js:** v18, v20, or v22 (LTS recommended)
- **Git**

### Step 1: Clone Repository
```bash
git clone https://github.com/akash2025it-gif/codeAlpha_disease_prediction.git
cd codeAlpha_disease_prediction
```

### Step 2: Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Step 3: Train Machine Learning Models
```bash
# (Optional: models are already pre-trained and serialized in backend/models/)
pip install -r requirements-training.txt
python training/train_all.py
```

### Step 4: Run FastAPI Server
```bash
uvicorn main:app --reload --port 8000
```
- API Base: `http://127.0.0.1:8000`
- Interactive Swagger UI: `http://127.0.0.1:8000/docs`

### Step 5: Frontend Setup
Open a new terminal:
```bash
cd frontend

# Install npm packages
npm install

# Start Vite development server
npm run dev
```
- Frontend Dashboard: `http://localhost:5173`

---

## 10. Environment Configuration

### Frontend (`frontend/.env`)
```ini
# Base URL for API requests.
# In local development:
VITE_API_URL=http://127.0.0.1:8000

# In production (set as a GitHub Actions Secret):
# VITE_API_URL=https://your-backend.onrender.com
```

### Frontend (`frontend/.env`)
```ini
# Base URL for API requests.
# In local development:
VITE_API_URL=http://127.0.0.1:8000

# In production (automatically configured for Vercel backend):
VITE_API_URL=https://backend-teal-theta-65.vercel.app
```

### Production Deployment Variables
When deploying frontend to GitHub Pages:
1. The GitHub Actions workflow (`deploy-pages.yml`) automatically falls back to `https://backend-teal-theta-65.vercel.app`.
2. To point to a custom backend domain, set repository secret `VITE_API_URL` under **Settings → Secrets and variables → Actions**.

---

## 11. API Specification

| Method | Endpoint | Request Body | Description |
|---|---|---|---|
| `GET` | `/` | None | API identity, health status, and documentation links |
| `GET` | `/health` | None | Service health check and loaded model inventory |
| `GET` | `/models` | None | Metadata and sample counts for all active models |
| `GET` | `/metrics` | None | Full benchmark evaluation metrics (all 4 algorithms) |
| `GET` | `/metrics/{disease}` | None | Metrics for `heart`, `diabetes`, or `breast_cancer` |
| `POST` | `/predict/heart` | JSON (`HeartDiseaseInput`) | Inference endpoint for Heart Disease |
| `POST` | `/predict/diabetes` | JSON (`DiabetesInput`) | Inference endpoint for Diabetes |
| `POST` | `/predict/breast-cancer` | JSON (`BreastCancerInput`) | Inference endpoint for Breast Cancer |

### Example Prediction Request
`POST /predict/heart`
```json
{
  "age": 63,
  "sex": 1,
  "cp": 4,
  "trestbps": 160,
  "chol": 286,
  "fbs": 0,
  "restecg": 2,
  "thalach": 108,
  "exang": 1,
  "oldpeak": 1.5,
  "slope": 2,
  "ca": 3,
  "thal": 3
}
```

### Example Prediction Response
```json
{
  "disease": "Heart Disease",
  "prediction": 1,
  "result": "Higher Risk",
  "probability": 0.95,
  "risk_category": "Higher Risk",
  "model": "Random Forest",
  "disclaimer": "This prediction is for educational purposes only. It is NOT a medical diagnosis. Please consult a qualified healthcare professional for medical advice."
}
```

---

## 12. Deployment Guide

### Backend Deployment (Vercel)
The backend is configured as a serverless ASGI application via `backend/vercel.json`:
```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "functions": {
    "main.py": {
      "excludeFiles": "{datasets/**,training/**,preprocessing/**,__pycache__/**,**/__pycache__/**,**/*.pyc}",
      "maxDuration": 30,
      "memory": 1024
    }
  },
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/main.py"
    }
  ]
}
```
**Key Vercel Optimizations:**
1. **Bundle Size Under 250 MB Limit:** Heavy training dependencies like XGBoost are isolated in `requirements-training.txt`. The runtime `requirements.txt` installs only scikit-learn, SciPy, pandas, and NumPy, resulting in a lean ~110 MB uncompressed function footprint well below the AWS Lambda / Vercel 250 MB ceiling.
2. **Serverless Rewrites:** Unconditional rewrites route all paths (`/health`, `/models`, `/metrics`, `/predict/*`) to `main.py`.
3. **Memory & Timeout:** Configured with 1024 MB memory and 30-second execution window to handle cold starts and high-dimensional model evaluations.
4. **Deploying via Vercel CLI or GitHub:**
   - Link project: `vercel link` (Project: `backend`, Directory: `backend`)
   - Deploy to production: `vercel --prod`

### Frontend Deployment (GitHub Pages)
The repository includes an automated GitHub Actions deployment workflow (`.github/workflows/deploy-pages.yml`).
1. Push changes to the `main` branch.
2. The workflow builds the Vite application with base path `/codeAlpha_disease_prediction/`, injects `VITE_API_URL` pointing to `https://backend-teal-theta-65.vercel.app`, generates `404.html` SPA routing fallback, and deploys directly to GitHub Pages.

---

## 13. Automated Testing

To run the end-to-end integration test suite:
```bash
# Ensure backend is running, then run:
python -c "
import urllib.request, json
res = urllib.request.urlopen('http://127.0.0.1:8000/health')
print('Health:', json.loads(res.read()))
"
```
Or execute the automated test suite covering all endpoints, schema validations, and risk probability responses.

---

## 14. Academic & Medical Disclaimer

> **IMPORTANT MEDICAL NOTICE:**
> MedPredict AI is strictly an **educational machine-learning demonstration**. 
> The predictions generated by this software are experimental statistical estimations and **do not constitute medical diagnoses, clinical opinions, or medical advice**.
> Never initiate, alter, or discontinue any medical treatment, prescription, or therapeutic routine based on predictions from this website. 
> Always seek the counsel of a licensed physician or qualified medical practitioner regarding any symptoms or medical conditions.
> Users are strictly prohibited from submitting real personally identifiable patient data (PII).

---

## 15. License

This project is licensed under the [MIT License](LICENSE).
