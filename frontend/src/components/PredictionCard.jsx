import { motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, XCircle, Stethoscope } from 'lucide-react';

function RiskGauge({ probability }) {
  const pct = Math.round(probability * 100);
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const color =
    pct <= 30 ? '#16a34a' : pct <= 60 ? '#d97706' : '#dc2626';

  return (
    <div className="flex flex-col items-center gap-2 flex-shrink-0">
      <div className="relative w-32 h-32">
        <svg viewBox="0 0 108 108" className="w-full h-full -rotate-90" aria-hidden="true">
          <circle cx="54" cy="54" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="10" />
          <motion.circle
            cx="54" cy="54" r={radius}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference * (1 - pct / 100) }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-2xl font-black"
            style={{ color }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
          >
            {pct}%
          </motion.span>
          <span className="text-[0.65rem] text-slate-400 font-medium mt-0.5">probability</span>
        </div>
      </div>
      <span className="text-xs text-slate-500">Estimated risk score</span>
    </div>
  );
}

const RISK_CONFIG = {
  'Lower Risk': {
    color: '#16a34a',
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-800',
    badge: 'bg-green-100 text-green-800',
    icon: <CheckCircle2 className="w-5 h-5 text-green-600" />,
  },
  'Moderate Risk': {
    color: '#d97706',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-800',
    badge: 'bg-amber-100 text-amber-800',
    icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
  },
  'Higher Risk': {
    color: '#dc2626',
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-800',
    badge: 'bg-red-100 text-red-800',
    icon: <XCircle className="w-5 h-5 text-red-600" />,
  },
};

export function PredictionCard({ result }) {
  if (!result) return null;

  const cfg = RISK_CONFIG[result.risk_category] || RISK_CONFIG['Moderate Risk'];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      aria-label="Prediction result"
      className={`card border-2 ${cfg.border} ${cfg.bg} p-6 md:p-8`}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        {cfg.icon}
        <h2 className="text-lg font-bold text-slate-900">{result.disease} — Prediction Result</h2>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
        <RiskGauge probability={result.probability} />

        <div className="flex-1 w-full space-y-5">
          {/* Risk category badge */}
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1.5">Risk Category</p>
            <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-bold ${cfg.badge}`}>
              {cfg.icon}
              {result.risk_category}
            </span>
          </div>

          {/* Stat grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="card p-3.5 shadow-none">
              <p className="text-xs text-slate-400 mb-1">Estimated Probability</p>
              <p className="text-xl font-black text-slate-900">{Math.round(result.probability * 100)}%</p>
            </div>
            <div className="card p-3.5 shadow-none">
              <p className="text-xs text-slate-400 mb-1">Model Used</p>
              <p className="text-sm font-bold text-slate-800 leading-tight">{result.model}</p>
            </div>
          </div>

          {/* Risk interpretation */}
          <div className="bg-white/70 rounded-xl p-4 border border-slate-100 text-sm text-slate-600 leading-relaxed">
            {result.risk_category === 'Lower Risk' && (
              <p><strong>Lower risk</strong> indicates that this combination of inputs is associated with lower probability of the condition in the training dataset. This does <em>not</em> confirm the absence of disease.</p>
            )}
            {result.risk_category === 'Moderate Risk' && (
              <p><strong>Moderate risk</strong> indicates borderline values in one or more features. Clinical evaluation is advisable.</p>
            )}
            {result.risk_category === 'Higher Risk' && (
              <p><strong>Higher risk</strong> indicates that multiple features align with patterns associated with this condition in the training dataset. This is not a diagnosis.</p>
            )}
          </div>

          {/* Disclaimer */}
          <div className="flex gap-2.5 p-3.5 bg-amber-50 border border-amber-200 rounded-xl">
            <Stethoscope className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 leading-relaxed">
              <strong>Not a medical diagnosis.</strong> This is an experimental ML output for educational purposes only.
              Consult a qualified healthcare professional for any health concerns.
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
