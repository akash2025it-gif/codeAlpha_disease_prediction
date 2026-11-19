import { motion } from 'framer-motion';
import {
  Brain,
  Layers,
  Database,
  ArrowRight,
  ShieldAlert,
  GitBranch,
  Cpu,
  BarChart2,
  ExternalLink,
} from 'lucide-react';

const Section = ({ title, icon, children }) => (
  <div className="card p-6 sm:p-8 mb-6">
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
      <strong className="text-slate-700">Key strength:</strong> {pros}
    </p>
  </div>
);

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 md:py-14">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        {/* Header */}
        <div className="mb-8">
          <p className="section-label mb-1">Architecture & Methodology</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            About MedPredict AI
          </h1>
          <p className="text-sm text-slate-500 mt-1.5 max-w-2xl">
            A technical guide to the data preprocessing, model selection, algorithms, and evaluation
            framework governing this educational machine learning project.
          </p>
        </div>

        {/* Live Repository Notice */}
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold text-blue-900">Open-Source Project Repository</p>
            <p className="text-xs text-blue-700 mt-0.5">Explore source code, training notebooks, and schemas on GitHub.</p>
          </div>
          <a
            href="https://github.com/akash2025it-gif/codeAlpha_disease_prediction"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900 underline underline-offset-2"
          >
            <span>View GitHub Repository</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Section 1: Objective & Medical Context */}
        <Section title="What is Disease Prediction from Medical Data?" icon={<Brain className="w-4 h-4" />}>
          <p>
            In clinical informatics, <strong>disease risk prediction</strong> refers to the application of
            probabilistic machine learning models to structured patient records (demographics, vital signs,
            laboratory assays, and diagnostic readings) to estimate the likelihood of a specific pathological condition.
          </p>
          <p>
            Unlike diagnostic tests that confirm the direct presence of a pathogen or structural lesion, machine
            learning models identify multi-dimensional patterns and non-linear risk interactions that may not be
            immediately apparent from isolated biomarkers.
          </p>
          <p className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600">
            <strong>Important Clinical Distinction:</strong> This system produces educational risk assessments,
            not clinical diagnoses. A high-risk score does not confirm disease, nor does a low-risk score guarantee its absence.
          </p>
        </Section>

        {/* Section 2: What is Classification? */}
        <Section title="Supervised Classification in Healthcare" icon={<GitBranch className="w-4 h-4" />}>
          <p>
            <strong>Classification</strong> is a supervised machine-learning paradigm in which an algorithm learns
            a mapping function from an input feature vector \(X\) to a discrete categorical label \(y\).
          </p>
          <p>
            In this project, each model performs <strong>binary classification</strong>:
          </p>
          <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 pl-2">
            <li><strong>Class 0:</strong> Negative (absence of disease / benign tissue)</li>
            <li><strong>Class 1:</strong> Positive (presence of disease / malignant tissue)</li>
          </ul>
          <p>
            In addition to binary labels, our models compute <strong>calibrated probabilities</strong> \(P(y = 1 \mid X)\),
            enabling nuanced clinical risk stratification rather than rigid cutoffs.
          </p>
        </Section>

        {/* Section 3: Datasets */}
        <Section title="Verified Public Datasets" icon={<Database className="w-4 h-4" />}>
          <p>This project relies exclusively on authentic, peer-reviewed clinical benchmarks:</p>
          <div className="space-y-3 mt-2">
            <div className="p-3.5 rounded-lg border border-slate-200 bg-white">
              <p className="font-bold text-slate-800 text-xs">Heart Disease — Cleveland Clinic Dataset (UCI ML Repository)</p>
              <p className="text-xs text-slate-600 mt-1">
                303 patient records with 13 physiological parameters (age, chest pain type, resting BP, serum cholesterol,
                fasting blood sugar, resting ECG, maximum heart rate, exercise angina, ST depression, slope, fluoroscopy vessels, thallium scan).
              </p>
            </div>
            <div className="p-3.5 rounded-lg border border-slate-200 bg-white">
              <p className="font-bold text-slate-800 text-xs">Diabetes — Pima Indians Diabetes Dataset (NIDDK)</p>
              <p className="text-xs text-slate-600 mt-1">
                768 female records with 8 clinical variables (pregnancies, 2-hour plasma glucose, diastolic blood pressure,
                triceps skinfold thickness, 2-hour serum insulin, BMI, diabetes pedigree score, age). Biologically impossible zero values are treated as missing data.
              </p>
            </div>
            <div className="p-3.5 rounded-lg border border-slate-200 bg-white">
              <p className="font-bold text-slate-800 text-xs">Breast Cancer — Wisconsin Diagnostic Breast Cancer (WDBC)</p>
              <p className="text-xs text-slate-600 mt-1">
                569 fine needle aspirate (FNA) biopsy samples with 30 digitized morphological features computed from cell nuclei
                (mean, standard error, and worst values for radius, texture, perimeter, area, smoothness, compactness, concavity, concave points, symmetry, fractal dimension).
              </p>
            </div>
          </div>
        </Section>

        {/* Section 4: 4 Algorithms */}
        <Section title="Four Machine Learning Algorithms" icon={<Layers className="w-4 h-4" />}>
          <p>
            Rather than presuming which algorithm is optimal, we train and benchmark four distinct mathematical
            families of classifiers for each condition:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-3">
            <AlgoCard
              name="Logistic Regression"
              type="Generalized Linear Model"
              desc="Models log-odds using linear combinations of standardized features with L2 regularization."
              pros="High interpretability, stable baseline, direct coefficient weights."
              color="bg-blue-50/50 border-blue-200"
            />
            <AlgoCard
              name="Support Vector Machine (SVM)"
              type="Maximum Margin Classifier"
              desc="Maps inputs into high-dimensional space via an RBF kernel to find the optimal separating hyperplane."
              pros="Exceptional on high-dimensional data (e.g. 30 WDBC features), robust against overfitting."
              color="bg-sky-50/50 border-sky-200"
            />
            <AlgoCard
              name="Random Forest"
              type="Ensemble / Bagging"
              desc="Constructs an ensemble of 100 decorrelated decision trees, aggregating predictions via soft voting."
              pros="Captures non-linear feature interactions, inherently calculates Gini feature importance."
              color="bg-emerald-50/50 border-emerald-200"
            />
            <AlgoCard
              name="XGBoost"
              type="Gradient Boosted Decision Trees"
              desc="Sequentially trains shallow decision trees, optimizing a custom objective function with gradient descent."
              pros="State-of-the-art predictive performance on tabular clinical data, robust outlier handling."
              color="bg-amber-50/50 border-amber-200"
            />
          </div>
        </Section>

        {/* Section 5: End-to-End Workflow */}
        <Section title="The End-to-End Pipeline Workflow" icon={<Cpu className="w-4 h-4" />}>
          <div className="space-y-2.5 text-xs text-slate-700">
            <div className="p-3 bg-slate-50 rounded-lg flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center flex-shrink-0 text-xs">1</span>
              <span><strong>Data Preprocessing:</strong> Physiological zeros are parsed; SimpleImputer applies median imputation; StandardScaler standardizes unit variance.</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center flex-shrink-0 text-xs">2</span>
              <span><strong>Stratified Holdout Split:</strong> 80% training / 20% test partition maintaining exact class ratios.</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center flex-shrink-0 text-xs">3</span>
              <span><strong>Benchmark Training:</strong> All 4 candidate algorithms fit exclusively to training splits.</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center flex-shrink-0 text-xs">4</span>
              <span><strong>Model Selection:</strong> Ranked by composite score: \(0.70 \times \text{F1-Score} + 0.30 \times \text{ROC-AUC}\).</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center flex-shrink-0 text-xs">5</span>
              <span><strong>Serialization:</strong> Full pipeline (imputer + scaler + estimator) saved as a standalone joblib binary artifact.</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center flex-shrink-0 text-xs">6</span>
              <span><strong>REST API Inference:</strong> FastAPI parses inputs via Pydantic schemas and executes inference in milliseconds.</span>
            </div>
          </div>
        </Section>

        {/* Section 6: Limitations & Future Work */}
        <Section title="Limitations & Future Roadmap" icon={<BarChart2 className="w-4 h-4" />}>
          <div>
            <h3 className="font-bold text-slate-800 text-xs mb-2">Current System Limitations:</h3>
            <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 pl-2">
              <li>Cohort size constraints (N = 303 to 768 samples) typical of academic benchmark datasets.</li>
              <li>Potential demographic selection bias inherent in historical collection cohorts.</li>
              <li>Binary simplification of diseases that exhibit clinical spectrums and complex sub-phenotypes.</li>
            </ul>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <h3 className="font-bold text-slate-800 text-xs mb-2">Future Enhancements:</h3>
            <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 pl-2">
              <li>Integration of TreeSHAP and KernelSHAP for per-prediction local feature explanations.</li>
              <li>Expansion to chronic kidney disease (CKD) and liver cirrhosis diagnostic models.</li>
              <li>Confidence interval estimation via Monte Carlo dropout and conformal prediction.</li>
            </ul>
          </div>
        </Section>
      </motion.div>
    </div>
  );
}
