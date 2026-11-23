import { useState } from 'react';
import { predictBreastCancer } from '../../services/api';
import FormField from '../FormField';
import { RotateCcw, Sparkles } from 'lucide-react';

const DEFAULTS = {
  mean_radius: 14.13,
  mean_texture: 20.38,
  mean_perimeter: 91.97,
  mean_area: 654.9,
  mean_smoothness: 0.1,
  mean_compactness: 0.104,
  mean_concavity: 0.089,
  mean_concave_points: 0.049,
  mean_symmetry: 0.181,
  mean_fractal_dimension: 0.063,
  radius_error: 0.406,
  texture_error: 1.218,
  perimeter_error: 2.893,
  area_error: 40.34,
  smoothness_error: 0.007,
  compactness_error: 0.026,
  concavity_error: 0.026,
  concave_points_error: 0.013,
  symmetry_error: 0.019,
  fractal_dimension_error: 0.003,
  worst_radius: 16.21,
  worst_texture: 29.57,
  worst_perimeter: 107.3,
  worst_area: 826.4,
  worst_smoothness: 0.146,
  worst_compactness: 0.256,
  worst_concavity: 0.258,
  worst_concave_points: 0.127,
  worst_symmetry: 0.298,
  worst_fractal_dimension: 0.089,
};

const PRESETS = {
  lowerRisk: {
    mean_radius: 13.54,
    mean_texture: 14.36,
    mean_perimeter: 87.46,
    mean_area: 566.3,
    mean_smoothness: 0.0978,
    mean_compactness: 0.0813,
    mean_concavity: 0.0666,
    mean_concave_points: 0.0478,
    mean_symmetry: 0.1885,
    mean_fractal_dimension: 0.0577,
    radius_error: 0.2699,
    texture_error: 0.7886,
    perimeter_error: 2.058,
    area_error: 23.56,
    smoothness_error: 0.0085,
    compactness_error: 0.0146,
    concavity_error: 0.0239,
    concave_points_error: 0.0132,
    symmetry_error: 0.0198,
    fractal_dimension_error: 0.0023,
    worst_radius: 15.11,
    worst_texture: 19.26,
    worst_perimeter: 99.7,
    worst_area: 711.2,
    worst_smoothness: 0.144,
    worst_compactness: 0.1773,
    worst_concavity: 0.239,
    worst_concave_points: 0.1288,
    worst_symmetry: 0.2977,
    worst_fractal_dimension: 0.0726,
  },
  higherRisk: {
    mean_radius: 17.99,
    mean_texture: 10.38,
    mean_perimeter: 122.8,
    mean_area: 1001.0,
    mean_smoothness: 0.1184,
    mean_compactness: 0.2776,
    mean_concavity: 0.3001,
    mean_concave_points: 0.1471,
    mean_symmetry: 0.2419,
    mean_fractal_dimension: 0.0787,
    radius_error: 1.095,
    texture_error: 0.9053,
    perimeter_error: 8.589,
    area_error: 153.4,
    smoothness_error: 0.0064,
    compactness_error: 0.049,
    concavity_error: 0.0537,
    concave_points_error: 0.0159,
    symmetry_error: 0.03,
    fractal_dimension_error: 0.0062,
    worst_radius: 25.38,
    worst_texture: 17.33,
    worst_perimeter: 184.6,
    worst_area: 2019.0,
    worst_smoothness: 0.1622,
    worst_compactness: 0.6656,
    worst_concavity: 0.7119,
    worst_concave_points: 0.2654,
    worst_symmetry: 0.4601,
    worst_fractal_dimension: 0.1189,
  },
};

const GROUPS = [
  {
    label: '1. Mean Values (Average Measurements of Cell Nuclei)',
    fields: [
      ['mean_radius', 'Mean Radius', 'Mean of distances from center to perimeter points'],
      ['mean_texture', 'Mean Texture', 'Standard deviation of gray-scale values'],
      ['mean_perimeter', 'Mean Perimeter', 'Mean perimeter of cell nuclei'],
      ['mean_area', 'Mean Area', 'Mean area of cell nuclei'],
      ['mean_smoothness', 'Mean Smoothness', 'Local variation in radius lengths'],
      ['mean_compactness', 'Mean Compactness', 'Perimeter² / area − 1.0'],
      ['mean_concavity', 'Mean Concavity', 'Severity of concave portions of the contour'],
      ['mean_concave_points', 'Mean Concave Points', 'Number of concave portions of the contour'],
      ['mean_symmetry', 'Mean Symmetry', 'Symmetry of cell nuclei'],
      ['mean_fractal_dimension', 'Mean Fractal Dim.', '"Coastline approximation" − 1'],
    ],
  },
  {
    label: '2. Standard Errors (Measurement Variance)',
    fields: [
      ['radius_error', 'Radius Error', 'Standard error for the mean of distances from center'],
      ['texture_error', 'Texture Error', 'Standard error for standard deviation of gray-scale values'],
      ['perimeter_error', 'Perimeter Error', 'Standard error for perimeter'],
      ['area_error', 'Area Error', 'Standard error for area'],
      ['smoothness_error', 'Smoothness Error', 'Standard error for local variation in radius lengths'],
      ['compactness_error', 'Compactness Error', 'Standard error for compactness'],
      ['concavity_error', 'Concavity Error', 'Standard error for severity of concave portions'],
      ['concave_points_error', 'Concave Points Err.', 'Standard error for number of concave portions'],
      ['symmetry_error', 'Symmetry Error', 'Standard error for symmetry'],
      ['fractal_dimension_error', 'Fractal Dim. Error', 'Standard error for fractal dimension'],
    ],
  },
  {
    label: '3. "Worst" Measurements (Largest or Most Extreme Values)',
    fields: [
      ['worst_radius', 'Worst Radius', 'Largest mean value for distances from center'],
      ['worst_texture', 'Worst Texture', 'Largest standard deviation of gray-scale values'],
      ['worst_perimeter', 'Worst Perimeter', 'Largest perimeter value'],
      ['worst_area', 'Worst Area', 'Largest area value'],
      ['worst_smoothness', 'Worst Smoothness', 'Largest local variation in radius lengths'],
      ['worst_compactness', 'Worst Compactness', 'Largest compactness value'],
      ['worst_concavity', 'Worst Concavity', 'Largest severity of concave portions'],
      ['worst_concave_points', 'Worst Concave Points', 'Largest number of concave portions'],
      ['worst_symmetry', 'Worst Symmetry', 'Largest symmetry value'],
      ['worst_fractal_dimension', 'Worst Fractal Dim.', 'Largest fractal dimension value'],
    ],
  },
];

export default function BreastCancerForm({ onResult, onLoading }) {
  const [form, setForm] = useState(DEFAULTS);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

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
    Object.keys(form).forEach((k) => {
      const val = Number(form[k]);
      if (isNaN(val) || val < 0) {
        e[k] = 'Value must be ≥ 0';
      }
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (submitting || !validate()) return;
    setSubmitting(true);
    onLoading(true);
    try {
      const payload = {};
      Object.keys(form).forEach((k) => {
        payload[k] = Number(form[k]);
      });
      const result = await predictBreastCancer(payload);
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
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-full">
      {/* Sample preset buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-purple-50/60 border border-purple-100 rounded-xl">
        <span className="text-xs font-semibold text-purple-900 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" />
          <span>Test Sample Profiles (Wisconsin WDBC):</span>
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => applyPreset('lowerRisk')}
            className="text-xs font-medium px-2.5 py-1.5 bg-white text-slate-700 hover:text-purple-700 border border-slate-200 rounded-lg hover:border-purple-300 transition-colors cursor-pointer"
          >
            Load Benign Sample
          </button>
          <button
            type="button"
            onClick={() => applyPreset('higherRisk')}
            className="text-xs font-medium px-2.5 py-1.5 bg-white text-slate-700 hover:text-red-700 border border-slate-200 rounded-lg hover:border-red-300 transition-colors cursor-pointer"
          >
            Load Malignant Sample
          </button>
        </div>
      </div>

      {GROUPS.map((group) => (
        <div key={group.label} className="bg-slate-50/70 p-4 sm:p-5 rounded-xl border border-slate-200/80">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3.5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-600"></span>
            {group.label}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
            {group.fields.map(([key, label, tip]) => (
              <FormField key={key} label={label} tooltip={tip} error={errors[key]} required>
                <input
                  type="number"
                  step="any"
                  value={form[key]}
                  onChange={(e) => set(key, e.target.value)}
                  className="field-input text-xs sm:text-sm"
                  min="0"
                />
              </FormField>
            ))}
          </div>
        </div>
      ))}

      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <button type="submit" disabled={submitting} className="w-full sm:flex-1 btn-primary py-3 bg-purple-600 hover:bg-purple-700 cursor-pointer disabled:cursor-not-allowed disabled:opacity-70">
          Predict Breast Cancer Risk
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
