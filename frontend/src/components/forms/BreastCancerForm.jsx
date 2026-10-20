import { useState } from 'react';
import { predictBreastCancer } from '../../services/api';
import FormField from '../FormField';

const DEFAULTS = {
  mean_radius: 14.13, mean_texture: 20.38, mean_perimeter: 91.97,
  mean_area: 654.9, mean_smoothness: 0.10, mean_compactness: 0.104,
  mean_concavity: 0.089, mean_concave_points: 0.049, mean_symmetry: 0.181,
  mean_fractal_dimension: 0.063, radius_error: 0.406, texture_error: 1.218,
  perimeter_error: 2.893, area_error: 40.34, smoothness_error: 0.007,
  compactness_error: 0.026, concavity_error: 0.026, concave_points_error: 0.013,
  symmetry_error: 0.019, fractal_dimension_error: 0.003, worst_radius: 16.21,
  worst_texture: 29.57, worst_perimeter: 107.3, worst_area: 826.4,
  worst_smoothness: 0.146, worst_compactness: 0.256, worst_concavity: 0.258,
  worst_concave_points: 0.127, worst_symmetry: 0.298, worst_fractal_dimension: 0.089
};

const GROUPS = [
  {
    label: 'Mean Features (average value for cell nuclei)',
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
      ['mean_fractal_dimension', 'Mean Fractal Dimension', '"Coastline approximation" − 1'],
    ]
  },
  {
    label: 'Error Features (standard error of cell nuclei)',
    fields: [
      ['radius_error', 'Radius Error', 'Standard error for the mean of distances from center'],
      ['texture_error', 'Texture Error', 'Standard error for standard deviation of gray-scale values'],
      ['perimeter_error', 'Perimeter Error', 'Standard error for perimeter'],
      ['area_error', 'Area Error', 'Standard error for area'],
      ['smoothness_error', 'Smoothness Error', 'Standard error for local variation in radius lengths'],
      ['compactness_error', 'Compactness Error', 'Standard error for compactness'],
      ['concavity_error', 'Concavity Error', 'Standard error for severity of concave portions'],
      ['concave_points_error', 'Concave Points Error', 'Standard error for number of concave portions'],
      ['symmetry_error', 'Symmetry Error', 'Standard error for symmetry'],
      ['fractal_dimension_error', 'Fractal Dimension Error', 'Standard error for fractal dimension'],
    ]
  },
  {
    label: 'Worst Features (largest value for cell nuclei)',
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
      ['worst_fractal_dimension', 'Worst Fractal Dimension', 'Largest fractal dimension value'],
    ]
  }
];

export default function BreastCancerForm({ onResult, onLoading }) {
  const [form, setForm] = useState(DEFAULTS);
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    Object.keys(form).forEach(k => {
      if (Number(form[k]) < 0) e[k] = 'Value must be ≥ 0';
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    onLoading(true);
    try {
      const payload = {};
      Object.keys(form).forEach(k => { payload[k] = Number(form[k]); });
      const result = await predictBreastCancer(payload);
      onResult(result);
    } catch (err) {
      onResult({ error: err?.response?.data?.detail || 'Prediction failed. Please try again.' });
    } finally {
      onLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {GROUPS.map(group => (
        <div key={group.label}>
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">{group.label}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {group.fields.map(([key, label, tip]) => (
              <FormField key={key} label={label} tooltip={tip} error={errors[key]}>
                <input
                  type="number"
                  step="any"
                  value={form[key]}
                  onChange={e => set(key, e.target.value)}
                  className="form-input"
                  min="0"
                />
              </FormField>
            ))}
          </div>
        </div>
      ))}

      <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3.5 rounded-xl transition-colors shadow-md">
        Predict Breast Cancer Risk
      </button>
    </form>
  );
}
