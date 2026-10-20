import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

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
