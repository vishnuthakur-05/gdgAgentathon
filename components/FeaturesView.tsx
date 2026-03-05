import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Shield, FileText, Sun, Moon, CheckCircle, Globe, TrendingUp, ArrowLeft, Layers } from 'lucide-react';

interface FeaturesViewProps {
    onBack: () => void;
}

const FeatureCard: React.FC<{
    title: string;
    description: string;
    icon: React.ReactNode;
    delay: number;
}> = ({ title, description, icon, delay }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            className="group relative p-8 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-indigo-500/30 hover:bg-white/10 transition-all duration-300 overflow-hidden"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    {icon}
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {description}
                </p>
            </div>
        </motion.div>
    );
};

export const FeaturesView: React.FC<FeaturesViewProps> = ({ onBack }) => {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
    const y2 = useTransform(scrollY, [0, 1000], [0, -150]);

    const features = [
        {
            title: "Risk Assessment",
            description: "Strategic identification of market threats and competitive pressure using advanced heuristics.",
            icon: <Shield className="text-rose-500" size={24} />
        },
        {
            title: "Structured Output",
            description: "Professional report displays with automated PDF export capabilities for board-ready presentations.",
            icon: <FileText className="text-indigo-500" size={24} />
        },
        {
            title: "Dual-Theme UI",
            description: "Seamless toggle between Light and Dark modes. Optimized for late-night analysis sessions.",
            icon: <Sun className="text-amber-500" size={24} />
        },
        {
            title: "Input Validation",
            description: "Rigorous pre-analysis data checks ensuring valid inputs before our AI agents begin processing.",
            icon: <CheckCircle className="text-emerald-500" size={24} />
        },
        {
            title: "Public Signal Logic",
            description: "Analysis based strictly on verifiable, public market data for maximum reliability and zero hallucination.",
            icon: <Globe className="text-cyan-500" size={24} />
        },
        {
            title: "Indian MSME Focus",
            description: "Specialized templates and discovery algorithms tailored for regional business growth and local markets.",
            icon: <TrendingUp className="text-violet-500" size={24} />
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 overflow-hidden font-sans relative">

            {/* Background Mesh */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[120px] mix-blend-screen" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[100px] mix-blend-screen" />
            </div>

            {/* Navigation */}
            <nav className="fixed top-24 left-0 right-0 z-50 px-6 py-6 flex items-center justify-between pointer-events-none">
                <button
                    onClick={onBack}
                    className="pointer-events-auto flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-slate-900 dark:text-white hover:bg-white/20 transition-colors shadow-lg"
                >
                    <ArrowLeft size={18} />
                    <span className="font-medium">Back to Home</span>
                </button>
            </nav>

            {/* Hero Header */}
            <div className="pt-32 pb-16 px-6 relative z-10 text-center max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-6"
                >
                    <Layers size={14} /> Platform Architecture
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight"
                >
                    Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Precision.</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed"
                >
                    Every feature is engineered to provide the clearest, most actionable market intelligence available.
                </motion.p>
            </div>

            {/* Grid */}
            <div className="max-w-7xl mx-auto px-6 pb-32 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <FeatureCard
                            key={index}
                            {...feature}
                            delay={0.3 + (index * 0.1)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
