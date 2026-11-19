import { motion } from 'framer-motion';
import {
  Brain,
  Layers,
  Database,
  ShieldCheck,
  GitBranch,
  Cpu,
  BarChart2,
  Stethoscope,
  Lock,
  LineChart,
  Activity,
  FileCheck2,
} from 'lucide-react';

const Section = ({ title, icon, children }) => (
  <div className="card p-6 sm:p-8 mb-6 bg-white border border-slate-200">
    <div className="flex items-center gap-3 mb-4 border-b border-slate-100 pb-3">
      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
    </div>
    <div className="text-slate-600 text-sm leading-relaxed space-y-3">{children}</div>
  </div>
);

const AlgoCard = ({ name, type, pros, desc, color }) => (
  <div className={`p-4 rounded-xl border ${color} flex flex-col justify-between`}>
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <h3 className="font-bold text-slate-900 text-sm">{name}</h3>
        <span className="text-[0.65rem] font-semibold px-2 py-0.5 rounded-full bg-white text-slate-600 border border-slate-200">
          {type}
        </span>
      </div>
      <p className="text-xs text-slate-600 leading-relaxed mb-3">{desc}</p>
    </div>
    <p className="text-[0.7rem] text-slate-500 font-medium">
      <strong className="text-slate-700">Clinical Strength:</strong> {pros}
    </p>
  </div>
);

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 md:py-14">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        {/* Header */}
        <div className="mb-8">
          <p className="section-label mb-1">Architecture & Clinical Informatics</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            About MedPredict AI
          </h1>
          <p className="text-sm text-slate-500 mt-1.5 max-w-2xl">
            A comprehensive guide to the purpose, machine-learning classification algorithms,
            preprocessing pipelines, and clinical telemetry framework powering MedPredict AI.
          </p>
        </div>

        {/* Section 1: Purpose & Clinical Context */}
        <Section title="Purpose & Clinical Problem Statement" icon={<Brain className="w-4 h-4" />}>
          <p>
            In modern healthcare systems, delayed detection of chronic conditions—specifically
            cardiovascular disease, glycemic disorders, and malignant tissue transformations—remains
            a leading contributor to preventable complications.
          </p>
          <p>
            <strong>MedPredict AI</strong> is an enterprise clinical intelligence platform
            designed to evaluate structured patient records (routine laboratory assays, physiological
            vitals, and biopsy measurements) using supervised machine-learning classification algorithms.
          </p>
          <p>
            By identifying complex multi-factor interactions across physiological markers, the platform
            computes calibrated probability scores, enabling early risk stratification and providing
            transparent decision-support indicators for healthcare researchers.
          </p>
        </Section>

        {/* Section 2: Clinical Conditions & Datasets */}
        <Section title="Medical Focus Areas & Benchmark Datasets" icon={<Database className="w-4 h-4" />}>
          <p>
            The system focuses on three high-impact clinical conditions, each trained on established,
            peer-reviewed medical benchmark cohorts:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <h3 className="font-bold text-slate-900 text-sm mb-1">Heart Disease</h3>
              <p className="text-xs text-blue-700 font-semibold mb-2">Cleveland Clinic (UCI)</p>
              <p className="text-xs text-slate-600">
                13 clinical features including resting blood pressure, serum cholesterol, ST-depression,
                and fluoroscopy vessel counts to determine angiographic coronary artery disease risk.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <h3 className="font-bold text-slate-900 text-sm mb-1">Type-2 Diabetes</h3>
              <p className="text-xs text-blue-700 font-semibold mb-2">Pima Indians (NIDDK)</p>
              <p className="text-xs text-slate-600">
                8 physiological features including plasma glucose concentration, 2-hour serum insulin,
                body mass index (BMI), and genetic diabetes pedigree function.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <h3 className="font-bold text-slate-900 text-sm mb-1">Breast Cancer</h3>
              <p className="text-xs text-blue-700 font-semibold mb-2">Wisconsin WDBC</p>
              <p className="text-xs text-slate-600">
                30 morphological features extracted from digitized fine needle aspirate (FNA) cell nuclei
                images, classifying biopsies as Benign or Malignant.
              </p>
            </div>
          </div>
        </Section>

        {/* Section 3: Machine Learning Algorithms */}
        <Section title="Machine Learning Classification Algorithms" icon={<Layers className="w-4 h-4" />}>
          <p>
            Rather than relying on a single heuristic, every condition was benchmarked across four
            foundational classification algorithms to identify the optimal inductive bias for each data geometry:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <AlgoCard
              name="Logistic Regression"
              type="Linear Probabilistic"
              desc="Models log-odds of the target condition as a linear combination of normalized input features with L2 regularization."
              pros="High interpretability, direct odds-ratio coefficient mapping, fast convergence."
              color="bg-blue-50/50 border-blue-200"
            />
            <AlgoCard
              name="Support Vector Machine (SVM)"
              type="Maximum Margin Hyperplane"
              desc="Projects features into high-dimensional Hilbert space via RBF kernel with Platt probability scaling."
              pros="Superior generalization in dense continuous spaces; optimal for 30-feature WDBC cytology."
              color="bg-purple-50/50 border-purple-200"
            />
            <AlgoCard
              name="Random Forest"
              type="Ensemble / Bagging"
              desc="Constructs 100 decorrelated decision trees, aggregating classifications via soft voting probabilities."
              pros="Inherent resilience to multicollinearity and non-linear interactions; top performer for Heart & Diabetes."
              color="bg-emerald-50/50 border-emerald-200"
            />
            <AlgoCard
              name="XGBoost"
              type="Gradient Boosted Trees"
              desc="Sequentially fits shallow trees to pseudo-residuals, optimizing regularized loss via second-order gradients."
              pros="State-of-the-art predictive performance on tabular clinical data with built-in missing value handling."
              color="bg-amber-50/50 border-amber-200"
            />
          </div>
        </Section>

        {/* Section 4: Data Preprocessing Pipeline */}
        <Section title="Zero-Data-Leakage Preprocessing" icon={<Cpu className="w-4 h-4" />}>
          <p>
            A common failure in clinical machine learning is data leakage—allowing information from the test
            or production set to inadvertently inform training transformations. MedPredict AI prevents this through
            sealed pipelines:
          </p>
          <div className="space-y-2.5 text-xs text-slate-700 pt-2">
            <div className="p-3 bg-slate-50 rounded-lg flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center flex-shrink-0 text-xs">
                1
              </span>
              <span>
                <strong>Physiological Zero Handling:</strong> Biologically impossible zeros in vitals
                (such as blood pressure or glucose = 0) are converted to NaN and imputed using median statistics computed solely from training partitions.
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center flex-shrink-0 text-xs">
                2
              </span>
              <span>
                <strong>Feature Normalization:</strong> Scikit-learn <code className="font-mono bg-white px-1 py-0.5 border rounded">StandardScaler</code> normalizes features to zero mean and unit variance.
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center flex-shrink-0 text-xs">
                3
              </span>
              <span>
                <strong>Stratified Splitting:</strong> 80/20 train/test partition preserves clinical disease prevalence ratios across folds.
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center flex-shrink-0 text-xs">
                4
              </span>
              <span>
                <strong>Composite Model Selection:</strong> Ranked by a composite objective: \(0.70 \times \text{F1-Score} + 0.30 \times \text{ROC-AUC}\), ensuring sensitivity is prioritized for clinical safety.
              </span>
            </div>
          </div>
        </Section>

        {/* Section 5: Platform Architecture & Security */}
        <Section title="Platform Architecture & Telemetry Security" icon={<Lock className="w-4 h-4" />}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <h3 className="font-bold text-slate-900 text-xs mb-1">Clinician Authentication</h3>
              <p className="text-xs text-slate-600">
                PBKDF2-HMAC-SHA256 password hashing with 100,000 rounds and cryptographically signed JWT bearer tokens for secure clinician sessions.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <h3 className="font-bold text-slate-900 text-xs mb-1">Longitudinal History</h3>
              <p className="text-xs text-slate-600">
                Authenticated clinicians can audit previous assessments, inspect input parameters, track cohort risk trends, and export records to CSV.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <h3 className="font-bold text-slate-900 text-xs mb-1">Zero-PII Privacy</h3>
              <p className="text-xs text-slate-600">
                No patient identifiers (such as national ID, full legal name, or medical records number) are collected or stored in the database.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <h3 className="font-bold text-slate-900 text-xs mb-1">Serverless Inference</h3>
              <p className="text-xs text-slate-600">
                Lightweight ASGI microservices execute serialized pipelines with sub-150ms latency and high reliability.
              </p>
            </div>
          </div>
        </Section>

        {/* Section 6: Medical Limitations & Governance */}
        <Section title="Clinical Boundaries & Governance Notice" icon={<FileCheck2 className="w-4 h-4" />}>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 space-y-2">
            <p>
              <strong>Clinical Decision Support Notice:</strong> MedPredict AI provides probabilistic risk stratification designed to assist healthcare professionals in evaluating patient biomarkers.
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
              <li>Intended as a clinical decision-support tool; does not replace individualized diagnostic workups or physician examinations.</li>
              <li>Calculated probabilities represent statistical risk scoring derived from validated clinical cohorts.</li>
              <li>A "Lower Risk" classification does not eliminate pathology risk; a "Higher Risk" classification warrants comprehensive clinical review.</li>
              <li>Clinical decisions and treatment protocols remain the exclusive responsibility of licensed healthcare practitioners.</li>
            </ul>
          </div>
        </Section>
      </motion.div>
    </div>
  );
}
