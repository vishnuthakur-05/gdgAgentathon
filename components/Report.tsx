
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AnalysisReport, BusinessInfo, ActionStatus } from '../types';
import { 
  Download, Mail, ExternalLink, ShieldCheck, TrendingUp, TrendingDown, 
  Minus, Target, Zap, AlertTriangle, Lightbulb, Skull, RefreshCcw, 
  Loader2, Info, CheckCircle2 
} from 'lucide-react';
import { EmailModal } from './EmailModal';
import { Toast } from './Toast';
import { downloadReportPDF, sendReportEmail } from '../apiService';

interface ReportProps {
  report: AnalysisReport;
  businessInfo: BusinessInfo;
  onReset: () => void;
}

export const Report: React.FC<ReportProps> = ({ report, businessInfo, onReset }) => {
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState<ActionStatus>('idle');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; isVisible: boolean }>({
    message: '',
    type: 'success',
    isVisible: false
  });

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type, isVisible: true });
  };

  const handleDownload = async () => {
    setDownloadStatus('loading');
    try {
      await downloadReportPDF(report, businessInfo);
      setDownloadStatus('success');
      showToast('PDF Report generated and downloaded successfully.', 'success');
    } catch (error) {
      setDownloadStatus('error');
      showToast('Failed to generate PDF. Please try again.', 'error');
    } finally {
      setTimeout(() => setDownloadStatus('idle'), 3000);
    }
  };

  const handleEmailSubmit = async (email: string) => {
    try {
      await sendReportEmail(email, report, businessInfo);
      showToast(`Strategy report successfully sent to ${email}`, 'success');
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="pt-32 pb-20 max-w-5xl mx-auto px-4">
      <Toast 
        {...toast} 
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))} 
      />

      <EmailModal 
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        onSubmit={handleEmailSubmit}
        businessName={businessInfo.name}
      />

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12 no-print">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <ShieldCheck size={22} />
          </div>
          Executive Strategy Brief
        </h2>
        <div className="flex items-center gap-3">
          <button
            onClick={handleDownload}
            disabled={downloadStatus === 'loading'}
            className="flex-1 sm:flex-none px-6 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {downloadStatus === 'loading' ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
            {downloadStatus === 'loading' ? 'Generating...' : 'Download PDF'}
          </button>
          <button
            onClick={() => setIsEmailModalOpen(true)}
            className="flex-1 sm:flex-none px-6 py-2.5 bg-indigo-600 text-white hover:bg-indigo-500 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
          >
            <Mail size={18} /> Send via Email
          </button>
        </div>
      </div>

      {/* Report Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-[2.5rem] overflow-hidden p-8 md:p-16"
      >
        {/* Title Section */}
        <div className="border-b border-slate-100 dark:border-slate-800 pb-12 mb-12">
          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="text-indigo-600 font-bold tracking-widest uppercase text-xs mb-3">McKinsey-Grade Analysis</p>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
                Market Intelligence: <span className="text-slate-500 dark:text-slate-400">{businessInfo.name}</span>
              </h1>
              <div className="flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5"><Target size={14} /> {businessInfo.niche}</span>
                <span>•</span>
                <span>{businessInfo.region}</span>
                <span>•</span>
                <span>{report.generatedAt}</span>
              </div>
            </div>
            <div className="hidden sm:block">
              <div className="px-4 py-2 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Confidential</p>
              </div>
            </div>
          </div>
        </div>

        {/* 01. Executive Summary */}
        <section className="mb-20">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">01. Executive Summary</h3>
          <div className="bg-indigo-50/30 dark:bg-indigo-900/10 border-l-4 border-indigo-600 p-8 rounded-r-2xl">
            <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed italic font-serif">
              "{report.executiveSummary}"
            </p>
          </div>
        </section>

        {/* 02. Market Sentiment & Signals */}
        <section className="mb-20">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">02. Decision-Oriented Signals</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {report.marketSignals.map((signal, idx) => (
              <div key={idx} className="p-6 bg-slate-50 dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-slate-800 flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{signal.label}</span>
                  {signal.trend === 'positive' && <TrendingUp className="text-emerald-500" size={18} />}
                  {signal.trend === 'negative' && <TrendingDown className="text-rose-500" size={18} />}
                  {signal.trend === 'neutral' && <Minus className="text-amber-500" size={18} />}
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{signal.value}</div>
                <div className="flex-1 text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                  {signal.description}
                </div>
                <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-800">
                  <p className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase mb-1">Strategic Insight</p>
                  <p className="text-xs font-medium text-slate-900 dark:text-slate-200 italic">"{signal.insight}"</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 03. Competitive Intelligence Matrix */}
        <section className="mb-20">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">03. Competitive Pressure Matrix</h3>
          <div className="space-y-4">
            {report.competitors.map((comp, idx) => (
              <div key={idx} className="group p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-900 transition-all hover:shadow-xl hover:shadow-indigo-500/5">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="lg:w-1/4">
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{comp.name}</h4>
                    <a href={comp.url} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-600 hover:underline inline-flex items-center gap-1 mb-3">
                      Visit Platform <ExternalLink size={10} />
                    </a>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500 uppercase">{comp.pricingIndicator}</span>
                      <span className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-900/30 text-[10px] font-bold text-indigo-600 uppercase">{comp.trafficTrend}</span>
                    </div>
                  </div>
                  <div className="lg:w-3/4 flex flex-col gap-4">
                    <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                        <AlertTriangle size={12} className="text-amber-500" /> Competitive Pressure
                      </p>
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                        {comp.competitivePressure}
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Positioning</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 italic">"{comp.positioning}"</p>
                      </div>
                      <div className="flex-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Key Edge</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{comp.keyAdvantage}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 04. Internal Capability Review */}
        <section className="mb-20">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">04. Internal Review (SWOT)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 rounded-3xl">
              <h4 className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold mb-4 uppercase text-xs tracking-widest"><Zap size={16} /> Strengths</h4>
              <ul className="space-y-2">
                {report.swot.strengths.map((s, i) => (
                  <li key={i} className="text-sm text-emerald-900/70 dark:text-emerald-300/70 flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" /> {s}</li>
                ))}
              </ul>
            </div>
            <div className="p-6 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/50 rounded-3xl">
              <h4 className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold mb-4 uppercase text-xs tracking-widest"><AlertTriangle size={16} /> Weaknesses</h4>
              <ul className="space-y-2">
                {report.swot.weaknesses.map((w, i) => (
                  <li key={i} className="text-sm text-rose-900/70 dark:text-rose-300/70 flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 flex-shrink-0" /> {w}</li>
                ))}
              </ul>
            </div>
            <div className="p-6 bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50 rounded-3xl">
              <h4 className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-bold mb-4 uppercase text-xs tracking-widest"><Lightbulb size={16} /> Opportunities</h4>
              <ul className="space-y-2">
                {report.swot.opportunities.map((o, i) => (
                  <li key={i} className="text-sm text-indigo-900/70 dark:text-indigo-300/70 flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0" /> {o}</li>
                ))}
              </ul>
            </div>
            <div className="p-6 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/50 rounded-3xl">
              <h4 className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold mb-4 uppercase text-xs tracking-widest"><Skull size={16} /> Threats</h4>
              <ul className="space-y-2">
                {report.swot.threats.map((t, i) => (
                  <li key={i} className="text-sm text-amber-900/70 dark:text-amber-300/70 flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" /> {t}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 05. Recommended Strategic Moves */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">05. Actionable Strategic Moves</h3>
          <div className="space-y-8">
            {report.strategicMoves.map((item, idx) => (
              <div key={idx} className="relative group">
                <div className="absolute -left-4 top-0 bottom-0 w-1 bg-indigo-600 rounded-full opacity-0 group-hover:opacity-100 transition-all" />
                <div className="bg-slate-50 dark:bg-slate-950 rounded-[2rem] p-8 border border-slate-100 dark:border-slate-800 transition-all group-hover:translate-x-1 group-hover:shadow-lg group-hover:shadow-indigo-500/5">
                  <div className="flex gap-6">
                    <div className="w-12 h-12 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-center text-xl font-bold text-indigo-600 flex-shrink-0">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{item.move}</h4>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                            <Info size={12} className="text-indigo-500" /> Strategic Rationale
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                            {item.reasoning}
                          </p>
                        </div>
                        <div className="p-5 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-500/20">
                          <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                            <CheckCircle2 size={12} /> Expected Impact
                          </p>
                          <p className="text-sm leading-relaxed font-bold">
                            {item.impact}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom Actions */}
        <div className="pt-12 border-t border-slate-100 dark:border-slate-800 text-center flex flex-col items-center gap-6">
          <button
            onClick={onReset}
            className="px-10 py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-indigo-600/20 flex items-center gap-3 active:scale-95"
          >
            <RefreshCcw size={20} /> New Analysis
          </button>
          <div className="space-y-2">
            <p className="font-serif italic text-lg text-slate-500 dark:text-slate-400">Generated by Competitor AI</p>
            <p className="text-[10px] text-slate-300 uppercase tracking-[0.3em]">Decision Support Protocol v3.1</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
