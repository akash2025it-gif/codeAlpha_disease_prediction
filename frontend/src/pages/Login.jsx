import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Activity,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  AlertCircle,
  Stethoscope,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both your email and password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        err.message ||
        'Authentication failed. Please verify your credentials.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = () => {
    setEmail('doctor@medpredict.ai');
    setPassword('MedicalAI2026!');
    setError(null);
  };

  return (
    <div className="min-h-[calc(100vh-130px)] flex items-center justify-center px-4 sm:px-6 py-12 bg-gradient-to-b from-slate-50 via-white to-blue-50/40">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-md"
      >
        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/20 mb-3">
            <Activity className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Clinician Portal Login
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Access your clinical dashboard, diagnostic models, and patient telemetry history.
          </p>
        </div>

        {/* Demo Account Callout */}
        <div className="mb-6 p-4 rounded-xl bg-blue-50/80 border border-blue-200/80 shadow-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/10 text-blue-700 flex items-center justify-center flex-shrink-0">
              <Stethoscope className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-blue-950">Quick Evaluator Access</p>
              <p className="text-[0.7rem] text-blue-700">Pre-fill demo clinician credentials</p>
            </div>
          </div>
          <button
            type="button"
            onClick={fillDemoAccount}
            className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-lg bg-white border border-blue-300 text-blue-700 hover:bg-blue-600 hover:text-white transition-all shadow-2xs"
          >
            <Sparkles className="w-3 h-3" />
            <span>Fill Demo</span>
          </button>
        </div>

        {/* Card Form */}
        <div className="card p-6 sm:p-8 bg-white border border-slate-200 shadow-md">
          {error && (
            <div className="mb-5 p-3.5 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-800">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Work Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="doctor@hospital.org"
                  required
                  className="field-input has-icon-left text-sm"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="field-input has-icon-left has-icon-right text-sm"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-2.5 mt-2 text-sm font-bold flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Privacy badge */}
          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[0.7rem] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Encrypted Token-Based Clinician Session</span>
          </div>
        </div>

        {/* Footer sign up prompt */}
        <p className="text-center text-xs text-slate-500 mt-6">
          Don't have a clinician account?{' '}
          <Link
            to="/register"
            className="font-bold text-blue-600 hover:text-blue-800 underline underline-offset-2"
          >
            Register New Account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
