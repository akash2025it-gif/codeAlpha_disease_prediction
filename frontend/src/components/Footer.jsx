import { Link } from 'react-router-dom';
import { Activity, ShieldAlert } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center">
                <Activity className="text-white" style={{ width: 14, height: 14 }} strokeWidth={2.5} />
              </div>
              <span className="text-white font-bold text-sm">MedPredict AI</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-500 max-w-xs">
              An educational machine-learning project demonstrating disease risk
              estimation from structured clinical data.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">Navigation</p>
            <ul className="space-y-2 text-sm">
              {[
                ['/', 'Home'],
                ['/predict', 'Disease Prediction'],
                ['/performance', 'Model Performance'],
                ['/about', 'About'],
                ['/disclaimer', 'Disclaimer'],
              ].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="text-slate-500 hover:text-slate-200 transition-colors text-xs">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Disclaimer */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ShieldAlert className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Important</p>
            </div>
            <p className="text-xs leading-relaxed text-slate-500">
              Predictions are experimental ML outputs and are{' '}
              <span className="text-amber-400 font-medium">not medical diagnoses</span>.
              Never use this tool for clinical decisions. Always consult a qualified
              healthcare professional.{' '}
              <Link to="/disclaimer" className="text-blue-400 hover:text-blue-300 underline underline-offset-2">
                Full disclaimer →
              </Link>
            </p>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} MedPredict AI — Disease Prediction from Medical Data
          </p>
          <p className="text-xs text-slate-700">Educational project — not a medical device</p>
        </div>
      </div>
    </footer>
  );
}
