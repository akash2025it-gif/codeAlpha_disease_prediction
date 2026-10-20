import { useState } from 'react';
import { predictHeartDisease } from '../../services/api';
import FormField from '../FormField';

const DEFAULTS = {
  age: 52, sex: 1, cp: 2, trestbps: 130, chol: 240, fbs: 0,
  restecg: 0, thalach: 140, exang: 0, oldpeak: 1.4, slope: 2, ca: 1, thal: 7
};

export default function HeartForm({ onResult, onLoading }) {
  const [form, setForm] = useState(DEFAULTS);
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (form.age < 1 || form.age > 120) e.age = 'Age must be 1–120';
    if (form.trestbps < 60 || form.trestbps > 250) e.trestbps = 'BP must be 60–250 mm Hg';
    if (form.chol < 100 || form.chol > 600) e.chol = 'Cholesterol must be 100–600';
    if (form.thalach < 60 || form.thalach > 250) e.thalach = 'Max HR must be 60–250 bpm';
    if (form.oldpeak < 0 || form.oldpeak > 10) e.oldpeak = 'Oldpeak must be 0–10';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    onLoading(true);
    try {
      const payload = { ...form };
      Object.keys(payload).forEach(k => { payload[k] = Number(payload[k]); });
      const result = await predictHeartDisease(payload);
      onResult(result);
    } catch (err) {
      onResult({ error: err?.response?.data?.detail || 'Prediction failed. Please try again.' });
    } finally {
      onLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <FormField label="Age" tooltip="Patient age in years" error={errors.age}>
          <input type="number" value={form.age} onChange={e => set('age', e.target.value)}
            className="form-input" min="1" max="120" />
        </FormField>

        <FormField label="Sex" tooltip="Patient biological sex">
          <select value={form.sex} onChange={e => set('sex', e.target.value)} className="form-input">
            <option value={0}>Female</option>
            <option value={1}>Male</option>
          </select>
        </FormField>

        <FormField label="Chest Pain Type" tooltip="Type of chest pain experienced (1=Typical angina, 2=Atypical angina, 3=Non-anginal, 4=Asymptomatic)">
          <select value={form.cp} onChange={e => set('cp', e.target.value)} className="form-input">
            <option value={1}>1 – Typical Angina</option>
            <option value={2}>2 – Atypical Angina</option>
            <option value={3}>3 – Non-Anginal Pain</option>
            <option value={4}>4 – Asymptomatic</option>
          </select>
        </FormField>

        <FormField label="Resting Blood Pressure (mm Hg)" tooltip="Resting blood pressure on admission" error={errors.trestbps}>
          <input type="number" value={form.trestbps} onChange={e => set('trestbps', e.target.value)}
            className="form-input" min="60" max="250" />
        </FormField>

        <FormField label="Serum Cholesterol (mg/dl)" tooltip="Serum cholesterol in mg/dl" error={errors.chol}>
          <input type="number" value={form.chol} onChange={e => set('chol', e.target.value)}
            className="form-input" min="100" max="600" />
        </FormField>

        <FormField label="Fasting Blood Sugar > 120 mg/dl" tooltip="Is fasting blood sugar greater than 120 mg/dl?">
          <select value={form.fbs} onChange={e => set('fbs', e.target.value)} className="form-input">
            <option value={0}>No</option>
            <option value={1}>Yes</option>
          </select>
        </FormField>

        <FormField label="Resting ECG Results" tooltip="0=Normal, 1=ST-T wave abnormality, 2=Left ventricular hypertrophy">
          <select value={form.restecg} onChange={e => set('restecg', e.target.value)} className="form-input">
            <option value={0}>0 – Normal</option>
            <option value={1}>1 – ST-T Wave Abnormality</option>
            <option value={2}>2 – Left Ventricular Hypertrophy</option>
          </select>
        </FormField>

        <FormField label="Max Heart Rate Achieved (bpm)" tooltip="Maximum heart rate achieved during exercise" error={errors.thalach}>
          <input type="number" value={form.thalach} onChange={e => set('thalach', e.target.value)}
            className="form-input" min="60" max="250" />
        </FormField>

        <FormField label="Exercise Induced Angina" tooltip="Angina induced by exercise">
          <select value={form.exang} onChange={e => set('exang', e.target.value)} className="form-input">
            <option value={0}>No</option>
            <option value={1}>Yes</option>
          </select>
        </FormField>

        <FormField label="ST Depression (Oldpeak)" tooltip="ST depression induced by exercise relative to rest" error={errors.oldpeak}>
          <input type="number" step="0.1" value={form.oldpeak} onChange={e => set('oldpeak', e.target.value)}
            className="form-input" min="0" max="10" />
        </FormField>

        <FormField label="Slope of Peak ST Segment" tooltip="1=Upsloping, 2=Flat, 3=Downsloping">
          <select value={form.slope} onChange={e => set('slope', e.target.value)} className="form-input">
            <option value={1}>1 – Upsloping</option>
            <option value={2}>2 – Flat</option>
            <option value={3}>3 – Downsloping</option>
          </select>
        </FormField>

        <FormField label="Major Vessels Colored (0–3)" tooltip="Number of major vessels colored by fluoroscopy (0–3)">
          <select value={form.ca} onChange={e => set('ca', e.target.value)} className="form-input">
            {[0, 1, 2, 3].map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </FormField>

        <FormField label="Thalassemia" tooltip="3=Normal, 6=Fixed defect, 7=Reversible defect">
          <select value={form.thal} onChange={e => set('thal', e.target.value)} className="form-input">
            <option value={3}>3 – Normal</option>
            <option value={6}>6 – Fixed Defect</option>
            <option value={7}>7 – Reversible Defect</option>
          </select>
        </FormField>
      </div>

      <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl transition-colors shadow-md">
        Predict Heart Disease Risk
      </button>
    </form>
  );
}
