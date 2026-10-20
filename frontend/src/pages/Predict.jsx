import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Activity, Dna, Loader2, AlertCircle } from 'lucide-react';
import HeartForm from '../components/forms/HeartForm';
import DiabetesForm from '../components/forms/DiabetesForm';
import BreastCancerForm from '../components/forms/BreastCancerForm';
import { PredictionCard } from '../components/PredictionCard';

const DISEASES = [
  { key: 'heart', label: 'Heart Disease', icon: <Heart className="w-5 h-5" />, color: 'text-red-500', activeBg: 'bg-red-50 border-red-300', inactiveBg: 'bg-white border-slate-200' },
  { key: 'diabetes', label: 'Diabetes', icon: <Activity className="w-5 h-5" />, color: 'text-sky-500', activeBg: 'bg-sky-50 border-sky-300', inactiveBg: 'bg-white border-slate-200' },
  { key: 'breast_cancer', label: 'Breast Cancer', icon: <Dna className="w-5 h-5" />, color: 'text-purple-500', activeBg: 'bg-purple-50 border-purple-300', inactiveBg: 'bg-white border-slate-200' },
];

export default function Predict() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initial = searchParams.get('disease') || 'heart';
  const [selected, setSelected] = useState(initial);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { setResult(null); }, [selected]);

  const handleResult = (r) => {
    setResult(r);
    if (!r.error) {
      setTimeout(() => {
        document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 200);
    }
  };

  const FormComponent = selected === 'heart' ? HeartForm : selected === 'diabetes' ? DiabetesForm : BreastCancerForm;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Disease Risk Prediction</h1>
        <p className="text-slate-500 mb-8">Select a disease, fill in the medical values, and receive an AI-powered risk assessment.</p>

        {/* Disease selector */}
        <div className="grid grid-cols-3 gap-3 mb-10">
          {DISEASES.map(d => (
            <button
              key={d.key}
              onClick={() => setSelected(d.key)}
              className={`flex flex-col sm:flex-row items-center justify-center gap-2 border-2 rounded-xl py-3 px-4 font-medium text-sm transition-all ${
                selected === d.key ? `${d.activeBg} ${d.color}` : `${d.inactiveBg} text-slate-600 hover:border-slate-300`
              }`}
            >
              <span className={selected === d.key ? d.color : 'text-slate-400'}>{d.icon}</span>
              <span>{d.label}</span>
            </button>
          ))}
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={selected}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <FormComponent onResult={handleResult} onLoading={setLoading} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-10 gap-3">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            <p className="text-slate-500 font-medium">Analyzing medical data...</p>
          </div>
        )}

        {/* Result */}
        <div id="result-section">
          <AnimatePresence>
            {result && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-8"
              >
                {result.error ? (
                  <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <p className="text-red-700 text-sm">{result.error}</p>
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
