import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export function RiskGauge({ probability }) {
  const pct = Math.round(probability * 100);
  const color = pct <= 30 ? '#22c55e' : pct <= 60 ? '#f59e0b' : '#ef4444';

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-36 h-36">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          <circle cx="60" cy="60" r="50" fill="none" stroke="#e2e8f0" strokeWidth="12" />
          <motion.circle
            cx="60" cy="60" r="50"
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 50}`}
            initial={{ strokeDashoffset: 2 * Math.PI * 50 }}
            animate={{ strokeDashoffset: 2 * Math.PI * 50 * (1 - pct / 100) }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-3xl font-extrabold"
            style={{ color }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {pct}%
          </motion.span>
          <span className="text-xs text-slate-400">Risk</span>
        </div>
      </div>
    </div>
  );
}

export function PredictionCard({ result }) {
  if (!result) return null;

  const isHighRisk = result.prediction === 1;
  const riskColor =
    result.risk_category === 'Lower Risk' ? 'green' :
    result.risk_category === 'Moderate Risk' ? 'amber' : 'red';

  const colorMap = {
    green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', icon: <CheckCircle className="w-6 h-6 text-green-500" /> },
    amber: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', icon: <AlertTriangle className="w-6 h-6 text-amber-500" /> },
    red: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', icon: <XCircle className="w-6 h-6 text-red-500" /> },
  };
  const c = colorMap[riskColor];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className={`rounded-2xl border-2 ${c.border} ${c.bg} p-8 shadow-md`}
    >
      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Gauge */}
        <div className="flex-shrink-0">
          <RiskGauge probability={result.probability} />
        </div>

        {/* Details */}
        <div className="flex-1 w-full">
          <div className="flex items-center gap-2 mb-4">
            {c.icon}
            <h3 className="text-xl font-bold text-slate-900">{result.disease} Prediction</h3>
          </div>

          <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold ${c.bg} ${c.text} border ${c.border} mb-6`}>
            {result.risk_category}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
              <p className="text-xs text-slate-500 mb-1">Probability</p>
              <p className="text-2xl font-bold text-slate-900">{Math.round(result.probability * 100)}%</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
              <p className="text-xs text-slate-500 mb-1">Model Used</p>
              <p className="text-sm font-bold text-slate-900">{result.model}</p>
            </div>
          </div>

          <div className="text-xs text-slate-500 bg-white/70 rounded-lg p-3 border border-slate-100">
            <strong>⚠️ Disclaimer:</strong> {result.disclaimer}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
