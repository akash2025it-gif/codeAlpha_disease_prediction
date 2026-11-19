import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Heart,
  Dna,
  ArrowRight,
  Clock,
  Trash2,
  Download,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  FileText,
  User,
  Shield,
  RefreshCw,
  Search,
  Filter,
  ExternalLink,
  Info,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getHistory, deleteHistoryItem, clearAllHistory } from '../services/api';

const MODULES = [
  {
    key: 'heart',
    name: 'Heart Disease',
    tag: 'Cardiovascular Risk',
    features: '13 clinical features',
    dataset: 'Cleveland UCI',
    algorithm: 'Random Forest (Tuned)',
    accuracy: '88.5%',
    icon: <Heart className="w-5 h-5 text-red-600" />,
    borderClass: 'border-red-200 hover:border-red-300',
    bgBadge: 'bg-red-50 text-red-700 border-red-200',
    btnClass: 'bg-red-600 hover:bg-red-700 text-white',
    href: '/predict?disease=heart',
  },
  {
    key: 'diabetes',
    name: 'Diabetes',
    tag: 'Endocrine Diagnostic',
    features: '8 clinical features',
    dataset: 'Pima Indians',
    algorithm: 'Random Forest (Tuned)',
    accuracy: '79.2%',
    icon: <Activity className="w-5 h-5 text-sky-600" />,
    borderClass: 'border-sky-200 hover:border-sky-300',
    bgBadge: 'bg-sky-50 text-sky-700 border-sky-200',
    btnClass: 'bg-sky-600 hover:bg-sky-700 text-white',
    href: '/predict?disease=diabetes',
  },
  {
    key: 'breast_cancer',
    name: 'Breast Cancer',
    tag: 'Oncological Cytology',
    features: '30 cytology features',
    dataset: 'Wisconsin WDBC',
    algorithm: 'Calibrated SVM (Platt)',
    accuracy: '98.2%',
    icon: <Dna className="w-5 h-5 text-purple-600" />,
    borderClass: 'border-purple-200 hover:border-purple-300',
    bgBadge: 'bg-purple-50 text-purple-700 border-purple-200',
    btnClass: 'bg-purple-600 hover:bg-purple-700 text-white',
    href: '/predict?disease=breast_cancer',
  },
];

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDisease, setFilterDisease] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalItem, setActiveModalItem] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchHistoryData = async () => {
    setLoading(true);
    try {
      const data = await getHistory();
      setHistory(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn('Failed to fetch history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistoryData();
  }, [user]);

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteHistoryItem(id);
      setHistory((prev) => prev.filter((item) => String(item.id) !== String(id)));
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to clear your entire prediction history?')) {
      try {
        await clearAllHistory();
        setHistory([]);
      } catch (err) {
        console.error('Clear failed:', err);
      }
    }
  };

  const exportCSV = () => {
    if (!history.length) return;
    const headers = ['ID', 'Date', 'Disease', 'Result', 'Probability', 'Risk Category', 'Model'];
    const rows = history.map((h) => [
      h.id,
      new Date(h.created_at).toLocaleString(),
      `"${h.disease}"`,
      `"${h.result}"`,
      h.probability,
      `"${h.risk_category}"`,
      `"${h.model}"`,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `medpredict_history_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredHistory = history.filter((item) => {
    const matchesDisease =
      filterDisease === 'ALL' ||
      item.disease?.toLowerCase().includes(filterDisease.toLowerCase());
    const matchesSearch =
      !searchQuery ||
      item.disease?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.risk_category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.model?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDisease && matchesSearch;
  });

  const totalCount = history.length;
  const highRiskCount = history.filter(
    (h) => h.prediction === 1 || h.risk_category === 'Higher Risk'
  ).length;
  const avgProb =
    totalCount > 0
      ? (
          (history.reduce((acc, curr) => acc + (Number(curr.probability) || 0), 0) /
            totalCount) *
          100
        ).toFixed(1)
      : '0.0';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-14 space-y-10">
      {/* Clinician Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6 sm:p-8 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white border-0 shadow-lg"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/30 text-blue-100 border border-blue-400/30 mb-3">
              <Shield className="w-3.5 h-3.5 text-blue-300" />
              <span>Clinician Diagnostic Suite v2.0</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {isAuthenticated ? `Welcome back, ${user?.name}` : 'Clinical Intelligence Console'}
            </h1>
            <p className="text-sm text-blue-200 mt-1 max-w-xl leading-relaxed">
              {isAuthenticated
                ? `Account: ${user?.email} — Longitudinal patient telemetry and calibrated machine-learning inference.`
                : 'You are viewing the dashboard in guest mode. Sign in to synchronize and encrypt your records across devices.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {!isAuthenticated ? (
              <Link
                to="/login"
                className="btn-primary bg-white text-blue-900 hover:bg-blue-50 text-xs py-2.5 px-4 font-bold"
              >
                Sign In to Sync History
              </Link>
            ) : (
              <button
                onClick={fetchHistoryData}
                disabled={loading}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-blue-700/60 hover:bg-blue-700 text-white text-xs font-semibold transition-all border border-blue-500/40"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh Telemetry</span>
              </button>
            )}
            <Link
              to="/predict"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-400 text-white text-xs font-bold transition-all shadow-sm"
            >
              <span>New Assessment</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="card p-5 bg-white border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Records</span>
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900">{totalCount}</p>
          <p className="text-[0.7rem] text-slate-500 mt-1">Logged evaluations</p>
        </div>

        <div className="card p-5 bg-white border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">High Risk Flags</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-amber-600">{highRiskCount}</p>
          <p className="text-[0.7rem] text-slate-500 mt-1">Requires follow-up</p>
        </div>

        <div className="card p-5 bg-white border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Active Modules</span>
            <Activity className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600">3 Models</p>
          <p className="text-[0.7rem] text-slate-500 mt-1">Heart, Diabetes, Oncology</p>
        </div>

        <div className="card p-5 bg-white border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Avg Probability</span>
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900">{avgProb}%</p>
          <p className="text-[0.7rem] text-slate-500 mt-1">Cohort risk average</p>
        </div>
      </div>

      {/* 3 Prediction Modules */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Disease Diagnostic Modules</h2>
            <p className="text-xs text-slate-500">
              Select a specialized machine-learning pipeline to run patient risk estimation.
            </p>
          </div>
          <Link
            to="/predict"
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <span>Open Predictor Hub</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MODULES.map((m) => (
            <div
              key={m.key}
              className={`card p-6 flex flex-col justify-between transition-all hover:shadow-md ${m.borderClass}`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                    {m.icon}
                  </div>
                  <span
                    className={`text-[0.65rem] font-bold px-2.5 py-0.5 rounded-full border ${m.bgBadge}`}
                  >
                    {m.tag}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900">{m.name}</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Validated on {m.dataset} ({m.features})
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Selected Model:</span>
                    <span className="font-semibold text-slate-700">{m.algorithm}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Benchmark Metric:</span>
                    <span className="font-semibold text-emerald-600">{m.accuracy} Accuracy</span>
                  </div>
                </div>
              </div>

              <Link
                to={m.href}
                className={`w-full mt-6 py-2.5 px-4 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all ${m.btnClass}`}
              >
                <span>Launch Evaluation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Longitudinal Prediction History */}
      <div className="card p-6 sm:p-8 bg-white border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span>Longitudinal Prediction History</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review and audit previous risk evaluations, probabilities, and model parameters.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {history.length > 0 && (
              <>
                <button
                  type="button"
                  onClick={exportCSV}
                  className="btn-outline text-xs py-2 px-3 flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="btn-outline text-xs py-2 px-3 text-red-600 hover:text-red-700 hover:bg-red-50 flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Filters bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 mb-6">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {['ALL', 'Heart', 'Diabetes', 'Breast Cancer'].map((f) => (
              <button
                key={f}
                onClick={() => setFilterDisease(f)}
                className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  filterDisease === f
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by disease or risk..."
              className="field-input pl-8 py-1.5 text-xs w-full"
            />
          </div>
        </div>

        {/* Table / List */}
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-500">
            <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
            <p className="text-xs">Loading patient telemetry...</p>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="py-14 text-center border-2 border-dashed border-slate-200 rounded-xl">
            <Activity className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-800">No Assessment Records Found</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
              {searchQuery || filterDisease !== 'ALL'
                ? 'No evaluations match your current filter settings.'
                : 'Execute your first clinical prediction to begin building your patient telemetry history.'}
            </p>
            <Link to="/predict" className="btn-primary text-xs py-2 px-4 font-bold">
              Run First Assessment
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3">Date & Time</th>
                  <th className="py-3 px-3">Condition</th>
                  <th className="py-3 px-3">Risk Assessment</th>
                  <th className="py-3 px-3">Probability</th>
                  <th className="py-3 px-3">Model</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredHistory.map((item) => {
                  const isHigh =
                    item.prediction === 1 || item.risk_category === 'Higher Risk';
                  const isModerate = item.risk_category === 'Moderate Risk';
                  const probPercent = (Number(item.probability) * 100).toFixed(1);

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-3 text-slate-500 whitespace-nowrap">
                        {new Date(item.created_at).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}{' '}
                        <span className="text-[0.65rem] text-slate-400">
                          {new Date(item.created_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 font-bold text-slate-900 whitespace-nowrap">
                        {item.disease}
                      </td>

                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.7rem] font-bold border ${
                            isHigh
                              ? 'bg-red-50 text-red-700 border-red-200'
                              : isModerate
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isHigh
                                ? 'bg-red-500'
                                : isModerate
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                          />
                          {item.risk_category || item.result}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-2 w-32">
                          <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                isHigh
                                  ? 'bg-red-500'
                                  : isModerate
                                  ? 'bg-amber-500'
                                  : 'bg-emerald-500'
                              }`}
                              style={{ width: `${Math.min(100, probPercent)}%` }}
                            />
                          </div>
                          <span className="font-semibold text-slate-700 text-[0.7rem]">
                            {probPercent}%
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-3 text-slate-500 text-[0.75rem] whitespace-nowrap">
                        {item.model}
                      </td>

                      <td className="py-3.5 px-3 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setActiveModalItem(item)}
                            className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 hover:text-blue-600 transition-colors"
                            title="View Input Parameters"
                          >
                            <Info className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            disabled={deletingId === item.id}
                            className="p-1.5 rounded-md hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                            title="Delete Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Input Parameters Modal */}
      <AnimatePresence>
        {activeModalItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="card bg-white max-w-lg w-full p-6 max-h-[80vh] flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    {activeModalItem.disease} Evaluation Telemetry
                  </h3>
                  <p className="text-xs text-slate-500">
                    Recorded on {new Date(activeModalItem.created_at).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => setActiveModalItem(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-4 space-y-3">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700">Classification Result:</span>
                  <span className="font-bold text-blue-700">
                    {activeModalItem.risk_category} ({(Number(activeModalItem.probability) * 100).toFixed(1)}%)
                  </span>
                </div>

                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 pt-2">
                  Input Parameter Values
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(activeModalItem.inputs || {}).map(([key, val]) => (
                    <div key={key} className="p-2 rounded bg-slate-50 border border-slate-100 flex justify-between">
                      <span className="text-slate-500 truncate max-w-[120px]">{key}:</span>
                      <span className="font-mono font-bold text-slate-800">{String(val)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveModalItem(null)}
                  className="btn-primary py-1.5 px-4 text-xs font-bold"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
