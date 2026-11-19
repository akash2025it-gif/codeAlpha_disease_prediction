import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Activity, Dna, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import HeartForm from '../components/forms/HeartForm';
import DiabetesForm from '../components/forms/DiabetesForm';
import BreastCancerForm from '../components/forms/BreastCancerForm';
import { PredictionCard } from '../components/PredictionCard';

const DISEASES = [
  {
    key: 'heart',
    label: 'Heart Disease',
    subtitle: 'Cardiovascular Risk (13 features)',
    icon: <Heart className="w-5 h-5 text-red-600" />,
    activeClass: 'border-red-500 bg-red-50/50 text-red-950 ring-2 ring-red-500/20',
  },
  {
    key: 'diabetes',
    label: 'Diabetes',
    subtitle: 'Glycemic Risk (8 features)',
    icon: <Activity className="w-5 h-5 text-sky-600" />,
    activeClass: 'border-sky-500 bg-sky-50/50 text-sky-950 ring-2 ring-sky-500/20',
  },
  {
    key: 'breast_cancer',
    label: 'Breast Cancer',
    subtitle: 'FNA Cytology (30 features)',
    icon: <Dna className="w-5 h-5 text-purple-600" />,
    activeClass: 'border-purple-500 bg-purple-50/50 text-purple-950 ring-2 ring-purple-500/20',
  },
];

export default function Predict() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initial = searchParams.get('disease') || 'heart';
  const [selected, setSelected] = useState(
    ['heart', 'diabetes', 'breast_cancer'].includes(initial) ? initial : 'heart'
  );
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setResult(null);
  }, [selected]);

  const handleSelect = (key) => {
    setSelected(key);
    setSearchParams({ disease: key });
  };

  const handleResult = (r) => {
    setResult(r);
    if (!r.error) {
      setTimeout(() => {
        document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 200);
    }
  };

  const FormComponent =
    selected === 'heart' ? HeartForm : selected === 'diabetes' ? DiabetesForm : BreastCancerForm;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 md:py-14 w-full overflow-x-hidden">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        {/* Page Title */}
        <div className="mb-8">
          <p className="section-label mb-1">Clinical Evaluation</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Disease Risk Prediction
          </h1>
          <p className="text-sm text-slate-500 mt-1.5 max-w-2xl">
            Select a clinical condition below, verify patient telemetry in the structured input form,
            and run machine-learning inference via the active model pipeline.
          </p>
        </div>

        {/* Disease Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8" role="tablist" aria-label="Select Disease">
          {DISEASES.map((d) => {
            const isSelected = selected === d.key;
            return (
              <button
                key={d.key}
                role="tab"
                aria-selected={isSelected}
                onClick={() => handleSelect(d.key)}
                className={`flex items-center gap-3.5 p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? d.activeClass
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700 shadow-xs'
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-white border border-slate-200/80 flex items-center justify-center flex-shrink-0 shadow-2xs">
                  {d.icon}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 leading-tight">{d.label}</p>
                  <p className="text-[0.7rem] text-slate-500 mt-0.5">{d.subtitle}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Form Container Card */}
        <div className="card p-5 sm:p-8 mb-8 w-full max-w-full overflow-hidden">
          <div className="border-b border-slate-100 pb-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {selected === 'heart'
                  ? 'Heart Disease Clinical Predictor (Cleveland UCI)'
                  : selected === 'diabetes'
                  ? 'Diabetes Diagnostic Predictor (Pima Indians)'
                  : 'Breast Cancer Cytology Predictor (Wisconsin WDBC)'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                All features must correspond to verified medical tests. Outliers are handled via median imputation.
              </p>
            </div>
            {result && (
              <button
                type="button"
                onClick={() => setResult(null)}
                className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Clear Result
              </button>
            )}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selected}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <FormComponent onResult={handleResult} onLoading={setLoading} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Loading Spinner State */}
        {loading && (
          <div className="card p-10 flex flex-col items-center justify-center gap-3 text-center mb-8 border-blue-200 bg-blue-50/40">
            <Loader2 className="w-9 h-9 text-blue-600 animate-spin" />
            <p className="text-sm font-semibold text-slate-800">Analyzing medical data...</p>
            <p className="text-xs text-slate-500 max-w-sm">
              Executing scikit-learn preprocessing pipeline and running model probability evaluation.
            </p>
          </div>
        )}

        {/* Prediction Result Section */}
        <div id="result-section">
          <AnimatePresence>
            {result && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {result.error ? (
                  <div className="card p-5 border-red-200 bg-red-50 flex items-start gap-3 text-red-900">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-bold">Prediction Request Failed</p>
                      <p className="text-xs text-red-800 mt-1 leading-relaxed">{result.error}</p>
                    </div>
                  </div>
                ) : (
                  <PredictionCard result={result} />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
