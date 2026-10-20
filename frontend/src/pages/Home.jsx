import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, Activity, Dna, ArrowRight, BarChart2, Brain, CheckCircle, ChevronRight } from 'lucide-react';

const diseases = [
  {
    icon: <Heart className="w-8 h-8" />,
    title: 'Heart Disease',
    description: 'Assess cardiovascular risk based on clinical parameters including blood pressure, cholesterol, and ECG results.',
    color: 'text-red-500',
    bg: 'bg-red-50',
    border: 'border-red-100',
    href: '/predict?disease=heart',
  },
  {
    icon: <Activity className="w-8 h-8" />,
    title: 'Diabetes',
    description: 'Evaluate diabetes risk using glucose levels, BMI, insulin measurements, and patient history.',
    color: 'text-sky-500',
    bg: 'bg-sky-50',
    border: 'border-sky-100',
    href: '/predict?disease=diabetes',
  },
  {
    icon: <Dna className="w-8 h-8" />,
    title: 'Breast Cancer',
    description: 'Analyze cell nucleus characteristics from fine needle aspirates to predict malignancy risk.',
    color: 'text-purple-500',
    bg: 'bg-purple-50',
    border: 'border-purple-100',
    href: '/predict?disease=breast_cancer',
  },
];

const steps = [
  { step: '01', title: 'Enter Medical Information', desc: 'Fill in the relevant clinical values from the structured form.' },
  { step: '02', title: 'Data is Processed', desc: 'Your inputs are normalized and prepared using the same preprocessing pipeline as training.' },
  { step: '03', title: 'ML Model Analyzes', desc: 'The best-performing trained model evaluates the features to produce a prediction.' },
  { step: '04', title: 'Prediction is Displayed', desc: 'View your risk category, probability score, and the model used—with a clear disclaimer.' },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-sky-500 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 bg-white/20 text-white text-sm px-4 py-1.5 rounded-full mb-6 font-medium">
              <Brain className="w-4 h-4" /> Powered by Machine Learning
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
              AI-Powered Disease<br />Risk Prediction
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              Explore machine-learning based predictions from structured medical data. Trained on real clinical datasets using four state-of-the-art algorithms.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/predict"
                className="bg-white text-blue-700 font-semibold px-8 py-3.5 rounded-xl hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                Start Prediction <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/performance"
                className="border-2 border-white/60 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
              >
                <BarChart2 className="w-4 h-4" /> View Model Performance
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Disease Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900">Supported Disease Predictions</h2>
          <p className="text-slate-500 mt-3">Select a condition to begin an AI-powered risk assessment</p>
        </div>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {diseases.map(d => (
            <motion.div
              key={d.title}
              variants={fadeUp}
              className={`bg-white rounded-2xl border ${d.border} shadow-sm hover:shadow-md transition-shadow p-8 flex flex-col`}
            >
              <div className={`${d.bg} ${d.color} w-14 h-14 rounded-xl flex items-center justify-center mb-5`}>
                {d.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{d.title}</h3>
              <p className="text-slate-500 text-sm flex-1 mb-6">{d.description}</p>
              <Link
                to={d.href}
                className="flex items-center gap-2 text-blue-600 font-semibold text-sm hover:gap-3 transition-all"
              >
                Predict Risk <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="bg-slate-900 py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">How It Works</h2>
            <p className="text-slate-400 mt-3">From input to prediction in four simple steps</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-5xl font-black text-blue-500/30 mb-3">{s.step}</div>
                <h3 className="text-white font-semibold mb-2">{s.title}</h3>
                <p className="text-slate-400 text-sm">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Algorithms */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900">Four Algorithms Compete, Best One Wins</h2>
          <p className="text-slate-500 mt-3">Every disease model is trained and evaluated across all four algorithms. The highest-performing model is selected automatically.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {['Logistic Regression', 'Support Vector Machine', 'Random Forest', 'XGBoost'].map((alg, i) => (
            <motion.div
              key={alg}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-xl border border-slate-200 p-6 text-center shadow-sm hover:shadow-md transition-shadow"
            >
              <CheckCircle className="w-8 h-8 text-blue-500 mx-auto mb-3" />
              <p className="font-semibold text-slate-800 text-sm">{alg}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Disclaimer Banner */}
      <section className="bg-amber-50 border-t border-amber-200 py-6 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-amber-800 text-sm">
            ⚠️ <strong>Educational purpose only.</strong> This tool does not provide medical diagnoses. Always consult a qualified healthcare professional for health decisions.{' '}
            <Link to="/disclaimer" className="underline font-medium">Read full disclaimer →</Link>
          </p>
        </div>
      </section>
    </div>
  );
}
