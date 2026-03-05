
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Check, Search, ShieldCheck, Database, BrainCircuit, FileText } from 'lucide-react';

interface AnalysisViewProps {
  onComplete: () => void;
}

const steps = [
  { id: 1, label: 'Discovering competitors', icon: <Search size={20} />, duration: 2000 },
  { id: 2, label: 'Gathering market signals', icon: <Database size={20} />, duration: 2500 },
  { id: 3, label: 'Running AI reasoning engine', icon: <BrainCircuit size={20} />, duration: 3000 },
  { id: 4, label: 'Synthesizing strategic moves', icon: <ShieldCheck size={20} />, duration: 2500 },
  { id: 5, label: 'Finalizing Aggregation Gate', icon: <FileText size={20} />, duration: 1500 },
];

export const AnalysisView: React.FC<AnalysisViewProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    
    const processSteps = async () => {
      for (let i = 0; i < steps.length; i++) {
        if (!isMounted.current) return;
        setCurrentStep(i);
        await new Promise(resolve => setTimeout(resolve, steps[i].duration));
      }
      if (isMounted.current) {
        onComplete();
      }
    };

    processSteps();
    
    return () => {
      isMounted.current = false;
    };
  }, [onComplete]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
            className="w-20 h-20 bg-indigo-600/10 rounded-full flex items-center justify-center text-indigo-600 mx-auto mb-6"
          >
            <BrainCircuit size={40} />
          </motion.div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            Securing Market Data
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Validating consistency across all intelligence modules.
          </p>
        </div>

        <div className="space-y-4">
          {steps.map((step, idx) => {
            const isCompleted = idx < currentStep;
            const isActive = idx === currentStep;

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-500 ${
                  isActive 
                    ? 'bg-indigo-50/50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800' 
                    : isCompleted
                    ? 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 opacity-60'
                    : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 opacity-20'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  isCompleted ? 'bg-emerald-500 text-white' : isActive ? 'bg-indigo-600 text-white animate-pulse' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                }`}>
                  {isCompleted ? <Check size={20} /> : step.icon}
                </div>
                <div className="flex-1">
                  <p className={`font-semibold ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}>
                    {step.label}
                  </p>
                </div>
                {isActive && (
                  <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: step.duration / 1000, ease: "linear" }}
                      className="h-full bg-indigo-600"
                    />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
