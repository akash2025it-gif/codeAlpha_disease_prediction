/**
 * Centralised API service for the MedPredict AI frontend.
 *
 * Production API URL is injected at build time via the VITE_API_URL
 * environment variable (set as a GitHub Actions secret named VITE_API_URL).
 *
 * Local development falls back to http://127.0.0.1:8000 automatically.
 */
import axios from 'axios';

// In development (npm run dev) VITE_API_URL is read from frontend/.env
// In production builds (GitHub Actions) it is injected from the repository secret
const API_BASE =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? 'http://127.0.0.1:8000' : null);

if (!API_BASE) {
  console.error(
    '[MedPredict] VITE_API_URL is not set. ' +
    'Add it as a GitHub Actions secret (Settings → Secrets → VITE_API_URL) ' +
    'pointing to your deployed Render backend URL.'
  );
}

const api = axios.create({
  baseURL: API_BASE || 'http://127.0.0.1:8000',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Global response error interceptor — log but do not swallow errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Request timed out. The backend may be starting up — please try again in a moment.'));
    }
    if (!error.response) {
      return Promise.reject(new Error('Cannot reach the backend server. Please check your connection or try again later.'));
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
