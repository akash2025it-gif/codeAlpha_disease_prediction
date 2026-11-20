import { Link } from 'react-router-dom';
import { Activity, ShieldCheck, Heart, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <Link to="/" className="flex items-center gap-2 font-bold text-white">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-black tracking-tight text-white">
                MedPredict <span className="text-blue-400">AI</span>
              </span>
            </Link>
            <p className="text-[0.75rem] text-slate-400 leading-relaxed">
              Clinical decision-support and disease risk stratification powered by validated
              machine learning classification pipelines.
            </p>
            <div className="flex items-center gap-1.5 text-[0.7rem] text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Zero-PII Processing Architecture</span>
            </div>
          </div>

          {/* Platform Navigation */}
          <div>
            <p className="font-bold text-white text-xs uppercase tracking-wider mb-3">Platform</p>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home Overview
                </Link>
              </li>
              <li>
                <Link to="/predict" className="hover:text-white transition-colors">
                  Disease Prediction
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors">
                  Clinician Dashboard
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  Methodology & About
                </Link>
              </li>
              <li>
                <Link to="/performance" className="hover:text-white transition-colors">
                  Model Benchmarks & Metrics
                </Link>
              </li>
            </ul>
          </div>

          {/* Disease Modules */}
          <div>
            <p className="font-bold text-white text-xs uppercase tracking-wider mb-3">
              Diagnostic Modules
            </p>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/predict?disease=heart" className="hover:text-white transition-colors">
                  Heart Disease (Cleveland UCI)
                </Link>
              </li>
              <li>
                <Link to="/predict?disease=diabetes" className="hover:text-white transition-colors">
                  Diabetes (Pima Indians)
                </Link>
              </li>
              <li>
                <Link to="/predict?disease=breast_cancer" className="hover:text-white transition-colors">
                  Breast Cancer (Wisconsin WDBC)
                </Link>
              </li>
            </ul>
          </div>

          {/* Machine Learning Standards */}
          <div>
            <p className="font-bold text-white text-xs uppercase tracking-wider mb-3">
              Machine Learning
            </p>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>Random Forest (Ensemble)</li>
              <li>Calibrated SVM (Platt Scaling)</li>
              <li>Logistic Regression (L2)</li>
              <li>XGBoost Gradient Boosting</li>
              <li className="pt-2 text-[0.7rem] text-slate-500">
                Median Imputation • StandardScaler
              </li>
            </ul>
          </div>
        </div>

        {/* Clinical Decision Support & Regulatory Notice */}
        <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 mb-8 text-[0.72rem] text-slate-400 leading-relaxed">
          <strong className="text-slate-200">Clinical Decision Support Notice:</strong> MedPredict AI is a predictive analytics system engineered for healthcare professionals, diagnostic benchmarking, and clinical risk evaluation. Predictions are statistical risk estimations designed to provide supplementary decision support alongside standard diagnostic workups and clinical examinations. Consult a licensed medical practitioner for patient treatment decisions.
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[0.72rem] text-slate-500">
          <p>© {new Date().getFullYear()} MedPredict AI Healthcare Systems. Enterprise Clinical Intelligence.</p>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-slate-400 transition-colors">
              Technology & Ethics
            </Link>
            <Link to="/predict" className="hover:text-slate-400 transition-colors">
              Predictor Console
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
