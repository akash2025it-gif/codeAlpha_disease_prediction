/**
 * Centralised API service for the MedPredict AI frontend.
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

// Global response error interceptor — log but do not swallow errors
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

export default api;
