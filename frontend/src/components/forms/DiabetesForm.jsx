import { useState } from 'react';
import { predictDiabetes } from '../../services/api';
import FormField from '../FormField';

const DEFAULTS = {
  Pregnancies: 3, Glucose: 117, BloodPressure: 72, SkinThickness: 23,
  Insulin: 30, BMI: 32.0, DiabetesPedigreeFunction: 0.372, Age: 29
};

export default function DiabetesForm({ onResult, onLoading }) {
  const [form, setForm] = useState(DEFAULTS);
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (form.Glucose < 0) e.Glucose = 'Glucose cannot be negative';
    if (form.BMI < 0) e.BMI = 'BMI cannot be negative';
    if (form.BloodPressure < 0) e.BloodPressure = 'Blood pressure cannot be negative';
    if (form.Age < 1 || form.Age > 120) e.Age = 'Age must be 1–120';
    if (form.DiabetesPedigreeFunction < 0) e.DiabetesPedigreeFunction = 'Must be a positive value';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    onLoading(true);
    try {
      const payload = {};
      Object.keys(form).forEach(k => { payload[k] = Number(form[k]); });
      const result = await predictDiabetes(payload);
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
        <FormField label="Number of Pregnancies" tooltip="Number of times pregnant" error={errors.Pregnancies}>
          <input type="number" value={form.Pregnancies} onChange={e => set('Pregnancies', e.target.value)}
            className="form-input" min="0" max="20" />
        </FormField>

        <FormField label="Plasma Glucose (mg/dL)" tooltip="Plasma glucose concentration at 2 hours in an oral glucose tolerance test" error={errors.Glucose}>
          <input type="number" value={form.Glucose} onChange={e => set('Glucose', e.target.value)}
            className="form-input" min="0" max="300" />
        </FormField>

        <FormField label="Diastolic Blood Pressure (mm Hg)" tooltip="Diastolic blood pressure in mm Hg" error={errors.BloodPressure}>
          <input type="number" value={form.BloodPressure} onChange={e => set('BloodPressure', e.target.value)}
            className="form-input" min="0" max="200" />
        </FormField>

        <FormField label="Skin Thickness (mm)" tooltip="Triceps skin fold thickness in mm" error={errors.SkinThickness}>
          <input type="number" value={form.SkinThickness} onChange={e => set('SkinThickness', e.target.value)}
            className="form-input" min="0" max="100" />
        </FormField>

        <FormField label="Serum Insulin (mu U/ml)" tooltip="2-hour serum insulin level (mu U/ml)" error={errors.Insulin}>
          <input type="number" value={form.Insulin} onChange={e => set('Insulin', e.target.value)}
            className="form-input" min="0" max="900" />
        </FormField>

        <FormField label="BMI (kg/m²)" tooltip="Body Mass Index: weight in kg / (height in m)²" error={errors.BMI}>
          <input type="number" step="0.1" value={form.BMI} onChange={e => set('BMI', e.target.value)}
            className="form-input" min="0" max="70" />
        </FormField>

        <FormField
          label="Diabetes Pedigree Function"
          tooltip="A function that scores the likelihood of diabetes based on family history (genetic predisposition score)"
          error={errors.DiabetesPedigreeFunction}
        >
          <input type="number" step="0.001" value={form.DiabetesPedigreeFunction} onChange={e => set('DiabetesPedigreeFunction', e.target.value)}
            className="form-input" min="0" max="3" />
        </FormField>

        <FormField label="Age (years)" tooltip="Patient age in years" error={errors.Age}>
          <input type="number" value={form.Age} onChange={e => set('Age', e.target.value)}
            className="form-input" min="1" max="120" />
        </FormField>
      </div>

      <button type="submit" className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3.5 rounded-xl transition-colors shadow-md">
        Predict Diabetes Risk
      </button>
    </form>
  );
}
