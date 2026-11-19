import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Stethoscope,
  Clock,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

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
            cx="54"
            cy="54"
            r={radius}
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
      <span className="text-xs text-slate-500 font-medium">Estimated risk score</span>
    </div>
  );
}

const RISK_CONFIG = {
  'Lower Risk': {
    color: '#16a34a',
    bg: 'bg-green-50/70',
    border: 'border-green-200',
    text: 'text-green-800',
    badge: 'bg-green-100 text-green-800 border-green-200',
    icon: <CheckCircle2 className="w-5 h-5 text-green-600" />,
  },
  'Moderate Risk': {
    color: '#d97706',
    bg: 'bg-amber-50/70',
    border: 'border-amber-200',
    text: 'text-amber-800',
    badge: 'bg-amber-100 text-amber-800 border-amber-200',
    icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
  },
  'Higher Risk': {
    color: '#dc2626',
    bg: 'bg-red-50/70',
    border: 'border-red-200',
    text: 'text-red-800',
    badge: 'bg-red-100 text-red-800 border-red-200',
    icon: <XCircle className="w-5 h-5 text-red-600" />,
  },
};

export function PredictionCard({ result }) {
  const { isAuthenticated } = useAuth();
  if (!result) return null;

  const cfg = RISK_CONFIG[result.risk_category] || RISK_CONFIG['Moderate Risk'];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      aria-label="Prediction result"
      className={`card border-2 ${cfg.border} ${cfg.bg} p-6 md:p-8 shadow-sm`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200/60">
        <div className="flex items-center gap-2.5">
          {cfg.icon}
          <h2 className="text-lg font-bold text-slate-900">
            {result.disease} — Risk Classification
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-white text-slate-700 border border-slate-200 shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>Recorded to History</span>
          </span>
          <Link
            to="/dashboard"
            className="text-xs font-bold text-blue-700 hover:text-blue-900 inline-flex items-center gap-1"
          >
            <span>View Dashboard</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
        <RiskGauge probability={result.probability} />

        <div className="flex-1 w-full space-y-4">
          {/* Risk category badge */}
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1.5">
              Risk Category
            </p>
            <span
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-bold border ${cfg.badge}`}
            >
              {cfg.icon}
              {result.risk_category}
            </span>
          </div>

          {/* Stat grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="card p-3.5 shadow-none bg-white/80 border-slate-200">
              <p className="text-xs text-slate-400 mb-1">Estimated Probability</p>
              <p className="text-xl font-black text-slate-900">
                {Math.round(result.probability * 100)}%
              </p>
            </div>
            <div className="card p-3.5 shadow-none bg-white/80 border-slate-200">
              <p className="text-xs text-slate-400 mb-1">Inference Engine</p>
              <p className="text-sm font-bold text-slate-800 leading-tight">{result.model}</p>
            </div>
          </div>

          {/* Risk interpretation */}
          <div className="bg-white/90 rounded-xl p-4 border border-slate-200/70 text-xs text-slate-600 leading-relaxed space-y-1.5">
            {result.risk_category === 'Lower Risk' && (
              <p>
                <strong>Lower Risk Classification:</strong> The patient's telemetry values closely match pattern clusters in the training cohort with low incidence of the pathology. This is a probabilistic baseline and does <em>not</em> rule out sub-clinical disease.
              </p>
            )}
            {result.risk_category === 'Moderate Risk' && (
              <p>
                <strong>Moderate Risk Classification:</strong> Borderline or elevated markers were detected across multiple physiological attributes. Confirmatory clinical diagnostic testing is recommended.
              </p>
            )}
            {result.risk_category === 'Higher Risk' && (
              <p>
                <strong>Higher Risk Classification:</strong> Significant multi-dimensional alignment with high-risk pathology patterns in the benchmark dataset. Immediate secondary clinical diagnostic review is advised.
              </p>
            )}
          </div>

          {/* Clinical governance note */}
          <div className="flex gap-2.5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <Stethoscope className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-[0.72rem] text-slate-700 leading-relaxed">
              <strong>Clinical Decision Support Indicator:</strong> Outputs represent probabilistic statistical risk scores derived from validated diagnostic classification pipelines. Intended for supplementary clinical evaluation; final clinical diagnosis requires comprehensive physician examination.
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
