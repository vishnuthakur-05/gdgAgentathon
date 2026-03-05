
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BusinessInfo } from '../types';
import { Building2, Globe, Tag, MapPin, ArrowRight, ArrowLeft } from 'lucide-react';

interface InputFormProps {
  onSubmit: (info: BusinessInfo) => void;
  initialData?: Partial<BusinessInfo>;
  onBack: () => void;
}

export const InputForm: React.FC<InputFormProps> = ({ onSubmit, initialData, onBack }) => {
  const [formData, setFormData] = useState<BusinessInfo>({
    name: initialData?.name || '',
    website: initialData?.website || '',
    niche: initialData?.niche || '',
    region: initialData?.region || 'Global'
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.niche) return;
    setLoading(true);
    onSubmit(formData);
  };

  return (
    <div className="pt-32 pb-20">
      <div className="max-w-2xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl shadow-indigo-500/5"
        >
          <div className="mb-10 text-center relative">
            <button
              onClick={onBack}
              className="absolute left-0 top-0 flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors text-sm font-medium"
            >
              <ArrowLeft size={16} /> <span className="hidden sm:inline">Back</span>
            </button>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Configure Intelligence</h2>
            <p className="text-slate-600 dark:text-slate-400">Tell us about your business to begin the analysis.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Building2 size={16} /> Business Name
              </label>
              <input
                required
                type="text"
                placeholder="e.g. Acme SaaS"
                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Globe size={16} /> Website URL (Optional)
              </label>
              <input
                type="url"
                placeholder="https://example.com"
                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                value={formData.website}
                onChange={e => setFormData({ ...formData, website: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Tag size={16} /> Industry / Niche
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Eco-friendly Skincare"
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                  value={formData.niche}
                  onChange={e => setFormData({ ...formData, niche: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <MapPin size={16} /> Region
                </label>
                <select
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white appearance-none"
                  value={formData.region}
                  onChange={e => setFormData({ ...formData, region: e.target.value })}
                >
                  <option value="Global">Global</option>
                  <option value="North America">North America</option>
                  <option value="Europe">Europe</option>
                  <option value="Asia Pacific">Asia Pacific</option>
                  <option value="UK & Ireland">UK & Ireland</option>
                </select>
              </div>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full py-5 mt-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Generate Intelligence Report <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};
