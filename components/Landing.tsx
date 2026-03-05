import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { ArrowRight, BarChart3, Search, Zap, CheckCircle2, Globe, Shield, TrendingUp, Layers } from 'lucide-react';

import { User } from '../types';

interface LandingProps {
  onStart: () => void;
  onViewSample: () => void;
  user: User | null;
}

const FadeIn: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  );
};

export const Landing: React.FC<LandingProps> = ({ onStart, onViewSample, user }) => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);

  const features = [
    {
      icon: <Search className="text-cyan-400" size={24} />,
      title: "Stealth Discovery",
      description: "Uncover hidden competitors in seconds. Our AI scans deeper than standard search engines to find emerging threats.",
      gradient: "from-cyan-500/20 to-blue-500/20"
    },
    {
      icon: <BarChart3 className="text-indigo-400" size={24} />,
      title: "Market Signals",
      description: "Real-time analysis of pricing shifts, sentiment trends, and positioning pivots across your entire niche.",
      gradient: "from-indigo-500/20 to-violet-500/20"
    },
    {
      icon: <Zap className="text-amber-400" size={24} />,
      title: "Strategic Action",
      description: "Don't just see data—get consultant-grade action plans. Turn insights into immediate competitive advantage.",
      gradient: "from-amber-500/20 to-orange-500/20"
    }
  ];

  const timeline = [
    { step: "01", title: "Define Niche", desc: "Input your business details and target market." },
    { step: "02", title: "AI Scan", desc: "Thousands of data points analyzed in real-time." },
    { step: "03", title: "Strategy Report", desc: "Receive a comprehensive PDF plan of attack." }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0F172A] text-slate-900 dark:text-slate-300 transition-colors duration-300 overflow-hidden font-sans">

      {/* Background Mesh Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] h-[50%] rounded-full bg-indigo-900/20 blur-[120px] mix-blend-screen animate-pulse-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] h-[50%] rounded-full bg-cyan-900/20 blur-[120px] mix-blend-screen translate-x-10 translate-y-10" />
      </div>

      <div className="relative z-10">

        {/* Navigation */}
        <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center border-b border-slate-200 dark:border-white/5 backdrop-blur-sm sticky top-0 z-50 bg-white/80 dark:bg-[#0F172A]/80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Layers className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">Competitor AI</span>
          </div>
          <button onClick={onViewSample} className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white transition-colors">
            View Sample
          </button>
        </nav>

        {/* Hero Section */}
        <section className="relative pt-32 pb-40 px-6 overflow-visible">
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge removed: Enterprise API Access */}

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-6xl md:text-8xl font-black text-slate-900 dark:text-white tracking-tight mb-8 leading-[1.1]"
            >
              {user ? `Hi ${user.name}, ready to` : "Market Clarity,"} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-400 bg-[length:200%_auto] animate-gradient">
                {user ? "dominate your niche?" : "Absolute & Instant."}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed"
            >
              Stop guessing. Start winning. AI-powered competitor analysis that delivers
              strategic dominance in a single click.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
            >
              <button
                onClick={onStart}
                className="group relative w-full sm:w-auto px-10 py-5 bg-indigo-600 text-white rounded-full font-bold hover:scale-105 transition-all duration-300 shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2"
              >
                Analyze My Niche
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onViewSample}
                className="w-full sm:w-auto px-10 py-5 rounded-full font-bold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-indigo-500/10 transition-all duration-300 backdrop-blur-sm"
              >
                View Live Demo
              </button>
            </motion.div>
          </div>

          {/* Abstract Hero Visuals */}
          <motion.div style={{ y: y1 }} className="absolute top-20 right-[5%] -z-10 opacity-60">
            <div className="w-64 h-64 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl rotate-12 blur-3xl" />
          </motion.div>
          <motion.div style={{ y: y2 }} className="absolute bottom-20 left-[5%] -z-10 opacity-60">
            <div className="w-80 h-80 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-full blur-3xl" />
          </motion.div>
        </section>

        {/* Stats / Social Proof */}
        <section className="py-12 border-y border-slate-200 dark:border-white/5 bg-white/50 dark:bg-white/5 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: "Markets Analyzed", value: "10,000+" },
              { label: "Data Points", value: "5M+" },
              { label: "AI Accuracy", value: "99.8%" },
              { label: "Revenue Impact", value: "2.4x" }
            ].map((stat, i) => (
              <div key={i} className="space-y-1">
                <div className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
                <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">Intelligence, without the noise.</h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">We distill massive datasets into clear, actionable signals.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, i) => (
                <FadeIn key={i} delay={i * 0.1}>
                  <div className="group relative h-full p-8 rounded-3xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 hover:border-indigo-500/50 hover:shadow-xl dark:hover:bg-slate-800 transition-all duration-500 overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    <div className="relative z-10">
                      <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-[#0F172A] border border-indigo-100 dark:border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-sm">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{feature.title}</h3>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* Platform Capabilities Section */}
        <section className="py-24 px-6 bg-slate-50/50 dark:bg-[#0F172A]/50 backdrop-blur-sm border-t border-slate-200 dark:border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Platform Capabilities</h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Enterprise-grade architecture designed for mission-critical intelligence.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "Risk Assessment", desc: "Strategic identification of market threats and competitive pressure.", icon: <Shield size={20} className="text-rose-500" /> },
                { title: "Structured Analysis", desc: "High-fidelity report displays and professional PDF exports.", icon: <Layers size={20} className="text-indigo-500" /> },
                { title: "Dual-Theme Support", desc: "Seamless toggle between professional light and high-contrast dark modes.", icon: <Zap size={20} className="text-amber-500" /> },
                { title: "Contextual Redirects", desc: "Navbar logic that adapts to your current analysis stage.", icon: <CheckCircle2 size={20} className="text-emerald-500" /> },
                { title: "Input Validation", desc: "Pre-analysis data checks to ensure high-quality intelligence generation.", icon: <Search size={20} className="text-cyan-500" /> },
                { title: "Public Signal Analysis", desc: "Pure-reasoning logic based strictly on verifiable market data.", icon: <Globe size={20} className="text-blue-500" /> }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.02 }}
                  className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/30 transition-colors shadow-sm relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      {item.title === 'Dual-Theme Support' ? <Globe className="text-amber-500" size={20} /> : // Replacing placeholder icon
                        item.title === 'Contextual Redirects' ? <Layers className="text-emerald-500" size={20} /> :
                          item.icon}
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white">{item.title}</h3>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-32 bg-slate-50 dark:bg-[#0A101F] relative overflow-hidden">
          <div className="w-full relative z-10">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-20 text-center">How it works</h2>

            <div className="relative max-w-7xl mx-auto px-4">
              {/* Vertical Line */}
              <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 bg-gradient-to-b from-transparent via-indigo-500 to-transparent" />

              <div className="space-y-12">
                {timeline.map((item, i) => (
                  <FadeIn key={i} delay={i * 0.1}>
                    <div className={`relative flex items-center md:justify-center ${i % 2 === 0 ? 'md:flex-row-reverse' : ''
                      } group`}>

                      {/* Icon Bubble */}
                      <div className="absolute left-8 md:left-1/2 -translate-x-1/2 flex items-center justify-center w-12 h-12 rounded-full border-4 border-slate-50 dark:border-[#0A101F] bg-indigo-600 text-white font-bold z-10 shadow-lg shadow-indigo-500/30">
                        {item.step}
                      </div>

                      {/* Content Card */}
                      <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-8 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 shadow-sm hover:border-indigo-500/30 hover:shadow-md transition-all backdrop-blur-sm ml-20 md:ml-0 ${i % 2 === 0 ? 'md:mr-auto' : 'md:ml-auto'
                        }`}>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                        <p className="text-slate-600 dark:text-slate-400">{item.desc}</p>
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 text-center px-6">
          <div className="max-w-4xl mx-auto relative">
            <div className="absolute inset-0 bg-indigo-500/20 blur-[100px] rounded-full pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white mb-8">Ready to dominate?</h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 mb-12">Join thousands of businesses making smarter, data-driven decisions today.</p>
              <button
                onClick={onStart}
                className="px-12 py-6 bg-indigo-600 hover:bg-indigo-500 text-white text-lg font-bold rounded-full shadow-[0_0_50px_rgba(79,70,229,0.5)] hover:shadow-[0_0_70px_rgba(79,70,229,0.7)] hover:scale-105 transition-all duration-300"
              >
                Start Analysis Now
              </button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
