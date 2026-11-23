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
  // Vercel can take longer than 30 seconds to initialise a cold Python/ML function.
  // Keep this below a minute so the UI remains responsive while avoiding false failures.
  timeout: 55000,
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
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
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

export async function authLogout() {
  await api.post('/auth/logout');
}

// ---------------------------------------------------------------------------
// Prediction Endpoints
// ---------------------------------------------------------------------------
export async function predictHeartDisease(formData) {
  const res = await api.post('/predict/heart', formData);
  return res.data;
}

export async function predictDiabetes(formData) {
  const res = await api.post('/predict/diabetes', formData);
  return res.data;
}

export async function predictBreastCancer(formData) {
  const res = await api.post('/predict/breast-cancer', formData);
  return res.data;
}

// ---------------------------------------------------------------------------
// Longitudinal Prediction History
// ---------------------------------------------------------------------------
export async function getHistory() {
  const res = await api.get('/history');
  return res.data;
}

export async function saveHistory(data) {
  const res = await api.post('/history', data);
  return res.data;
}

export async function deleteHistoryItem(id) {
  const res = await api.delete(`/history/${id}`);
  return res.data;
}

export async function clearAllHistory() {
  const res = await api.delete('/history');
  return res.data;
}

export default api;
