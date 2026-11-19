import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getMetrics } from '../services/api';
import {
  Heart,
  Activity,
  Dna,
  Trophy,
  Loader2,
  AlertCircle,
  HelpCircle,
  BarChart3,
  CheckCircle2,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const DISEASE_OPTIONS = [
  { key: 'heart', label: 'Heart Disease', icon: <Heart className="w-4 h-4 text-red-600" /> },
  { key: 'diabetes', label: 'Diabetes', icon: <Activity className="w-4 h-4 text-sky-600" /> },
  { key: 'breast_cancer', label: 'Breast Cancer', icon: <Dna className="w-4 h-4 text-purple-600" /> },
];

const MODEL_COLORS = {
  'Logistic Regression': '#2563EB',
  SVM: '#0EA5E9',
  'Random Forest': '#10B981',
  XGBoost: '#F59E0B',
};

function ConfusionMatrix({ cm, modelName }) {
  if (!cm) return null;
  const { tn, fp, fn, tp } = cm;
  const total = tn + fp + fn + tp;

  const cells = [
    {
      label: 'True Negative (TN)',
      value: tn,
      desc: 'Correctly classified as negative (no disease)',
      style: 'bg-emerald-50 text-emerald-900 border-emerald-200',
      badge: 'bg-emerald-100 text-emerald-800',
    },
    {
      label: 'False Positive (FP)',
      value: fp,
      desc: 'Type I Error: Predicted positive, actual negative',
      style: 'bg-rose-50 text-rose-900 border-rose-200',
      badge: 'bg-rose-100 text-rose-800',
    },
    {
      label: 'False Negative (FN)',
      value: fn,
      desc: 'Type II Error: Missed positive, actual disease',
      style: 'bg-amber-50 text-amber-900 border-amber-200',
      badge: 'bg-amber-100 text-amber-800',
    },
    {
      label: 'True Positive (TP)',
      value: tp,
      desc: 'Correctly classified as positive (disease present)',
      style: 'bg-blue-50 text-blue-900 border-blue-200',
      badge: 'bg-blue-100 text-blue-800',
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Confusion Matrix — {modelName}</h3>
          <p className="text-xs text-slate-500 mt-0.5">Evaluated on independent 20% stratified holdout set (N = {total})</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {cells.map((c) => (
          <div key={c.label} className={`border rounded-xl p-4 ${c.style}`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[0.65rem] font-bold px-2 py-0.5 rounded-full ${c.badge}`}>{c.label}</span>
              <span className="text-xs font-semibold opacity-75">{((c.value / total) * 100).toFixed(1)}%</span>
            </div>
            <div className="text-3xl font-black mb-1">{c.value}</div>
            <div className="text-xs opacity-80 leading-relaxed">{c.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeatureImportanceChart({ importances, modelName }) {
  if (!importances || importances.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-400">
        <HelpCircle className="w-8 h-8 mb-2 stroke-1" />
        <p className="text-sm font-semibold">Feature importance not directly available</p>
        <p className="text-xs text-slate-500 mt-1 max-w-xs">
          RBF Kernel SVM models project into infinite-dimensional Hilbert spaces. See About page for details.
        </p>
      </div>
    );
  }

  const topFeatures = importances.slice(0, 8);

  return (
    <div>
      <div className="mb-4">
        <h3 className="text-sm font-bold text-slate-900">Why did the model make this prediction?</h3>
        <p className="text-xs text-slate-500 mt-0.5">Top contributing features ranked by relative importance percentage</p>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={topFeatures} layout="vertical" margin={{ left: 20, right: 16, top: 4, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
            <XAxis type="number" tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11, fill: '#64748b' }} domain={[0, 'dataMax + 2']} />
            <YAxis type="category" dataKey="feature" width={120} tick={{ fontSize: 11, fill: '#334155' }} />
            <Tooltip
              formatter={(v) => [`${v}%`, 'Contribution']}
              contentStyle={{ backgroundColor: '#1e293b', color: '#fff', borderRadius: '0.5rem', border: 'none', fontSize: '0.75rem' }}
            />
            <Bar dataKey="importance" fill="#2563EB" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-[0.7rem] text-slate-400 mt-2">
        Normalized Gini importance / relative weight from the selected tree ensemble pipeline.
      </p>
    </div>
  );
}

function MetricsTable({ models, bestModel }) {
  const modelNames = Object.keys(models);
  const metrics = ['accuracy', 'precision', 'recall', 'f1_score', 'roc_auc'];
  const labels = {
    accuracy: 'Accuracy',
    precision: 'Precision',
    recall: 'Recall',
    f1_score: 'F1-Score',
    roc_auc: 'ROC-AUC',
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="min-w-full text-xs text-left" role="table">
        <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
          <tr>
            <th className="px-4 py-3">Algorithm</th>
            {metrics.map((m) => (
              <th key={m} className="px-3 py-3 text-center">
                {labels[m]}
              </th>
            ))}
            <th className="px-3 py-3 text-center">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {modelNames.map((name) => {
            const d = models[name];
            const isBest = name === bestModel;
            return (
              <tr key={name} className={isBest ? 'bg-blue-50/70 font-semibold' : 'hover:bg-slate-50/50'}>
                <td className="px-4 py-3 text-slate-900 flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: MODEL_COLORS[name] || '#94a3b8' }}
                  />
                  <span>{name}</span>
                </td>
                {metrics.map((m) => (
                  <td key={m} className="px-3 py-3 text-center font-mono">
                    <span className={isBest ? 'text-blue-700 font-bold' : 'text-slate-700'}>
                      {(d[m] * 100).toFixed(2)}%
                    </span>
                  </td>
                ))}
                <td className="px-3 py-3 text-center">
                  {isBest ? (
                    <span className="inline-flex items-center gap-1 text-[0.65rem] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                      <Trophy className="w-3 h-3 text-amber-500" />
                      Selected Best
                    </span>
                  ) : (
                    <span className="text-[0.65rem] text-slate-400">Benchmark</span>
                  )}
                </td>
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
  const data = ['accuracy', 'precision', 'recall', 'f1_score', 'roc_auc'].map((metric) => ({
    metric:
      metric === 'f1_score'
        ? 'F1-Score'
        : metric === 'roc_auc'
        ? 'ROC-AUC'
        : metric.charAt(0).toUpperCase() + metric.slice(1),
    ...Object.fromEntries(
      modelNames.map((name) => [name, +(models[name][metric] * 100).toFixed(2)])
    ),
  }));

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 12, right: 16, left: -10, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="metric" tick={{ fontSize: 11, fill: '#64748b' }} />
          <YAxis domain={[0, 105]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11, fill: '#64748b' }} />
          <Tooltip
            formatter={(v) => `${v}%`}
            contentStyle={{ backgroundColor: '#1e293b', color: '#fff', borderRadius: '0.5rem', border: 'none', fontSize: '0.75rem' }}
          />
          <Legend wrapperStyle={{ fontSize: '0.75rem', paddingTop: '10px' }} />
          {modelNames.map((name) => (
            <Bar
              key={name}
              dataKey={name}
              fill={MODEL_COLORS[name] || '#94a3b8'}
              radius={[3, 3, 0, 0]}
              maxBarSize={32}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function Performance() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDisease, setSelectedDisease] = useState('heart');

  useEffect(() => {
    getMetrics()
      .then((data) => {
        setMetrics(data);
        setError(null);
      })
      .catch((e) => {
        setError(
          e?.response?.data?.detail ||
            e?.message ||
            'Failed to load model metrics. Please verify the backend service is running.'
        );
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-28 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-sm font-semibold text-slate-700">Loading model telemetry and evaluation metrics...</p>
        <p className="text-xs text-slate-400">Querying verified test holdout results</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="card p-8 border-red-200 bg-red-50/60 text-red-900">
          <AlertCircle className="w-10 h-10 text-red-600 mx-auto mb-3" />
          <h2 className="text-base font-bold mb-1">Metrics Unavailable</h2>
          <p className="text-xs text-red-800 leading-relaxed mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary py-2 px-4 text-xs"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  const disease = metrics?.[selectedDisease];
  if (!disease) return null;
  const bestMetrics = disease.best_model_metrics;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-14">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        {/* Header */}
        <div className="mb-8">
          <p className="section-label mb-1">Empirical Validation</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Model Performance Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1.5 max-w-3xl">
            Live evaluation metrics derived directly from scikit-learn holdout testing. All 4 algorithms
            were benchmarked using identical preprocessing pipelines without test data leakage.
          </p>
        </div>

        {/* Disease Selector Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap" role="tablist">
          {DISEASE_OPTIONS.map((d) => (
            <button
              key={d.key}
              role="tab"
              aria-selected={selectedDisease === d.key}
              onClick={() => setSelectedDisease(d.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                selectedDisease === d.key
                  ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              {d.icon}
              <span>{d.label}</span>
            </button>
          ))}
        </div>

        {/* Stat Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-8">
          {[
            { label: 'Selected Algorithm', value: disease.best_model, isText: true },
            { label: 'Holdout Accuracy', value: `${(bestMetrics.accuracy * 100).toFixed(2)}%` },
            { label: 'Precision', value: `${(bestMetrics.precision * 100).toFixed(2)}%` },
            { label: 'Recall (Sensitivity)', value: `${(bestMetrics.recall * 100).toFixed(2)}%` },
            { label: 'F1-Score', value: `${(bestMetrics.f1_score * 100).toFixed(2)}%` },
            { label: 'ROC-AUC', value: `${(bestMetrics.roc_auc * 100).toFixed(2)}%` },
          ].map((stat) => (
            <div key={stat.label} className="card p-4 text-center">
              <p className="text-[0.65rem] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                {stat.label}
              </p>
              <p
                className={`font-black tracking-tight ${
                  stat.isText ? 'text-xs text-blue-700 leading-tight mt-1' : 'text-lg text-slate-900'
                }`}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Benchmark Chart Card */}
        <div className="card p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Algorithm Comparison — {disease.disease_name}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Comparing accuracy, precision, recall, F1-Score, and ROC-AUC across four models
              </p>
            </div>
          </div>
          <ComparisonChart models={disease.models} />
        </div>

        {/* Metrics Table Card */}
        <div className="card p-6 sm:p-8 mb-8">
          <h2 className="text-base font-bold text-slate-900 mb-1">Standardized Metrics Table</h2>
          <p className="text-xs text-slate-500 mb-4">
            Selection criterion: {disease.selection_criterion}
          </p>
          <MetricsTable models={disease.models} bestModel={disease.best_model} />
        </div>

        {/* Confusion Matrix + Feature Importance Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="card p-6 sm:p-8">
            <ConfusionMatrix cm={bestMetrics.confusion_matrix} modelName={disease.best_model} />
          </div>

          <div className="card p-6 sm:p-8">
            <FeatureImportanceChart
              importances={disease.all_feature_importances}
              modelName={disease.best_model}
            />
          </div>
        </div>

        {/* Dataset metadata footer */}
        <div className="card p-4 bg-slate-50 border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            <strong>Dataset:</strong> {disease.disease_name} ({disease.train_sample_size} train / {disease.test_sample_size} test split)
          </span>
          <span className="flex items-center gap-1.5 text-blue-700 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
            Verified Empirical Evaluation
          </span>
        </div>
      </motion.div>
    </div>
  );
}
