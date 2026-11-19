import { useState } from 'react';
import { predictDiabetes } from '../../services/api';
import FormField from '../FormField';
import { RotateCcw, Sparkles } from 'lucide-react';

const DEFAULTS = {
  Pregnancies: 3,
  Glucose: 117,
  BloodPressure: 72,
  SkinThickness: 23,
  Insulin: 30,
  BMI: 32.0,
  DiabetesPedigreeFunction: 0.372,
  Age: 29,
};

const PRESETS = {
  lowerRisk: {
    Pregnancies: 1,
    Glucose: 85,
    BloodPressure: 66,
    SkinThickness: 20,
    Insulin: 79,
    BMI: 22.5,
    DiabetesPedigreeFunction: 0.238,
    Age: 25,
  },
  higherRisk: {
    Pregnancies: 6,
    Glucose: 168,
    BloodPressure: 88,
    SkinThickness: 38,
    Insulin: 210,
    BMI: 38.5,
    DiabetesPedigreeFunction: 0.825,
    Age: 54,
  },
};

export default function DiabetesForm({ onResult, onLoading }) {
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
    if (form.Pregnancies < 0 || form.Pregnancies > 20) e.Pregnancies = 'Pregnancies must be between 0 and 20';
    if (form.Glucose < 0 || form.Glucose > 300) e.Glucose = 'Glucose must be between 0 and 300 mg/dL';
    if (form.BloodPressure < 0 || form.BloodPressure > 200) e.BloodPressure = 'Blood pressure must be between 0 and 200 mm Hg';
    if (form.SkinThickness < 0 || form.SkinThickness > 100) e.SkinThickness = 'Skin thickness must be between 0 and 100 mm';
    if (form.Insulin < 0 || form.Insulin > 900) e.Insulin = 'Insulin must be between 0 and 900 mu U/ml';
    if (form.BMI < 0 || form.BMI > 70) e.BMI = 'BMI must be between 0.0 and 70.0 kg/m²';
    if (form.DiabetesPedigreeFunction < 0 || form.DiabetesPedigreeFunction > 3.0) {
      e.DiabetesPedigreeFunction = 'Pedigree score must be between 0.0 and 3.0';
    }
    if (form.Age < 1 || form.Age > 120) e.Age = 'Age must be between 1 and 120 years';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    onLoading(true);
    try {
      const payload = {};
      Object.keys(form).forEach((k) => {
        payload[k] = Number(form[k]);
      });
      const result = await predictDiabetes(payload);
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
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-sky-50/60 border border-sky-100 rounded-xl">
        <span className="text-xs font-semibold text-sky-900 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-sky-600 flex-shrink-0" />
          <span>Test Sample Profiles (Pima Indians):</span>
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => applyPreset('lowerRisk')}
            className="text-xs font-medium px-2.5 py-1.5 bg-white text-slate-700 hover:text-sky-700 border border-slate-200 rounded-lg hover:border-sky-300 transition-colors cursor-pointer"
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

      {/* 1. Glycemic & Metabolic Biomarkers */}
      <div className="bg-slate-50/70 p-4 sm:p-5 rounded-xl border border-slate-200/80">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3.5 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-sky-600"></span>
          1. Glycemic & Metabolic Laboratory Telemetry
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <FormField
            label="Plasma Glucose (mg/dL)"
            tooltip="Plasma glucose concentration at 2 hours in an oral glucose tolerance test"
            error={errors.Glucose}
            required
          >
            <input
              type="number"
              value={form.Glucose}
              onChange={(e) => set('Glucose', e.target.value)}
              className="field-input"
              min="0"
              max="300"
            />
          </FormField>

          <FormField
            label="Serum Insulin (mu U/ml)"
            tooltip="2-Hour serum insulin concentration in mu U/ml"
            error={errors.Insulin}
            required
          >
            <input
              type="number"
              value={form.Insulin}
              onChange={(e) => set('Insulin', e.target.value)}
              className="field-input"
              min="0"
              max="900"
            />
          </FormField>

          <FormField
            label="Diabetes Pedigree Function"
            tooltip="Genetic risk score calculating diabetes history in biological relatives"
            error={errors.DiabetesPedigreeFunction}
            required
          >
            <input
              type="number"
              step="0.001"
              value={form.DiabetesPedigreeFunction}
              onChange={(e) => set('DiabetesPedigreeFunction', e.target.value)}
              className="field-input"
              min="0"
              max="3"
            />
          </FormField>
        </div>
      </div>

      {/* 2. Physical Examination & Demographics */}
      <div className="bg-slate-50/70 p-4 sm:p-5 rounded-xl border border-slate-200/80">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3.5 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-teal-600"></span>
          2. Clinical Demographics & Anthropometrics
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <FormField
            label="Patient Age (years)"
            tooltip="Patient age in completed years"
            error={errors.Age}
            required
          >
            <input
              type="number"
              value={form.Age}
              onChange={(e) => set('Age', e.target.value)}
              className="field-input"
              min="1"
              max="120"
            />
          </FormField>

          <FormField
            label="BMI (kg/m²)"
            tooltip="Body Mass Index = weight in kg / (height in m)²"
            error={errors.BMI}
            required
          >
            <input
              type="number"
              step="0.1"
              value={form.BMI}
              onChange={(e) => set('BMI', e.target.value)}
              className="field-input"
              min="0"
              max="70"
            />
          </FormField>

          <FormField
            label="Diastolic Blood Pressure"
            tooltip="Diastolic blood pressure in mm Hg"
            error={errors.BloodPressure}
            required
          >
            <input
              type="number"
              value={form.BloodPressure}
              onChange={(e) => set('BloodPressure', e.target.value)}
              className="field-input"
              min="0"
              max="200"
            />
          </FormField>

          <FormField
            label="Skin Thickness (mm)"
            tooltip="Triceps skin fold thickness in mm (anthropometric measurement)"
            error={errors.SkinThickness}
            required
          >
            <input
              type="number"
              value={form.SkinThickness}
              onChange={(e) => set('SkinThickness', e.target.value)}
              className="field-input"
              min="0"
              max="100"
            />
          </FormField>

          <FormField
            label="Pregnancies"
            tooltip="Number of completed pregnancies (0 for male or nulliparous)"
            error={errors.Pregnancies}
            required
          >
            <input
              type="number"
              value={form.Pregnancies}
              onChange={(e) => set('Pregnancies', e.target.value)}
              className="field-input"
              min="0"
              max="20"
            />
          </FormField>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <button type="submit" className="w-full sm:flex-1 btn-primary py-3 bg-sky-600 hover:bg-sky-700 cursor-pointer">
          Predict Diabetes Risk
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
