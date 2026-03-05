import React from 'react';
import { User, HistoryItem } from '../types';
import { Shield, Clock, TrendingUp, User as UserIcon, LogOut, ArrowLeft, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProfileViewProps {
    user: User;
    history: HistoryItem[];
    onBack: () => void;
    onLogout: () => void;
    onSelectHistory: (item: HistoryItem) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ user, history, onBack, onLogout, onSelectHistory }) => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0F172A] pt-24 pb-12 px-6">
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span>Back to Dashboard</span>
                    </button>
                    <button
                        onClick={onLogout}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                    >
                        <LogOut size={18} />
                        <span>Sign Out</span>
                    </button>
                </div>

                {/* Profile Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm mb-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />

                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-indigo-500/20">
                        {user.name.charAt(0)}
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
                            MSME Premium
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{user.name}</h1>
                        <p className="text-slate-500 dark:text-slate-400">{user.email}</p>
                    </div>

                    <div className="flex gap-6">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-slate-900 dark:text-white">{history.length}</div>
                            <div className="text-xs text-slate-500 uppercase tracking-wider">Reports</div>
                        </div>
                        <div className="w-px bg-slate-200 dark:bg-slate-800" />
                        <div className="text-center">
                            <div className="text-2xl font-bold text-slate-900 dark:text-white">{Math.round(history.length * 7)}</div>
                            <div className="text-xs text-slate-500 uppercase tracking-wider">Competitors</div>
                        </div>
                    </div>
                </motion.div>

                {/* Recent Analysis History */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="flex items-center gap-3 mb-6">
                        <Clock className="text-indigo-500" size={24} />
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Analysis History</h2>
                    </div>

                    {history.length === 0 ? (
                        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                            <Shield size={48} className="text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-500">No analysis reports generated yet.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {history.map((item, i) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    onClick={() => onSelectHistory(item)}
                                    className="group bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500 group-hover:text-indigo-600 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 transition-colors">
                                            <TrendingUp size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">{item.businessName}</h3>
                                            <p className="text-sm text-slate-500">{item.niche} • {new Date(item.timestamp).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <ArrowRight size={20} className="text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>

            </div>
        </div>
    );
};
