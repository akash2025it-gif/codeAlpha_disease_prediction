import { motion } from 'framer-motion';

const Section = ({ title, children }) => (
  <div className="mb-10">
    <h2 className="text-xl font-bold text-slate-900 mb-3 border-l-4 border-blue-500 pl-4">{title}</h2>
    <div className="text-slate-600 leading-relaxed space-y-2">{children}</div>
  </div>
);

const AlgoCard = ({ name, color, desc }) => (
  <div className={`rounded-xl border p-5 ${color}`}>
    <h3 className="font-bold text-slate-800 mb-2">{name}</h3>
    <p className="text-sm text-slate-600">{desc}</p>
  </div>
);

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3">About This Project</h1>
        <p className="text-slate-500 text-lg mb-12">An educational machine-learning system for medical data classification.</p>

        <Section title="What Is Disease Prediction?">
          <p>Disease prediction uses statistical and machine-learning models to estimate the probability that a patient has a particular condition based on their clinical measurements. It does not replace clinical judgment — it is a decision-support tool.</p>
          <p>This project trains classification models on real, publicly available clinical datasets and deploys them via a web interface so anyone can explore how ML works with medical data.</p>
        </Section>

        <Section title="What Is Classification?">
          <p>Classification is a type of supervised machine learning. The algorithm learns from labeled examples (patients with and without a disease) and then predicts which category a new patient belongs to.</p>
          <p>Binary classification (two classes: positive / negative) is used here. The model outputs both a class label and a probability score.</p>
        </Section>

        <Section title="Datasets Used">
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Heart Disease:</strong> UCI Cleveland Heart Disease Dataset — 303 patients, 13 clinical features, binary target (0 = no disease, 1 = disease).</li>
            <li><strong>Diabetes:</strong> Pima Indians Diabetes Dataset — 768 patients, 8 clinical features, binary target (0 = no diabetes, 1 = diabetes).</li>
            <li><strong>Breast Cancer:</strong> Wisconsin Diagnostic Breast Cancer (WDBC) Dataset — 569 samples, 30 cell nucleus features, binary target (0 = benign, 1 = malignant).</li>
          </ul>
        </Section>

        <Section title="Preprocessing Pipeline">
          <p>Each dataset goes through the following steps before training:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Load dataset and inspect columns</li>
            <li>Replace physiological zeros with NaN (e.g., glucose = 0 is impossible)</li>
            <li>Impute missing values using the <em>median</em> (robust to outliers)</li>
            <li>Standardize all features: subtract mean, divide by standard deviation</li>
            <li>Split into 80% training / 20% test sets with stratification</li>
          </ol>
          <p>The same preprocessing pipeline (fitted on training data only) is saved and reused identically at inference time.</p>
        </Section>

        <Section title="Machine Learning Algorithms">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            <AlgoCard
              name="Logistic Regression"
              color="border-blue-100 bg-blue-50"
              desc="A linear model that predicts the log-odds of the positive class. Simple, interpretable, works well when features have a roughly linear relationship with the outcome."
            />
            <AlgoCard
              name="Support Vector Machine (SVM)"
              color="border-sky-100 bg-sky-50"
              desc="Finds the hyperplane that maximally separates classes in high-dimensional feature space. Uses an RBF kernel to handle non-linear relationships. Probabilities are calibrated using cross-validation."
            />
            <AlgoCard
              name="Random Forest"
              color="border-green-100 bg-green-50"
              desc="An ensemble of decision trees trained on random feature subsets. Averages predictions to reduce variance and overfitting. Provides built-in feature importances."
            />
            <AlgoCard
              name="XGBoost"
              color="border-amber-100 bg-amber-50"
              desc="Gradient boosting algorithm that builds trees sequentially, each correcting the errors of the previous. Often achieves state-of-the-art results on tabular data."
            />
          </div>
        </Section>

        <Section title="Training and Evaluation">
          <p>For each disease, all four algorithms are trained on the same data using the same preprocessing pipeline. Performance is then evaluated on the held-out test set.</p>
          <p>Metrics used: <strong>Accuracy</strong>, <strong>Precision</strong>, <strong>Recall</strong>, <strong>F1-Score</strong>, and <strong>ROC-AUC</strong>.</p>
          <p>The best model is selected using a composite score: <em>70% F1-Score + 30% ROC-AUC</em>. This balances classification quality with ranking performance.</p>
        </Section>

        <Section title="Prediction Flow">
          <ol className="list-decimal list-inside space-y-1">
            <li>User enters clinical values in the web form</li>
            <li>React sends a POST request to FastAPI backend via Axios</li>
            <li>FastAPI validates input using Pydantic schemas</li>
            <li>The saved scikit-learn Pipeline applies the same preprocessing, then the best model predicts</li>
            <li>Prediction (class) + probability are returned as JSON</li>
            <li>Frontend displays the result with a visual risk gauge</li>
          </ol>
        </Section>

        <Section title="Feature Importance">
          <p>For tree-based models (Random Forest, XGBoost), feature importances measure how much each input variable reduces impurity across all decision tree splits. Higher = more influential.</p>
          <p>For linear models (Logistic Regression), absolute coefficient values approximate each feature's influence after standardization.</p>
          <p>SVM (with RBF kernel) does not produce directly interpretable feature importances — the Random Forest importances are shown in such cases.</p>
        </Section>

        <Section title="Limitations">
          <ul className="list-disc list-inside space-y-1">
            <li>Models are trained on relatively small datasets — predictions should not be generalized broadly</li>
            <li>Real clinical populations may differ from the training data distribution</li>
            <li>Only a subset of relevant clinical variables is included</li>
            <li>This tool is not calibrated for any specific demographic or geographic population</li>
          </ul>
        </Section>
      </motion.div>
    </div>
  );
}
