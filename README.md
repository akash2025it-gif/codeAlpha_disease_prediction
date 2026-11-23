# MedPredict AI — Clinical Intelligence & Disease Risk Platform

[![Frontend Deployment](https://github.com/akash2025it-gif/codeAlpha_disease_prediction/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/akash2025it-gif/codeAlpha_disease_prediction/actions/workflows/deploy-pages.yml)
[![Live Demo](https://img.shields.io/badge/Live_Application-GitHub_Pages-2563EB?logo=github)](https://akash2025it-gif.github.io/codeAlpha_disease_prediction/)
[![FastAPI](https://img.shields.io/badge/Backend_API-FastAPI-009688?logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React_19_Vite-61DAFB?logo=react)](https://react.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> A full-stack healthcare clinical intelligence web application delivering machine-learning risk stratification across Cardiovascular Disease, Type-2 Diabetes, and Breast Cytology.

---

## 1. Platform Overview

**MedPredict AI** is a clinical decision-support and predictive analytics web application designed to evaluate patient disease risk patterns from structured physiological and laboratory telemetry. The application provides an end-to-end clinical workflow:
- **Clinician Authentication:** Token-based access with encrypted session management.
- **Clinical Dashboard:** Longitudinal evaluation history, risk distribution metrics, and telemetry audit tools.
- **Diagnostic Prediction Modules:** Validated machine-learning classification pipelines for Heart Disease, Diabetes, and Breast Cancer.
- **Real-Time Inference:** High-throughput serverless REST API powered by FastAPI.
- **Modern Responsive Interface:** Healthcare SaaS frontend built with React 19, Vite, and Tailwind CSS.

### Live Production Endpoints
- **Web Application (GitHub Pages):** [https://akash2025it-gif.github.io/codeAlpha_disease_prediction/](https://akash2025it-gif.github.io/codeAlpha_disease_prediction/)
- **Prediction API (Vercel):** [https://backend-teal-theta-65.vercel.app](https://backend-teal-theta-65.vercel.app)
- **Interactive API Documentation (Swagger UI):** [https://backend-teal-theta-65.vercel.app/docs](https://backend-teal-theta-65.vercel.app/docs)

---

## 2. Key Capabilities

### 🔐 Clinician Authentication & Security
- **Token-Based Security:** Cryptographically signed HS256 JWT bearer tokens for stateful user authorization.
- **PBKDF2 Password Hashing:** Passwords hashed with standard library `hashlib.pbkdf2_hmac` using unique 16-byte cryptographic salts and 100,000 rounds of SHA-256.
- **Clinician Registration & Login:** Dedicated authentication pages with password strength verification and field validation.
- **Account Access:** New clinicians register through the application; no shared credentials are shipped or exposed in the client.

### 📊 Clinical Intelligence Dashboard
- **Longitudinal Telemetry History:** Automatically records each prediction run by an authenticated clinician.
- **Risk Categorization & Search:** Real-time filtering by condition (`ALL`, `Heart`, `Diabetes`, `Breast Cancer`) and risk level (`Lower Risk`, `Moderate Risk`, `Higher Risk`).
- **Telemetry Inspection Modal:** Audit the exact laboratory and physiological inputs that generated any historical prediction.
- **Clinical Data Export:** One-click **Export CSV** function to download patient telemetry logs for clinical records and reporting.
- **History Persistence:** Prediction history is retrieved only from the authenticated backend. Configure a persistent production database before relying on history in a serverless deployment.

### 🧬 Disease Prediction Modules
- **Heart Disease Risk Evaluation:** 13 clinical biomarkers (Cleveland Clinic cohort) evaluating resting blood pressure, serum cholesterol, resting ECG, fluoroscopy vessels, and exercise treadmill depression.
- **Type-2 Diabetes Risk Assessment:** 8 physiological features (Pima Indians cohort) assessing fasting glucose concentration, 2-hour serum insulin, BMI, and diabetes pedigree function.
- **Breast Cancer Cytology Classification:** 30 fine needle aspirate (FNA) cell nuclei morphological features (Wisconsin WDBC cohort) determining Benign vs. Malignant classification.
- **Sample Clinical Presets:** One-click presets ("Load Lower Risk Sample" and "Load Higher Risk Sample") to evaluate typical patient profiles without manual data entry.
- **Calibrated Probabilistic Scoring:** Outputs precise probability percentages, risk categories, and narrative clinical interpretations.

---

## 3. System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    HEALTHCARE WEB CLIENT                    │
│      React 19 + Vite SPA (Hosted on GitHub Pages)           │
│  - Authentication Context & Token Session Storage           │
│  - Clinician Dashboard, Telemetry Table & CSV Export        │
│  - Structured Clinical Input Forms with Pre-fill Presets    │
└──────────────┬───────────────────────────────▲──────────────┘
               │                               │
        POST /predict/heart                    │ JSON Risk Prediction,
        POST /auth/login                       │ Calibrated Probability
        GET  /history                          │ & Clinician Telemetry
               ▼                               │
┌──────────────────────────────────────────────┴──────────────┐
│                  FASTAPI BACKEND SERVICE                    │
│        Python 3.11 / ASGI (Hosted on Vercel Serverless)     │
│  - Pydantic v2 schema validation & safe error handling      │
│  - PBKDF2-HMAC password hashing & HS256 JWT tokens          │
│  - SQLite telemetry database (write-safe /tmp path)         │
│  - Auto-scaled serverless execution (1024MB RAM, 30s)       │
└──────────────┬──────────────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────────────────┐
│              SERIALIZED MACHINE LEARNING PIPELINES          │
│        scikit-learn Pipelines (joblib model artifacts)      │
│  1. SimpleImputer (median missing-value imputation)         │
│  2. StandardScaler (unit variance feature normalisation)    │
│  3. Production Classifiers (Random Forest / Calibrated SVM) │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | React 19, Vite 8, React Router v7 |
| **Styling & Icons** | Tailwind CSS v4, Lucide React Icons |
| **Animation & Charts** | Framer Motion, Recharts |
| **HTTP Client** | Axios (centralized in `src/services/api.js` with auth interceptors) |
| **Backend Framework** | FastAPI 0.100+, Uvicorn (ASGI), Pydantic v2 |
| **Security & Cryptography** | PBKDF2-HMAC-SHA256, HMAC-SHA256 JWT tokens |
| **Database** | SQLite (ephemeral `/tmp` serverless path with frontend dual-caching) |
| **Machine Learning** | scikit-learn, XGBoost (training suite), NumPy, pandas, SciPy, joblib |
| **Hosting & Deployment** | GitHub Pages (Frontend SPA) + Vercel Serverless (Backend API) |

---

## 5. Diagnostic Datasets & Model Benchmarks

| Condition | Dataset Origin | Records | Features | Production Model | Benchmark Metrics |
|---|---|---|---|---|---|
| **Heart Disease** | UCI Cleveland Clinic | 303 | 13 | **Random Forest** | Accuracy: 88.5%, F1: 0.9000, ROC-AUC: 0.9589 |
| **Type-2 Diabetes** | NIDDK Pima Indians | 768 | 8 | **Random Forest** | Accuracy: 79.2%, F1: 0.6667, ROC-AUC: 0.8241 |
| **Breast Cancer** | Wisconsin WDBC | 569 | 30 | **Calibrated SVM** | Accuracy: 98.2%, F1: 0.9762, ROC-AUC: 0.9954 |

### Preprocessing & Engineering Standards
1. **Zero Data Leakage:** Preprocessing transformations fit strictly on training splits.
2. **Biological Zero Imputation:** Physiological zeros in blood pressure, glucose, and skin thickness are treated as missing values and imputed with training set medians.
3. **Feature Standardization:** `StandardScaler` standardizes variables to zero mean and unit variance.
4. **Probability Calibration:** Support Vector Machines utilize Platt scaling (`CalibratedClassifierCV`) to output well-calibrated posterior probabilities.
5. **Selection Objective:** Candidate models are ranked on holdout validation data using a composite score:
   $$\text{Composite Score} = 0.70 \times \text{F1-Score} + 0.30 \times \text{ROC-AUC}$$

---

## 6. Repository Layout

```
codeAlpha_disease_prediction/
│
├── .github/
│   └── workflows/
│       └── deploy-pages.yml          # GitHub Pages build and deployment workflow
│
├── backend/
│   ├── api/
│   │   └── index.py                  # Vercel serverless function entrypoint
│   ├── main.py                       # FastAPI application, CORS, Vercel middleware & route declarations
│   ├── requirements.txt              # Production runtime inference dependencies (~110 MB)
│   ├── requirements-training.txt     # Complete training dependencies (includes XGBoost)
│   ├── vercel.json                   # Vercel serverless configuration (path rewrite forwarding)
│   ├── tests/
│   │   ├── test_api_endpoints.py     # End-to-end integration test suite
│   │   └── test_path_rewrite.py      # Middleware path rewrite verification
│   ├── datasets/
│   │   ├── download_datasets.py      # Automated dataset downloader & validator
│   │   ├── heart_disease.csv         # Cleveland Heart Disease cohort data
│   │   ├── diabetes.csv              # Pima Indians Diabetes cohort data
│   │   └── breast_cancer.csv         # Wisconsin Diagnostic Breast Cancer cohort data
│   ├── models/
│   │   ├── heart_model.pkl           # Serialized Heart Disease pipeline
│   │   ├── diabetes_model.pkl        # Serialized Diabetes pipeline
│   │   ├── breast_cancer_model.pkl   # Serialized Breast Cancer pipeline
│   │   └── metrics.json              # Model evaluation metrics & feature importances
│   ├── preprocessing/
│   │   └── pipeline.py               # Preprocessing pipelines & model factories
│   ├── schemas/
│   │   ├── auth.py                   # Pydantic schemas for authentication & history
│   │   └── models.py                 # Pydantic schemas for prediction requests & responses
│   ├── training/
│   │   └── train_all.py              # 4-algorithm benchmark training suite
│   └── utils/
│       ├── auth.py                   # Password hashing, JWT creation & token validation
│       ├── db.py                     # SQLite database manager & telemetry queries
│       └── predict.py                # Prediction inference & probability calibration
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx            # SaaS navigation header with auth state & user menu
│   │   │   ├── Footer.jsx            # Application footer with regulatory notices
│   │   │   ├── FormField.jsx         # Field-level validation & clinical range tooltips
│   │   │   ├── PredictionCard.jsx    # Animated probability gauge & risk classification
│   │   │   ├── ProtectedRoute.jsx    # Clinician session validation & route guard
│   │   │   └── forms/
│   │   │       ├── HeartForm.jsx     # 13-feature Heart Disease form with sample presets
│   │   │       ├── DiabetesForm.jsx  # 8-feature Diabetes form with sample presets
│   │   │       └── BreastCancerForm.jsx # 30-feature WDBC form with sample presets
│   │   ├── context/
│   │   │   └── AuthContext.jsx       # Global authentication provider & session state
│   │   ├── pages/
│   │   │   ├── Home.jsx              # Healthcare SaaS landing page
│   │   │   ├── Login.jsx             # Clinician portal login with demo credentials
│   │   │   ├── Register.jsx          # Clinician account registration
│   │   │   ├── Dashboard.jsx         # Telemetry dashboard, history table & CSV export
│   │   │   ├── Predict.jsx           # Diagnostic prediction hub with tab navigation
│   │   │   ├── Performance.jsx       # Benchmark evaluation charts & confusion matrices
│   │   │   └── About.jsx             # Clinical informatics & architectural documentation
│   │   ├── services/
│   │   │   └── api.js                # Centralized Axios client with Bearer auth injection
│   │   ├── App.jsx                   # Application router & SPA route mapping
│   │   ├── index.css                 # Design tokens & Tailwind CSS styling
│   │   └── main.jsx                  # React application entry point
│   ├── .env.development              # Dev environment (http://127.0.0.1:8000)
│   ├── .env.production               # Production API target (Vercel backend)
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
├── README.md                         # Production platform documentation
└── PROJECT_EXPLANATION.md            # Plain-English technical & clinical breakdown
```

---

## 7. API Specification

| Method | Endpoint | Request Body | Auth | Description |
|---|---|---|---|---|
| `GET` | `/` | None | Public | Service identity, operational status, and documentation links |
| `GET` | `/health` | None | Public | System health check and verified model inventory |
| `GET` | `/models` | None | Public | Metadata, features, and sample counts for active models |
| `GET` | `/metrics` | None | Public | Model evaluation metrics across all four algorithms |
| `GET` | `/metrics/{disease}` | None | Public | Detailed metrics for `heart`, `diabetes`, or `breast_cancer` |
| `POST` | `/auth/register` | JSON (`UserRegisterInput`) | Public | Register new clinician account |
| `POST` | `/auth/login` | JSON (`UserLoginInput`) | Public | Authenticate clinician; returns signed JWT bearer token |
| `GET` | `/auth/me` | None | Bearer | Fetch authenticated clinician profile |
| `GET` | `/history` | None | Bearer | Fetch clinician's longitudinal prediction history |
| `POST` | `/history` | JSON (`SaveHistoryInput`) | Bearer | Explicitly save a prediction record |
| `DELETE` | `/history/{id}` | None | Bearer | Delete a specific prediction record (multi-tenant isolated) |
| `DELETE` | `/history` | None | Bearer | Clear all prediction history for current clinician |
| `POST` | `/predict/heart` | JSON (`HeartDiseaseInput`) | Optional | Heart Disease inference (auto-saved to history if auth) |
| `POST` | `/predict/diabetes` | JSON (`DiabetesInput`) | Optional | Diabetes inference (auto-saved to history if auth) |
| `POST` | `/predict/breast-cancer` | JSON (`BreastCancerInput`) | Optional | Breast Cancer inference (auto-saved to history if auth) |

### Sample Prediction Request
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

### Sample Prediction Response
```json
{
  "disease": "Heart Disease",
  "prediction": 1,
  "result": "Higher Risk",
  "probability": 0.88,
  "risk_category": "Higher Risk",
  "model": "Random Forest",
  "disclaimer": "Statistical clinical risk evaluation based on validated diagnostic models. Intended for professional decision support; consult a physician for comprehensive medical care."
}
```

---

## 8. Local Installation & Development

### Prerequisites
- **Python:** 3.10 – 3.12 (Python 3.14/3.15 compatible)
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

# Create and activate virtual environment
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install runtime dependencies
pip install -r requirements.txt

# Start FastAPI server
uvicorn main:app --reload --port 8000
```
- API Root: `http://127.0.0.1:8000`
- Swagger Documentation: `http://127.0.0.1:8000/docs`

### Step 3: Frontend Setup
```bash
# Open a new terminal from project root
cd frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```
- Local Application: `http://localhost:5173`

---

## 9. Production Deployment Guide

### Backend Deployment (Vercel Serverless)
The backend is configured for Vercel Python Serverless via `backend/vercel.json`:
- **Function Entrypoint:** `main.py`
- **Memory Allocated:** 1024 MB
- **Execution Timeout:** 30 seconds
- **Excluded Files:** Datasets, training notebooks, cache directories, and local databases are excluded to keep the deployment package at ~110 MB, well within Vercel's 250 MB ceiling.
- **Environment Variables:** Set `JWT_SECRET` in the Vercel Project Settings for production token signing.

### Frontend Deployment (GitHub Pages)
The automated workflow `.github/workflows/deploy-pages.yml` executes on every push to `main`:
1. Installs Node.js dependencies via `npm ci`.
2. Compiles production assets via `npm run build` with base path `/codeAlpha_disease_prediction/`.
3. Injects `VITE_API_URL` pointing to the deployed Vercel backend.
4. Generates `dist/404.html` SPA routing fallback for client-side deep linking.
5. Deploys the compiled artifact to GitHub Pages.

---

## 10. Clinical Decision Support & Regulatory Notice

> **IMPORTANT CLINICAL NOTICE:**  
> MedPredict AI is engineered as a **clinical decision support and risk stratification system**.  
> The predictions generated by this software are probabilistic statistical risk estimations and **do not constitute standalone medical diagnoses or clinical screening examinations**.  
> Never initiate, alter, or discontinue any medical treatment, prescription, or therapeutic routine without consulting a licensed physician or board-certified clinical specialist.  
> Always seek the counsel of a licensed physician regarding personal symptoms or medical conditions.  
> Users are strictly prohibited from submitting real personally identifiable patient data (PII).

---

## 11. License

This project is licensed under the [MIT License](LICENSE).
