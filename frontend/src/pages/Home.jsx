import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Heart,
  Activity,
  Dna,
  ArrowRight,
  BarChart2,
  Brain,
  ShieldCheck,
  Cpu,
  Layers,
  Database,
  CheckCircle2,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

const DISEASES = [
  {
    icon: <Heart className="w-6 h-6 text-red-600" />,
    title: 'Heart Disease',
    tag: 'Cardiovascular',
    description:
      'Evaluates risk patterns based on blood pressure, serum cholesterol, ECG results, fluoroscopy, and exercise stress testing.',
    stats: '13 clinical features • Cleveland UCI',
    bestModel: 'Random Forest',
    href: '/predict?disease=heart',
    badgeColor: 'bg-red-50 text-red-700 border-red-200',
  },
  {
    icon: <Activity className="w-6 h-6 text-sky-600" />,
    title: 'Diabetes',
    tag: 'Endocrinology',
    description:
      'Assesses diabetes likelihood using plasma glucose, insulin levels, BMI, pedigree function, and physiological attributes.',
    stats: '8 clinical features • Pima Indians',
    bestModel: 'Random Forest',
    href: '/predict?disease=diabetes',
    badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
  },
  {
    icon: <Dna className="w-6 h-6 text-purple-600" />,
    title: 'Breast Cancer',
    tag: 'Oncology',
    description:
      'Analyzes 30 morphological features of cell nuclei extracted from fine needle aspirate (FNA) biopsy images.',
    stats: '30 cytology features • Wisconsin WDBC',
    bestModel: 'Support Vector Machine',
    href: '/predict?disease=breast_cancer',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
  },
];

const STEPS = [
  {
    step: '01',
    title: 'Input Medical Features',
    desc: 'Enter verified physiological measurements into structured, field-validated clinical input forms.',
  },
  {
    step: '02',
    title: 'Pipeline Preprocessing',
    desc: 'Features undergo median imputation and StandardScaler normalisation identical to model training.',
  },
  {
    step: '03',
    title: 'Classification Inference',
    desc: 'The best-performing model evaluates feature interactions to calculate binary risk classification.',
  },
  {
    step: '04',
    title: 'Risk Estimation & Score',
    desc: 'Receive calibrated probability percentage, categorical risk banding, and model explanation.',
  },
];

const METHODOLOGY = [
  {
    title: 'Rigorous 4-Algorithm Benchmark',
    desc: 'Every condition is trained across Logistic Regression, SVM (calibrated), Random Forest, and XGBoost.',
    icon: <Layers className="w-5 h-5 text-blue-600" />,
  },
  {
    title: 'Zero Leakage Preprocessing',
    desc: 'Transformers fit strictly on training splits. Inference applies the exact serialized scikit-learn pipeline.',
    icon: <Database className="w-5 h-5 text-blue-600" />,
  },
  {
    title: 'Composite Model Selection',
    desc: 'Models are ranked on composite metrics (70% F1-Score + 30% ROC-AUC) prioritizing clinical recall balance.',
    icon: <ShieldCheck className="w-5 h-5 text-blue-600" />,
  },
  {
    title: 'Stateless & Private',
    desc: 'No patient telemetry, personal identifiers, or inputs are stored or transmitted beyond inference.',
    icon: <Cpu className="w-5 h-5 text-blue-600" />,
  },
];

const TECH_STACK = [
  { category: 'Frontend', items: ['React 18', 'Vite', 'Tailwind CSS', 'Framer Motion', 'Recharts', 'Lucide React'] },
  { category: 'Backend API', items: ['FastAPI', 'Uvicorn', 'Pydantic v2', 'Python 3.11', 'REST Architecture'] },
  { category: 'Machine Learning', items: ['scikit-learn', 'XGBoost', 'pandas', 'NumPy', 'joblib Pipelines'] },
];

export default function Home() {
  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b border-slate-200 bg-gradient-to-b from-blue-50/70 via-white to-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-100/80 text-blue-800 border border-blue-200/60 mb-6">
              <Brain className="w-3.5 h-3.5 text-blue-600" />
              Machine Learning Healthcare Research System
            </span>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.15] mb-6">
              AI-Powered Disease <br className="hidden sm:inline" />
              <span className="text-blue-600">Risk Prediction</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-10">
              Explore machine-learning risk classification built on authentic clinical datasets.
              Benchmarking Logistic Regression, SVM, Random Forest, and XGBoost with full pipeline reproducibility.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link to="/predict" className="w-full sm:w-auto btn-primary py-3.5 px-7 text-base shadow-md">
                Start Prediction
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/performance" className="w-full sm:w-auto btn-outline py-3.5 px-7 text-base">
                <BarChart2 className="w-4 h-4" />
                View Model Performance
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Disease Cards */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="section-label mb-2">Supported Conditions</p>
          <h2 className="section-title">Clinical Risk Classifiers</h2>
          <p className="text-sm text-slate-500 mt-2">
            Each disease model is independently trained, cross-validated, and deployed using the top-performing algorithm.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {DISEASES.map((d) => (
            <motion.div
              key={d.title}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className="card p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                    {d.icon}
                  </div>
                  <span className={`text-[0.7rem] font-bold px-2.5 py-1 rounded-full border ${d.badgeColor}`}>
                    {d.tag}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-2">{d.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">{d.description}</p>
              </div>

              <div className="border-t border-slate-100 pt-4 mt-2">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                  <span>{d.stats}</span>
                  <span className="font-semibold text-blue-700">Best: {d.bestModel}</span>
                </div>
                <Link
                  to={d.href}
                  className="flex items-center justify-between w-full py-2.5 px-4 rounded-lg bg-slate-50 hover:bg-blue-50 text-blue-700 text-xs font-bold transition-colors border border-slate-200 hover:border-blue-200"
                >
                  <span>Evaluate {d.title}</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-slate-900 text-white py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2">Workflow</p>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">How Prediction Works</h2>
            <p className="text-slate-400 text-sm mt-3">
              From structured clinical telemetry to probability classification through a sealed ML pipeline.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((s) => (
              <div key={s.step} className="bg-slate-800/80 rounded-xl p-6 border border-slate-700 flex flex-col">
                <span className="text-3xl font-black text-blue-400/40 mb-3">{s.step}</span>
                <h3 className="text-base font-bold text-white mb-2">{s.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed flex-1">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Machine Learning Methodology */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="section-label mb-2">Engineering Standards</p>
          <h2 className="section-title">Machine Learning Methodology</h2>
          <p className="text-sm text-slate-500 mt-2">
            Built using industry best practices for statistical validity, transparency, and data integrity.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {METHODOLOGY.map((m) => (
            <div key={m.title} className="card p-6 flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                {m.icon}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-1.5">{m.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Technology Stack Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="card p-8 bg-slate-50/60 border border-slate-200">
          <div className="text-center max-w-xl mx-auto mb-8">
            <p className="section-label mb-1">Architecture</p>
            <h3 className="text-xl font-bold text-slate-900">Full-Stack Technology Overview</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TECH_STACK.map((t) => (
              <div key={t.category} className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs">
                <p className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-3">{t.category}</p>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {t.items.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Medical Disclaimer Banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-6">
        <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-center">
          <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
            <strong>Educational & Research Notice:</strong> MedPredict AI is an educational machine-learning demonstration.
            Outputs are experimental statistical estimates, not medical diagnoses. Never make healthcare decisions without
            consulting a qualified, licensed medical professional.{' '}
            <Link to="/disclaimer" className="font-semibold underline underline-offset-2 hover:text-amber-700">
              Read Complete Disclaimer →
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
