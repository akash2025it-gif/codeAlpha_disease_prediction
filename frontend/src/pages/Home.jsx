import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Heart,
  Activity,
  Dna,
  ArrowRight,
  Brain,
  ShieldCheck,
  Cpu,
  Layers,
  Database,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Lock,
  LineChart,
  Stethoscope,
  Clock,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const MODULES = [
  {
    key: 'heart',
    icon: <Heart className="w-6 h-6 text-red-600" />,
    title: 'Heart Disease Risk',
    category: 'Cardiovascular',
    description:
      'Evaluates multivariate risk patterns based on blood pressure, serum cholesterol, resting ECG, fluoroscopy, and exercise treadmill stress readings.',
    featuresCount: '13 clinical features',
    dataset: 'Cleveland UCI Cohort',
    algorithm: 'Random Forest (Tuned)',
    benchmark: '88.5% Accuracy',
    href: '/predict?disease=heart',
    badgeColor: 'bg-red-50 text-red-700 border-red-200',
    cardBorder: 'hover:border-red-300',
  },
  {
    key: 'diabetes',
    icon: <Activity className="w-6 h-6 text-sky-600" />,
    title: 'Type-2 Diabetes',
    category: 'Endocrinology',
    description:
      'Assesses glycemic dysregulation likelihood using fasting plasma glucose, insulin sensitivity, BMI, pedigree function, and age attributes.',
    featuresCount: '8 clinical features',
    dataset: 'Pima Indians Dataset',
    algorithm: 'Random Forest (Tuned)',
    benchmark: '79.2% Accuracy',
    href: '/predict?disease=diabetes',
    badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
    cardBorder: 'hover:border-sky-300',
  },
  {
    key: 'breast_cancer',
    icon: <Dna className="w-6 h-6 text-purple-600" />,
    title: 'Breast Cancer Cytology',
    category: 'Oncological Pathology',
    description:
      'Analyzes 30 morphological features of cell nuclei extracted from digital fine needle aspirate (FNA) biopsy images.',
    featuresCount: '30 cytology features',
    dataset: 'Wisconsin WDBC Cohort',
    algorithm: 'Calibrated SVM (Platt)',
    benchmark: '98.2% Accuracy',
    href: '/predict?disease=breast_cancer',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    cardBorder: 'hover:border-purple-300',
  },
];

const PLATFORM_FEATURES = [
  {
    title: 'Multi-Algorithm Validation',
    desc: 'Each disease is rigorously benchmarked across Logistic Regression, SVM, Random Forest, and XGBoost, selecting the optimal estimator by composite F1 & ROC-AUC score.',
    icon: <Layers className="w-5 h-5 text-blue-600" />,
  },
  {
    title: 'Zero Data Leakage Pipelines',
    desc: 'Preprocessing transformers fit strictly on stratified training splits. Median imputation and StandardScaler normalisation run through verified scikit-learn pipelines.',
    icon: <Database className="w-5 h-5 text-blue-600" />,
  },
  {
    title: 'Calibrated Risk Probabilities',
    desc: 'Outputs exact risk probabilities calibrated via Platt scaling and soft voting, categorizing patients into Low, Moderate, and High Risk strata.',
    icon: <LineChart className="w-5 h-5 text-blue-600" />,
  },
  {
    title: 'Clinician Telemetry History',
    desc: 'Secure authenticated portal allows clinicians to track historical assessments, inspect previous inputs, and export patient evaluations to CSV.',
    icon: <Clock className="w-5 h-5 text-blue-600" />,
  },
  {
    title: 'Zero-PII Privacy Architecture',
    desc: 'Designed with healthcare data ethics in mind: no patient names, social security numbers, or identifiers are required or retained.',
    icon: <Lock className="w-5 h-5 text-blue-600" />,
  },
  {
    title: 'Real-Time Serverless Inference',
    desc: 'FastAPI microservices hosted on auto-scaled serverless compute deliver predictions in under 150 milliseconds with high availability.',
    icon: <Cpu className="w-5 h-5 text-blue-600" />,
  },
];

const WORKFLOW = [
  {
    step: '01',
    title: 'Structured Telemetry Entry',
    desc: 'Enter verified laboratory markers, vitals, or cytology readings into clinical range-checked forms with sample preset support.',
  },
  {
    step: '02',
    title: 'Pipeline Transformation',
    desc: 'Data flows through median imputers and StandardScaler normalisation to match the exact mathematical space of model training.',
  },
  {
    step: '03',
    title: 'Classifier Evaluation',
    desc: 'Ensemble models process multi-dimensional feature interactions to calculate continuous probability scores.',
  },
  {
    step: '04',
    title: 'Clinical Risk Stratification',
    desc: 'Receive calibrated risk percentages, categorical severity banding, model attribution, and save records to your history.',
  },
];

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b border-slate-200 bg-gradient-to-b from-blue-50/70 via-white to-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Top Badge */}
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-100/80 text-blue-800 border border-blue-200/60 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Next-Generation Healthcare Intelligence</span>
            </span>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.15] mb-6">
              AI-Powered Disease <br className="hidden sm:inline" />
              <span className="text-blue-600">Risk Prediction</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              Empowering clinical teams and researchers with validated diagnostic probability models
              for Cardiovascular Disease, Type-2 Diabetes, and Breast Cytology.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto">
              <Link
                to="/predict"
                className="w-full sm:w-auto btn-primary py-3 px-6 text-sm font-bold shadow-md shadow-blue-600/20"
              >
                <span>Launch Prediction Console</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to={isAuthenticated ? '/dashboard' : '/login'}
                className="w-full sm:w-auto btn-outline py-3 px-6 text-sm font-bold"
              >
                <span>{isAuthenticated ? 'Go to Dashboard' : 'Clinician Portal'}</span>
              </Link>
            </div>

            {/* Stats Bar */}
            <div className="mt-14 pt-8 border-t border-slate-200/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <p className="text-2xl sm:text-3xl font-black text-slate-900">3 Modules</p>
                <p className="text-xs text-slate-500 mt-0.5">Heart, Diabetes, Oncology</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-blue-600">98.2%</p>
                <p className="text-xs text-slate-500 mt-0.5">Top Model Precision</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-slate-900">4 Algorithms</p>
                <p className="text-xs text-slate-500 mt-0.5">LR, SVM, RF & XGBoost</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-emerald-600">&lt; 150ms</p>
                <p className="text-xs text-slate-500 mt-0.5">Real-Time Inference</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Disease Prediction Modules */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="section-label mb-2">Diagnostic Modules</p>
          <h2 className="section-title">Specialized Clinical Predictors</h2>
          <p className="text-sm text-slate-500 mt-2">
            Each disease module utilizes verified medical features, median imputation pipelines, and calibrated classification algorithms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MODULES.map((m) => (
            <motion.div
              key={m.key}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className={`card p-6 sm:p-7 flex flex-col justify-between transition-all ${m.cardBorder} shadow-sm hover:shadow-md`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center flex-shrink-0">
                    {m.icon}
                  </div>
                  <span
                    className={`text-[0.68rem] font-bold px-2.5 py-0.5 rounded-full border ${m.badgeColor}`}
                  >
                    {m.category}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2">{m.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">{m.description}</p>

                <div className="space-y-2 py-3 border-y border-slate-100 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Telemetry:</span>
                    <span className="font-semibold text-slate-700">{m.featuresCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Dataset:</span>
                    <span className="font-semibold text-slate-700">{m.dataset}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Production Model:</span>
                    <span className="font-semibold text-slate-700">{m.algorithm}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Benchmark:</span>
                    <span className="font-semibold text-emerald-600">{m.benchmark}</span>
                  </div>
                </div>
              </div>

              <div className="pt-5">
                <Link
                  to={m.href}
                  className="w-full btn-outline py-2.5 px-4 text-xs font-bold flex items-center justify-between hover:border-blue-300 hover:text-blue-700"
                >
                  <span>Evaluate {m.title}</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Clinical Workflow */}
      <section className="bg-slate-900 text-white py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2">Workflow</p>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">How Prediction Works</h2>
            <p className="text-slate-400 text-sm mt-3">
              From structured clinical measurements to calibrated risk probabilities through a zero-leakage scikit-learn pipeline.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WORKFLOW.map((s) => (
              <div key={s.step} className="bg-slate-800/80 rounded-xl p-6 border border-slate-700 flex flex-col">
                <span className="text-3xl font-black text-blue-400/40 mb-3">{s.step}</span>
                <h3 className="text-base font-bold text-white mb-2">{s.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed flex-1">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Capabilities */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="section-label mb-2">Enterprise Architecture</p>
          <h2 className="section-title">Engineered for Clinical Precision</h2>
          <p className="text-sm text-slate-500 mt-2">
            Combining rigorous machine-learning pipelines with secure, token-based clinician telemetry.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PLATFORM_FEATURES.map((f) => (
            <div key={f.title} className="card p-6 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0 mb-4">
                  {f.icon}
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="card p-8 sm:p-10 bg-gradient-to-r from-blue-600 to-indigo-700 text-white border-0 shadow-xl text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">
            Ready to Run Clinical Evaluations?
          </h2>
          <p className="text-sm text-blue-100 max-w-xl mx-auto mb-8 leading-relaxed">
            Test verified models for Heart Disease, Diabetes, and Breast Cancer or create a clinician account to maintain your longitudinal assessment history.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/predict"
              className="w-full sm:w-auto btn-primary bg-white text-blue-900 hover:bg-blue-50 text-xs py-3 px-6 font-bold shadow-md"
            >
              Launch Predictor
            </Link>
            <Link
              to="/register"
              className="w-full sm:w-auto btn-outline bg-blue-700/60 hover:bg-blue-700 text-white border-blue-400/40 text-xs py-3 px-6 font-bold"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

      {/* Concise Clinical Ethics Notice */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-6">
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
          <p className="text-xs text-slate-600 leading-relaxed">
            <strong>Clinical Decision Support Notice:</strong> MedPredict AI delivers multi-factor probabilistic risk stratification to assist clinical decision-making. Outputs complement standard diagnostic pathways and clinical assessments. Consult a licensed physician for diagnosis and treatment planning.{' '}
            <Link to="/about" className="font-semibold text-blue-700 hover:underline">
              Review Clinical Methodology & Validation →
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
