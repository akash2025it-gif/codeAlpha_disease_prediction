# Disease Prediction from Medical Data

> An AI-powered web application that predicts the risk of Heart Disease, Diabetes, and Breast Cancer using machine-learning classification algorithms trained on real clinical datasets.

## Project Objective

Demonstrate how machine learning classification models can be trained on structured patient medical data to estimate disease risk. Built as a complete, production-style full-stack application.

---

## Features

- ✅ Predict risk for **Heart Disease**, **Diabetes**, and **Breast Cancer**
- ✅ **4 ML algorithms** per disease: Logistic Regression, SVM, Random Forest, XGBoost
- ✅ **Best model automatically selected** by composite F1/ROC-AUC score
- ✅ Real-time predictions via **FastAPI REST API**
- ✅ **Probability gauge** and **risk category** (Lower / Moderate / Higher)
- ✅ **Model Performance Dashboard** with comparison charts, metrics table, confusion matrix, and feature importance
- ✅ Responsive, animated **React + Tailwind** UI
- ✅ Full **input validation** on frontend and backend
- ✅ No patient data stored — stateless prediction service

---

## Technologies

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, JavaScript |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Charts | Recharts |
| Icons | Lucide React |
| Backend | FastAPI, Uvicorn |
| Data Validation | Pydantic v2 |
| Machine Learning | scikit-learn, XGBoost |
| Data Processing | pandas, numpy |
| Model Serialization | joblib |

---

## ML Algorithms

1. **Logistic Regression** — Linear probabilistic classifier
2. **Support Vector Machine (SVM)** — RBF kernel with calibrated probabilities
3. **Random Forest** — Ensemble of 100 decision trees
4. **XGBoost** — Gradient boosted trees

**Best model selection criterion:** Composite score = 70% F1-Score + 30% ROC-AUC

---

## Datasets

| Disease | Dataset | Source | Samples | Features |
|---------|---------|--------|---------|----------|
| Heart Disease | UCI Cleveland Heart Disease | UCI ML Repository | 303 | 13 |
| Diabetes | Pima Indians Diabetes | Jason Brownlee / UCI | 768 | 8 |
| Breast Cancer | Wisconsin Diagnostic (WDBC) | scikit-learn built-in | 569 | 30 |

All datasets are automatically downloaded/loaded when running `train_all.py`.

---

## Folder Structure

```
disease-prediction/
├── backend/
│   ├── main.py                    # FastAPI application
│   ├── requirements.txt
│   ├── datasets/
│   │   ├── download_datasets.py   # Dataset acquisition
│   │   ├── heart_disease.csv
│   │   ├── diabetes.csv
│   │   └── breast_cancer.csv
│   ├── models/
│   │   ├── heart_model.pkl
│   │   ├── diabetes_model.pkl
│   │   ├── breast_cancer_model.pkl
│   │   └── metrics.json
│   ├── preprocessing/
│   │   └── pipeline.py            # Preprocessing + model factories
│   ├── training/
│   │   └── train_all.py           # Full training script
│   ├── schemas/
│   │   └── models.py              # Pydantic request/response schemas
│   └── utils/
│       └── predict.py             # Prediction utilities
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── Footer.jsx
    │   │   ├── FormField.jsx
    │   │   ├── PredictionCard.jsx
    │   │   └── forms/
    │   │       ├── HeartForm.jsx
    │   │       ├── DiabetesForm.jsx
    │   │       └── BreastCancerForm.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Predict.jsx
    │   │   ├── Performance.jsx
    │   │   ├── About.jsx
    │   │   └── Disclaimer.jsx
    │   ├── services/
    │   │   └── api.js             # Centralized API calls
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── .env
    └── vite.config.js
```

---

## Installation

### Prerequisites

- Python 3.10+ 
- Node.js 18+

### 1. Clone / Open Project

```bash
cd disease-prediction
```

### 2. Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 3. Frontend Dependencies

```bash
cd frontend
npm install
```

---

## Dataset Setup

Datasets are acquired automatically when you run the training script.

- **Heart Disease**: Downloaded from UCI ML Repository
- **Diabetes**: Downloaded from Jason Brownlee's dataset mirror
- **Breast Cancer**: Loaded from scikit-learn's built-in datasets

No manual download required.

---

## Model Training

```bash
cd backend
pip install -r requirements-training.txt
python training/train_all.py
```

This will:
1. Download/load all datasets
2. Train 4 algorithms per disease (12 models total)
3. Print a full metrics summary
4. Save the best model for each disease as `.pkl`
5. Save all metrics to `models/metrics.json`

---

## Backend Setup

```bash
cd backend
uvicorn main:app --reload
```

Backend runs at: **http://127.0.0.1:8000**

Swagger UI: **http://127.0.0.1:8000/docs**

---

## Frontend Setup

```bash
cd frontend
npm run dev
```

Frontend runs at: **http://localhost:5173**

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Root info |
| GET | `/health` | Health check + models status |
| GET | `/models` | Available models info |
| GET | `/metrics` | All training metrics |
| GET | `/metrics/{key}` | Single disease metrics |
| POST | `/predict/heart` | Heart disease prediction |
| POST | `/predict/diabetes` | Diabetes prediction |
| POST | `/predict/breast-cancer` | Breast cancer prediction |

### Example Prediction Response

```json
{
  "disease": "Heart Disease",
  "prediction": 1,
  "result": "Higher Risk",
  "probability": 0.78,
  "risk_category": "Higher Risk",
  "model": "Random Forest",
  "disclaimer": "This prediction is for educational purposes only..."
}
```

---

## Risk Categories

| Probability | Category |
|-------------|----------|
| 0–30% | Lower Risk |
| 31–60% | Moderate Risk |
| 61–100% | Higher Risk |

---

## Limitations

- Trained on small public datasets (303–768 samples)
- Not clinically validated for real patient populations
- Model accuracy varies; not suitable for clinical use
- Breast cancer model uses 30 cell nucleus measurement features which require lab instrumentation

---

## Future Improvements

- Add SHAP explainability values
- Implement cross-validation for more robust metrics
- Add more diseases (kidney disease, liver disease)
- Deploy to cloud (Render, Railway, Vercel)
- Add user accounts and prediction history

