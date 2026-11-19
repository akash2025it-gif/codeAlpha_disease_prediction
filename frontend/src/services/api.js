/**
 * Centralised API service for MedPredict AI frontend.
 *
 * In production (GitHub Pages): connects to the deployed Vercel backend
 * at https://backend-teal-theta-65.vercel.app (or custom VITE_API_URL if provided).
 *
 * In local development (npm run dev): connects to http://127.0.0.1:8000.
 */
import axios from 'axios';

const VERCEL_BACKEND_URL = 'https://backend-teal-theta-65.vercel.app';

const API_BASE =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? 'http://127.0.0.1:8000' : VERCEL_BACKEND_URL);

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor: attach Bearer token if logged in
api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('medpredict_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // Ignore localStorage errors (e.g., SSR/private mode)
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global response error interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(
        new Error(
          'Request timed out. The serverless backend may be warming up — please retry in a moment.'
        )
      );
    }
    if (!error.response) {
      return Promise.reject(
        new Error(
          'Cannot reach the prediction backend service. Please check your internet connection or verify backend status.'
        )
      );
    }
    return Promise.reject(error);
  }
);

// ---------------------------------------------------------------------------
// Health & Model Information
// ---------------------------------------------------------------------------
export async function healthCheck() {
  const res = await api.get('/health');
  return res.data;
}

export async function getModels() {
  const res = await api.get('/models');
  return res.data;
}

export async function getMetrics() {
  const res = await api.get('/metrics');
  return res.data;
}

export async function getDiseaseMetrics(diseaseKey) {
  const res = await api.get(`/metrics/${diseaseKey}`);
  return res.data;
}

// ---------------------------------------------------------------------------
// Authentication
// ---------------------------------------------------------------------------
export async function authLogin({ email, password }) {
  const res = await api.post('/auth/login', { email, password });
  return res.data;
}

export async function authRegister({ name, email, password }) {
  const res = await api.post('/auth/register', { name, email, password });
  return res.data;
}

export async function authMe() {
  const res = await api.get('/auth/me');
  return res.data;
}

// ---------------------------------------------------------------------------
// Prediction Endpoints
// ---------------------------------------------------------------------------
export async function predictHeartDisease(formData) {
  const res = await api.post('/predict/heart', formData);
  // Back up locally as well
  saveLocalHistoryRecord('Heart Disease', res.data, formData);
  return res.data;
}

export async function predictDiabetes(formData) {
  const res = await api.post('/predict/diabetes', formData);
  saveLocalHistoryRecord('Diabetes', res.data, formData);
  return res.data;
}

export async function predictBreastCancer(formData) {
  const res = await api.post('/predict/breast-cancer', formData);
  saveLocalHistoryRecord('Breast Cancer', res.data, formData);
  return res.data;
}

// ---------------------------------------------------------------------------
// Longitudinal Prediction History
// ---------------------------------------------------------------------------
export async function getHistory() {
  try {
    const res = await api.get('/history');
    return res.data;
  } catch (err) {
    // If unauthenticated or offline, return locally cached history
    return getLocalHistory();
  }
}

export async function saveHistory(data) {
  try {
    const res = await api.post('/history', data);
    return res.data;
  } catch (err) {
    saveLocalHistoryRecord(data.disease, data, data.inputs);
    return data;
  }
}

export async function deleteHistoryItem(id) {
  try {
    const res = await api.delete(`/history/${id}`);
    deleteLocalHistoryItem(id);
    return res.data;
  } catch (err) {
    deleteLocalHistoryItem(id);
    return { status: 'success' };
  }
}

export async function clearAllHistory() {
  try {
    const res = await api.delete('/history');
    localStorage.removeItem('medpredict_local_history');
    return res.data;
  } catch (err) {
    localStorage.removeItem('medpredict_local_history');
    return { status: 'success' };
  }
}

// ---------------------------------------------------------------------------
// LocalStorage History Fallback
// ---------------------------------------------------------------------------
function getLocalHistory() {
  try {
    const data = localStorage.getItem('medpredict_local_history');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveLocalHistoryRecord(diseaseName, result, inputs) {
  try {
    const current = getLocalHistory();
    const newRecord = {
      id: Date.now(),
      disease: diseaseName,
      prediction: result.prediction,
      result: result.result,
      probability: result.probability,
      risk_category: result.risk_category,
      model: result.model,
      inputs: inputs || {},
      created_at: new Date().toISOString(),
    };
    // Keep last 50
    const updated = [newRecord, ...current].slice(0, 50);
    localStorage.setItem('medpredict_local_history', JSON.stringify(updated));
  } catch {
    // Ignore storage quota
  }
}

function deleteLocalHistoryItem(id) {
  try {
    const current = getLocalHistory();
    const updated = current.filter((item) => String(item.id) !== String(id));
    localStorage.setItem('medpredict_local_history', JSON.stringify(updated));
  } catch {
    // Ignore
  }
}

export default api;
