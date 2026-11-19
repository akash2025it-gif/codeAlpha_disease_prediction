import { useState } from 'react';
import { predictHeartDisease } from '../../services/api';
import FormField from '../FormField';
import { RotateCcw, Sparkles } from 'lucide-react';

const DEFAULTS = {
  age: 52,
  sex: 1,
  cp: 2,
  trestbps: 130,
  chol: 240,
  fbs: 0,
  restecg: 0,
  thalach: 140,
  exang: 0,
  oldpeak: 1.4,
  slope: 2,
  ca: 1,
  thal: 7,
};

const PRESETS = {
  lowerRisk: {
    age: 45,
    sex: 0,
    cp: 1,
    trestbps: 118,
    chol: 195,
    fbs: 0,
    restecg: 0,
    thalach: 168,
    exang: 0,
    oldpeak: 0.2,
    slope: 1,
    ca: 0,
    thal: 3,
  },
  higherRisk: {
    age: 67,
    sex: 1,
    cp: 4,
    trestbps: 160,
    chol: 286,
    fbs: 1,
    restecg: 2,
    thalach: 108,
    exang: 1,
    oldpeak: 2.6,
    slope: 2,
    ca: 3,
    thal: 7,
  },
};

export default function HeartForm({ onResult, onLoading }) {
  const [form, setForm] = useState(DEFAULTS);
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleReset = () => {
    setForm(DEFAULTS);
    setErrors({});
  };

  const applyPreset = (presetKey) => {
    setForm(PRESETS[presetKey]);
    setErrors({});
  };

  const validate = () => {
    const e = {};
    if (form.age < 1 || form.age > 120) e.age = 'Age must be between 1 and 120';
    if (form.trestbps < 60 || form.trestbps > 250) e.trestbps = 'Resting BP must be between 60 and 250 mm Hg';
    if (form.chol < 100 || form.chol > 600) e.chol = 'Cholesterol must be between 100 and 600 mg/dl';
    if (form.thalach < 60 || form.thalach > 250) e.thalach = 'Max heart rate must be between 60 and 250 bpm';
    if (form.oldpeak < 0 || form.oldpeak > 10) e.oldpeak = 'ST depression must be between 0.0 and 10.0';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    onLoading(true);
    try {
      const payload = { ...form };
      Object.keys(payload).forEach((k) => {
        payload[k] = Number(payload[k]);
      });
      const result = await predictHeartDisease(payload);
      onResult(result);
    } catch (err) {
      onResult({
        error:
          err?.response?.data?.detail ||
          err?.message ||
          'Prediction failed. Please ensure the backend server is reachable.',
      });
    } finally {
      onLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-full">
      {/* Sample preset buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-blue-50/60 border border-blue-100 rounded-xl">
        <span className="text-xs font-semibold text-blue-900 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
          <span>Test Sample Profiles:</span>
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => applyPreset('lowerRisk')}
            className="text-xs font-medium px-2.5 py-1.5 bg-white text-slate-700 hover:text-blue-700 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer"
          >
            Load Lower Risk Sample
          </button>
          <button
            type="button"
            onClick={() => applyPreset('higherRisk')}
            className="text-xs font-medium px-2.5 py-1.5 bg-white text-slate-700 hover:text-red-700 border border-slate-200 rounded-lg hover:border-red-300 transition-colors cursor-pointer"
          >
            Load Higher Risk Sample
          </button>
        </div>
      </div>

      {/* 1. Patient Vitals & Blood Chemistry */}
      <div className="bg-slate-50/70 p-4 sm:p-5 rounded-xl border border-slate-200/80">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3.5 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-600"></span>
          1. Demographics & Baseline Vitals
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <FormField label="Age (years)" tooltip="Patient age in completed years" error={errors.age} required>
            <input
              type="number"
              value={form.age}
              onChange={(e) => set('age', e.target.value)}
              className="field-input"
              min="1"
              max="120"
            />
          </FormField>

          <FormField label="Biological Sex" tooltip="Sex recorded at admission (0 = Female, 1 = Male)" required>
            <select value={form.sex} onChange={(e) => set('sex', e.target.value)} className="field-input">
              <option value={0}>0 — Female</option>
              <option value={1}>1 — Male</option>
            </select>
          </FormField>

          <FormField
            label="Resting Blood Pressure"
            tooltip="Resting blood pressure in mm Hg on admission to hospital"
            error={errors.trestbps}
            required
          >
            <input
              type="number"
              value={form.trestbps}
              onChange={(e) => set('trestbps', e.target.value)}
              className="field-input"
              min="60"
              max="250"
            />
          </FormField>

          <FormField
            label="Serum Cholesterol (mg/dl)"
            tooltip="Serum cholesterol measurement in mg/dl"
            error={errors.chol}
            required
          >
            <input
              type="number"
              value={form.chol}
              onChange={(e) => set('chol', e.target.value)}
              className="field-input"
              min="100"
              max="600"
            />
          </FormField>

          <FormField
            label="Fasting Blood Sugar > 120"
            tooltip="Fasting blood sugar > 120 mg/dl (1 = true; 0 = false)"
            required
          >
            <select value={form.fbs} onChange={(e) => set('fbs', e.target.value)} className="field-input">
              <option value={0}>0 — Normal (≤ 120 mg/dl)</option>
              <option value={1}>1 — Elevated (&gt; 120 mg/dl)</option>
            </select>
          </FormField>
        </div>
      </div>

      {/* 2. Cardiac Symptoms & Stress Electrocardiography */}
      <div className="bg-slate-50/70 p-4 sm:p-5 rounded-xl border border-slate-200/80">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3.5 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-600"></span>
          2. Electrocardiogram & Exercise Stress Telemetry
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <FormField
            label="Chest Pain Type (cp)"
            tooltip="1: Typical angina, 2: Atypical angina, 3: Non-anginal pain, 4: Asymptomatic"
            required
          >
            <select value={form.cp} onChange={(e) => set('cp', e.target.value)} className="field-input">
              <option value={1}>1 — Typical Angina</option>
              <option value={2}>2 — Atypical Angina</option>
              <option value={3}>3 — Non-Anginal Pain</option>
              <option value={4}>4 — Asymptomatic</option>
            </select>
          </FormField>

          <FormField
            label="Resting ECG Results"
            tooltip="0: Normal, 1: ST-T wave abnormality, 2: Left ventricular hypertrophy"
            required
          >
            <select value={form.restecg} onChange={(e) => set('restecg', e.target.value)} className="field-input">
              <option value={0}>0 — Normal</option>
              <option value={1}>1 — ST-T Wave Abnormality</option>
              <option value={2}>2 — Left Ventricular Hypertrophy</option>
            </select>
          </FormField>

          <FormField
            label="Maximum Heart Rate (thalach)"
            tooltip="Maximum heart rate achieved during exercise treadmill test (bpm)"
            error={errors.thalach}
            required
          >
            <input
              type="number"
              value={form.thalach}
              onChange={(e) => set('thalach', e.target.value)}
              className="field-input"
              min="60"
              max="250"
            />
          </FormField>

          <FormField
            label="Exercise Induced Angina"
            tooltip="Angina induced during exercise test (1 = Yes, 0 = No)"
            required
          >
            <select value={form.exang} onChange={(e) => set('exang', e.target.value)} className="field-input">
              <option value={0}>0 — No</option>
              <option value={1}>1 — Yes</option>
            </select>
          </FormField>

          <FormField
            label="ST Depression (Oldpeak)"
            tooltip="ST depression induced by exercise relative to rest"
            error={errors.oldpeak}
            required
          >
            <input
              type="number"
              step="0.1"
              value={form.oldpeak}
              onChange={(e) => set('oldpeak', e.target.value)}
              className="field-input"
              min="0"
              max="10"
            />
          </FormField>

          <FormField
            label="Slope of Peak Exercise ST"
            tooltip="Slope of peak exercise ST segment: 1: Upsloping, 2: Flat, 3: Downsloping"
            required
          >
            <select value={form.slope} onChange={(e) => set('slope', e.target.value)} className="field-input">
              <option value={1}>1 — Upsloping</option>
              <option value={2}>2 — Flat</option>
              <option value={3}>3 — Downsloping</option>
            </select>
          </FormField>
        </div>
      </div>

      {/* 3. Fluoroscopy & Perfusion Scintigraphy */}
      <div className="bg-slate-50/70 p-4 sm:p-5 rounded-xl border border-slate-200/80">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3.5 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-600"></span>
          3. Fluoroscopy & Nuclear Perfusion
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            label="Major Vessels (ca: 0–3)"
            tooltip="Number of major vessels (0-3) colored by fluoroscopy"
            required
          >
            <select value={form.ca} onChange={(e) => set('ca', e.target.value)} className="field-input">
              {[0, 1, 2, 3].map((v) => (
                <option key={v} value={v}>
                  {v} vessels colored
                </option>
              ))}
            </select>
          </FormField>

          <FormField
            label="Thalassemia Status (thal)"
            tooltip="Thallium stress test outcome: 3 = Normal, 6 = Fixed defect, 7 = Reversible defect"
            required
          >
            <select value={form.thal} onChange={(e) => set('thal', e.target.value)} className="field-input">
              <option value={3}>3 — Normal</option>
              <option value={6}>6 — Fixed Defect</option>
              <option value={7}>7 — Reversible Defect</option>
            </select>
          </FormField>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <button type="submit" className="w-full sm:flex-1 btn-primary py-3 cursor-pointer">
          Predict Heart Disease Risk
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="w-full sm:w-auto btn-outline py-3 px-5 text-slate-600 hover:text-slate-900 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Form</span>
        </button>
      </div>
    </form>
  );
}
