import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getMetrics } from '../services/api';
import { Heart, Activity, Dna, Trophy, Loader2, AlertCircle } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis
} from 'recharts';

const DISEASE_OPTIONS = [
  { key: 'heart', label: 'Heart Disease', icon: <Heart className="w-4 h-4" /> },
  { key: 'diabetes', label: 'Diabetes', icon: <Activity className="w-4 h-4" /> },
  { key: 'breast_cancer', label: 'Breast Cancer', icon: <Dna className="w-4 h-4" /> },
];

const MODEL_COLORS = {
  'Logistic Regression': '#2563EB',
  'SVM': '#0EA5E9',
  'Random Forest': '#10B981',
  'XGBoost': '#F59E0B',
};

function ConfusionMatrix({ cm, modelName }) {
  const { tn, fp, fn, tp } = cm;
  const total = tn + fp + fn + tp;
  const cells = [
    { label: 'True Negative', value: tn, desc: 'Correctly predicted no disease', color: 'bg-green-100 text-green-800 border-green-200' },
    { label: 'False Positive', value: fp, desc: 'Predicted disease, actually healthy', color: 'bg-red-100 text-red-800 border-red-200' },
    { label: 'False Negative', value: fn, desc: 'Missed disease, actually ill', color: 'bg-orange-100 text-orange-800 border-orange-200' },
    { label: 'True Positive', value: tp, desc: 'Correctly predicted disease', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  ];
  return (
    <div>
      <h3 className="text-base font-semibold text-slate-700 mb-4">Confusion Matrix — {modelName}</h3>
      <div className="grid grid-cols-2 gap-3">
        {cells.map(c => (
          <div key={c.label} className={`border-2 rounded-xl p-4 ${c.color}`}>
            <div className="text-2xl font-black mb-1">{c.value}</div>
            <div className="text-sm font-semibold">{c.label}</div>
            <div className="text-xs opacity-70 mt-0.5">{c.desc}</div>
            <div className="text-xs opacity-60 mt-1">({((c.value / total) * 100).toFixed(1)}% of test set)</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeatureImportanceChart({ importances }) {
  if (!importances || importances.length === 0) return (
    <p className="text-sm text-slate-400 italic">Feature importance not available for this model.</p>
  );
  const top8 = importances.slice(0, 8);
  return (
    <div>
      <h3 className="text-base font-semibold text-slate-700 mb-4">Top Feature Importances</h3>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={top8} layout="vertical" margin={{ left: 24, right: 16, top: 4, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" tickFormatter={v => `${v}%`} />
          <YAxis type="category" dataKey="feature" width={140} tick={{ fontSize: 11 }} />
          <Tooltip formatter={v => [`${v}%`, 'Importance']} />
          <Bar dataKey="importance" fill="#2563EB" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <p className="text-xs text-slate-400 mt-2">Importance shown as % of total feature contribution (from best model).</p>
    </div>
  );
}

function MetricsTable({ models, bestModel }) {
  const modelNames = Object.keys(models);
  const metrics = ['accuracy', 'precision', 'recall', 'f1_score', 'roc_auc'];
  const labels = { accuracy: 'Accuracy', precision: 'Precision', recall: 'Recall', f1_score: 'F1 Score', roc_auc: 'ROC-AUC' };

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-slate-50">
            <th className="text-left px-4 py-3 font-semibold text-slate-600 border-b border-slate-200">Model</th>
            {metrics.map(m => (
              <th key={m} className="text-center px-4 py-3 font-semibold text-slate-600 border-b border-slate-200">{labels[m]}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {modelNames.map(name => {
            const d = models[name];
            const isBest = name === bestModel;
            return (
              <tr key={name} className={isBest ? 'bg-blue-50' : 'hover:bg-slate-50'}>
                <td className="px-4 py-3 font-medium text-slate-800 border-b border-slate-100">
                  <span className="flex items-center gap-2">
                    {isBest && <Trophy className="w-4 h-4 text-yellow-500" />}
                    {name}
                  </span>
                </td>
                {metrics.map(m => (
                  <td key={m} className="px-4 py-3 text-center font-mono border-b border-slate-100">
                    <span className={isBest ? 'font-bold text-blue-700' : 'text-slate-700'}>
                      {(d[m] * 100).toFixed(2)}%
                    </span>
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function ComparisonChart({ models }) {
  const modelNames = Object.keys(models);
  const data = ['accuracy', 'precision', 'recall', 'f1_score', 'roc_auc'].map(metric => ({
    metric: metric === 'f1_score' ? 'F1' : metric === 'roc_auc' ? 'AUC' : metric.charAt(0).toUpperCase() + metric.slice(1),
    ...Object.fromEntries(modelNames.map(name => [name, +(models[name][metric] * 100).toFixed(2)]))
  }));

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data} margin={{ top: 8, right: 24, left: 0, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="metric" />
        <YAxis domain={[0, 105]} tickFormatter={v => `${v}%`} />
        <Tooltip formatter={v => `${v}%`} />
        <Legend />
        {modelNames.map(name => (
          <Bar key={name} dataKey={name} fill={MODEL_COLORS[name] || '#94a3b8'} radius={[3, 3, 0, 0]} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

export default function Performance() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDisease, setSelectedDisease] = useState('heart');

  useEffect(() => {
    getMetrics()
      .then(setMetrics)
      .catch(e => setError(e?.response?.data?.detail || 'Failed to load metrics. Is the backend running?'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-32 gap-4">
      <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      <p className="text-slate-500">Loading model performance data...</p>
    </div>
  );

  if (error) return (
    <div className="max-w-xl mx-auto mt-20 text-center px-4">
      <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
      <h2 className="text-xl font-bold text-slate-800 mb-2">Could not load metrics</h2>
      <p className="text-slate-500">{error}</p>
    </div>
  );

  const disease = metrics[selectedDisease];
  const bestMetrics = disease.best_model_metrics;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Model Performance Dashboard</h1>
        <p className="text-slate-500 mb-8">Real metrics from training 4 ML algorithms on each disease dataset.</p>

        {/* Disease Tabs */}
        <div className="flex gap-2 mb-10 flex-wrap">
          {DISEASE_OPTIONS.map(d => (
            <button
              key={d.key}
              onClick={() => setSelectedDisease(d.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                selectedDisease === d.key
                  ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'
              }`}
            >
              {d.icon} {d.label}
            </button>
          ))}
        </div>

        {/* Best model summary */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-10">
          {[
            { label: 'Best Model', value: disease.best_model, isText: true },
            { label: 'Accuracy', value: `${(bestMetrics.accuracy * 100).toFixed(2)}%` },
            { label: 'Precision', value: `${(bestMetrics.precision * 100).toFixed(2)}%` },
            { label: 'Recall', value: `${(bestMetrics.recall * 100).toFixed(2)}%` },
            { label: 'F1 Score', value: `${(bestMetrics.f1_score * 100).toFixed(2)}%` },
            { label: 'ROC-AUC', value: `${(bestMetrics.roc_auc * 100).toFixed(2)}%` },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm text-center">
              <p className="text-xs text-slate-400 mb-1">{stat.label}</p>
              <p className={`font-bold ${stat.isText ? 'text-sm text-blue-700' : 'text-xl text-slate-900'}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Comparison Chart */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-8">
          <h2 className="text-base font-semibold text-slate-700 mb-6">Algorithm Comparison — {disease.disease_name}</h2>
          <ComparisonChart models={disease.models} />
        </div>

        {/* Metrics Table */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-8">
          <h2 className="text-base font-semibold text-slate-700 mb-4">Detailed Metrics Table</h2>
          <MetricsTable models={disease.models} bestModel={disease.best_model} />
        </div>

        {/* Confusion Matrix + Feature Importance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <ConfusionMatrix cm={bestMetrics.confusion_matrix} modelName={disease.best_model} />
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <FeatureImportanceChart importances={disease.all_feature_importances} />
          </div>
        </div>

        <div className="mt-8 text-xs text-slate-400 bg-slate-50 rounded-xl p-4 border border-slate-200">
          <strong>Dataset info:</strong> {disease.disease_name} — {disease.train_sample_size} training samples, {disease.test_sample_size} test samples.
          Best model selected by composite score: 70% F1-Score + 30% ROC-AUC.
        </div>
      </motion.div>
    </div>
  );
}
