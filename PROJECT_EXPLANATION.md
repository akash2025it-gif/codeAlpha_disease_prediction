# Disease Prediction from Medical Data — Project Explanation

*Written in simple English for anyone to understand.*

---

## 1. Project Objective

This project predicts whether a person might have a disease based on their medical measurements. Think of it like a calculator that takes clinical values (like blood sugar, blood pressure, cholesterol) and outputs a risk percentage.

We do this for three diseases:
- **Heart Disease**
- **Diabetes**
- **Breast Cancer**

The goal is educational — to show how machine learning works with real medical data, from raw CSV files to a live web application.

---

## 2. Datasets

A dataset is a table of medical records. Each row is one patient. Each column is a measurement.

| Dataset | Patients | Measurements |
|---------|----------|--------------|
| UCI Heart Disease | 303 | 13 clinical features (age, cholesterol, ECG, etc.) |
| Pima Indians Diabetes | 768 | 8 clinical features (glucose, BMI, insulin, etc.) |
| Wisconsin Breast Cancer | 569 | 30 cell nucleus measurements |

The last column in each dataset is the **target** — whether the patient actually had the disease (1) or not (0). The model learns from these labeled examples.

---

## 3. Features (Input Variables)

**Features** are the input columns the model uses to make predictions.

Examples:
- For heart disease: age, sex, chest pain type, blood pressure, cholesterol, heart rate
- For diabetes: glucose level, BMI, number of pregnancies, insulin level
- For breast cancer: radius, texture, perimeter, and area of cell nuclei (measured from microscopic images)

---

## 4. Preprocessing

Before feeding data into a model, we must clean and prepare it. This is called preprocessing.

Steps:

1. **Handle missing values**: Some measurements were recorded as 0 when they should be "unknown" (e.g., glucose = 0 is biologically impossible). We replace these with the median value.

2. **Imputation**: Fill remaining missing values using the median of the column.

3. **Scaling (Standardization)**: Convert every number to the same scale. This prevents a large number (like area = 600) from dominating over small numbers (like smoothness = 0.1).

4. **Train/test split**: 80% of the data is used to teach the model; 20% is held back to test how well it learned.

The preprocessing pipeline is saved as part of the model file. This ensures that predictions at inference time use exactly the same transformations.

---

## 5. Classification

Classification is a type of machine learning where the model learns to assign inputs to categories.

Here: **Category 0 = No Disease**, **Category 1 = Disease Present**

The model also outputs a probability (e.g., 0.73 = 73% chance of disease).

---

## 6. Logistic Regression

Think of this as drawing a straight line (or a flat surface in many dimensions) that best separates sick patients from healthy ones.

- Simple and fast to train
- Works well when the relationship between features and the disease is roughly linear
- The "coefficients" (weights) show which features matter most

---

## 7. Support Vector Machine (SVM)

SVM finds the widest possible "corridor" between the two groups (sick vs healthy) in multi-dimensional feature space.

- Uses a mathematical trick called the "kernel trick" to handle curved boundaries
- We use an RBF (Radial Basis Function) kernel
- Probabilities are estimated using a calibration method called Platt scaling

---

## 8. Random Forest

Imagine 100 different doctors each making a decision independently. Their combined vote is the prediction.

Each "doctor" is a decision tree — a flowchart of yes/no questions about the features. Random Forest builds 100 trees, each trained on a slightly different random subset of data and features. The final prediction is the majority vote.

- Less likely to overfit than a single decision tree
- Provides feature importance scores
- Robust to noisy data

---

## 9. XGBoost

XGBoost builds trees one at a time. Each new tree focuses on the mistakes of the previous trees, gradually improving the predictions.

- One of the most powerful algorithms for tabular (spreadsheet) data
- Handles missing values internally
- Extremely fast and accurate

---

## 10. Training

Training means showing the algorithm thousands of labeled examples (patient records with known outcomes) so it can learn the patterns.

During training:
- The algorithm adjusts its internal parameters to minimize prediction errors
- A validation split helps monitor whether the model is generalizing well

All 4 algorithms are trained on the exact same preprocessed data for fair comparison.

---

## 11. Testing

After training, we hide the model's answer key and ask it to predict on the 20% test set it has never seen.

This gives us an honest estimate of how it will perform in the real world.

---

## 12. Evaluation Metrics

After predicting on the test set, we measure quality using:

| Metric | What It Measures |
|--------|-----------------|
| **Accuracy** | % of all predictions that were correct |
| **Precision** | Of patients flagged as positive, how many actually were? |
| **Recall** | Of actual positive patients, how many did we catch? |
| **F1-Score** | Harmonic mean of Precision and Recall (balances both) |
| **ROC-AUC** | How well does the model rank positive cases above negative? (1.0 = perfect) |
| **Confusion Matrix** | Table showing TP, TN, FP, FN counts |

In medical scenarios, **Recall** is often critically important — missing a sick patient (False Negative) can be more harmful than a false alarm.

---

## 13. Best-Model Selection

For each disease, all four algorithms are compared. The winner is selected by:

> **Composite Score = 70% × F1-Score + 30% × ROC-AUC**

This balances classification quality with probability ranking ability. The winning model is saved to disk.

---

## 14. FastAPI Backend

FastAPI is a Python web framework that creates an API (Application Programming Interface) — a set of URLs you can send data to and get responses from.

Our backend:
- Loads the saved model on startup
- Validates incoming patient data using Pydantic schemas
- Runs it through the pipeline (preprocessing → model prediction)
- Returns a JSON response with prediction, probability, and model name

Example URL: `POST /predict/heart` with patient measurements in the request body.

---

## 15. React Frontend

React is a JavaScript library for building interactive web pages.

Our frontend has five pages:
- **Home**: Introduction and disease cards
- **Predict**: Disease selector + form + result
- **Model Performance**: Charts, metrics table, confusion matrix
- **About**: Explanations of algorithms and workflow
- **Disclaimer**: Legal and ethical warnings

---

## 16. API Communication

When you click "Predict Disease Risk":
1. The React form collects all values
2. JavaScript sends them to the FastAPI backend via HTTP POST (using Axios)
3. FastAPI processes and returns the prediction JSON
4. React displays the result with an animated probability gauge

All API calls are centralized in `frontend/src/services/api.js`.

---

## 17. Prediction Flow

```
User enters values in form
         ↓
React validates input
         ↓
POST request to FastAPI /predict/heart (or /diabetes, /breast-cancer)
         ↓
Pydantic validates the JSON
         ↓
Values passed to scikit-learn Pipeline:
  → Imputer fills any missing values
  → StandardScaler standardizes values
  → Best model (e.g. Random Forest) predicts
         ↓
Returns: prediction, probability, model name
         ↓
Frontend renders risk gauge and result card
```

---

## 18. Feature Importance

Feature importance answers the question: **"Which measurements were most useful for making this prediction?"**

- **Random Forest / XGBoost**: Uses the built-in `feature_importances_` attribute — how much each feature reduces prediction error across all decision splits.
- **Logistic Regression**: Uses absolute coefficient values (after standardization).
- **SVM (RBF kernel)**: Does not natively expose feature importances — we show Random Forest importances as a proxy.

Importances are shown as percentages in the Model Performance page.

---

## 19. Limitations

| Limitation | Why It Matters |
|------------|----------------|
| Small datasets (300–769 samples) | Models may not generalize to all populations |
| No demographic diversity guarantee | Training data may not represent all ethnicities/regions |
| Not clinically validated | Has not been tested in real medical settings |
| Binary classification only | Does not distinguish disease subtypes |
| Breast cancer features require lab | You need a fine needle aspirate (FNA) biopsy for those 30 measurements |

---

## 20. Future Improvements

- Add **SHAP** (SHapley Additive exPlanations) for per-prediction explainability
- Use larger, more diverse datasets
- Add more diseases (chronic kidney disease, liver cirrhosis, etc.)
- Implement **cross-validation** for more reliable metric estimation
- Deploy to cloud infrastructure (e.g., Render, Railway, Vercel)
- Add authentication and prediction history logging
- Support for clinical data import (CSV upload)

---

*This project was built for educational purposes only. It is not a medical device, medical diagnostic tool, or medical advice system.*
