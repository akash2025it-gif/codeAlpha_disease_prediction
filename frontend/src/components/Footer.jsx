import { Link } from 'react-router-dom';
import { Activity } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-10 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <Activity className="w-5 h-5 text-blue-400" />
            <span>MedPredict AI</span>
          </div>
          <p className="text-xs text-center text-slate-500 max-w-md">
            ⚠️ For educational purposes only. Not a medical diagnosis. Always consult a qualified healthcare professional.
          </p>
          <div className="flex gap-4 text-sm">
            <Link to="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link>
            <Link to="/about" className="hover:text-white transition-colors">About</Link>
          </div>
        </div>
        <p className="text-center text-xs mt-6 text-slate-600">
          © {new Date().getFullYear()} MedPredict AI — Disease Prediction from Medical Data
        </p>
      </div>
    </footer>
  );
}
