
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowLeft, Video, Building, ShoppingBag, CreditCard, ChevronRight, ArrowRight, Leaf, Sparkles, UtensilsCrossed, Sprout, Wallet, Sun, Truck, Palette } from 'lucide-react';
import { BusinessInfo } from '../types';

interface DiscoveryViewProps {
    onSelect: (info: BusinessInfo) => void;
    onSkip: () => void;
    onBack: () => void;
}

const NICHES = [
    {
        category: "Eco-Friendly Packaging",
        example: "EcoWare",
        description: "Capitalizing on plastic bans by manufacturing biodegradable paper bags, jute fabrics, and plant-based disposables.",
        icon: <Leaf className="text-emerald-400" size={32} />,
        gradient: "from-emerald-500/20 to-green-500/20",
        data: {
            name: "EcoWare",
            website: "https://ecoware.in",
            niche: "Eco-Friendly Packaging",
            region: "India"
        }
    },
    {
        category: "D2C Personal Care",
        example: "Mamaearth",
        description: "Building direct-to-consumer Ayurvedic and herbal beauty brands leveraging India's rich traditional wellness heritage.",
        icon: <Sparkles className="text-pink-400" size={32} />,
        gradient: "from-pink-500/20 to-rose-500/20",
        data: {
            name: "Mamaearth",
            website: "https://mamaearth.in",
            niche: "D2C Personal Care",
            region: "India"
        }
    },
    {
        category: "Cloud Kitchens & Food Tech",
        example: "Rebel Foods",
        description: "Smart, low-overhead food delivery units serving regional delicacies and home-cooked meals through digital platforms.",
        icon: <UtensilsCrossed className="text-orange-400" size={32} />,
        gradient: "from-orange-500/20 to-red-500/20",
        data: {
            name: "Rebel Foods",
            website: "https://rebelfoods.com",
            niche: "Cloud Kitchens",
            region: "India"
        }
    },
    {
        category: "Organic Agri-Exports",
        example: "Organic India",
        description: "Connecting local organic farmers to global markets for high-demand products like cashews, honey, and millet-based snacks.",
        icon: <Sprout className="text-lime-400" size={32} />,
        gradient: "from-lime-500/20 to-green-500/20",
        data: {
            name: "Organic India",
            website: "https://organicindia.com",
            niche: "Organic Agri-Exports",
            region: "Global"
        }
    },
    {
        category: "FinTech & Digital Payments",
        example: "BharatPe",
        description: "Providing secure payment infrastructure and credit-access tools for small-scale merchants and rural businesses.",
        icon: <Wallet className="text-blue-400" size={32} />,
        gradient: "from-blue-500/20 to-indigo-500/20",
        data: {
            name: "BharatPe",
            website: "https://bharatpe.com",
            niche: "FinTech & Digital Payments",
            region: "India"
        }
    },
    {
        category: "Renewable Energy (Solar)",
        example: "Loom Solar",
        description: "Assembling and installing localized solar panels and energy-saving LED systems for the growing green-energy market.",
        icon: <Sun className="text-yellow-400" size={32} />,
        gradient: "from-yellow-500/20 to-amber-500/20",
        data: {
            name: "Loom Solar",
            website: "https://loomsolar.com",
            niche: "Renewable Energy",
            region: "India"
        }
    },
    {
        category: "Logistics & Courier Services",
        example: "Delhivery",
        description: "Enabling year-round business through efficient last-mile delivery and digitally connected fulfillment centers.",
        icon: <Truck className="text-cyan-400" size={32} />,
        gradient: "from-cyan-500/20 to-sky-500/20",
        data: {
            name: "Delhivery",
            website: "https://delhivery.com",
            niche: "Logistics Services",
            region: "India"
        }
    },
    {
        category: "Handicrafts E-commerce",
        example: "iTokri",
        description: "Digitizing traditional Indian crafts and connecting rural artisans directly to urban and global luxury shoppers.",
        icon: <Palette className="text-purple-400" size={32} />,
        gradient: "from-purple-500/20 to-fuchsia-500/20",
        data: {
            name: "iTokri",
            website: "https://itokri.com",
            niche: "Handicrafts E-commerce",
            region: "Global"
        }
    }
];

const Card: React.FC<{ item: typeof NICHES[0]; delay: number; onClick: () => void }> = ({ item, delay, onClick }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay }}
            onClick={onClick}
            className="group cursor-pointer relative p-8 rounded-3xl bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-white/10 hover:border-indigo-500/50 hover:shadow-xl dark:hover:bg-slate-800/80 transition-all duration-300 backdrop-blur-sm overflow-hidden flex flex-col h-full"
        >
            <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

            <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                    <div className="p-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 group-hover:scale-110 transition-transform duration-300">
                        {item.icon}
                    </div>
                    <div className="px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 text-xs font-semibold text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/5 group-hover:border-indigo-200 dark:group-hover:border-white/20 transition-colors">
                        Ex: {item.example}
                    </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                    {item.category}
                </h3>

                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6 group-hover:text-slate-900 dark:group-hover:text-slate-300 transition-colors flex-grow">
                    {item.description}
                </p>

                <div className="flex items-center text-indigo-400 font-semibold text-sm group-hover:translate-x-1 transition-transform mt-auto">
                    Start Analysis <ChevronRight size={16} className="ml-1" />
                </div>
            </div>
        </motion.div>
    );
};

export const DiscoveryView: React.FC<DiscoveryViewProps> = ({ onSelect, onSkip, onBack }) => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0F172A] pt-32 pb-20 px-6 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 relative">
                    <button
                        onClick={onBack}
                        className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-2 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-white transition-colors text-sm font-medium"
                    >
                        <ArrowLeft size={20} /> <span className="hidden sm:inline">Back</span>
                    </button>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6"
                    >
                        Indian MSME Growth Engines
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto"
                    >
                        Select a high-potential sector to generate a tailored strategic roadmap.
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {NICHES.map((niche, i) => (
                        <Card
                            key={i}
                            item={niche}
                            delay={i * 0.05}
                            onClick={() => onSelect(niche.data)}
                        />
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-center"
                >
                    <button
                        onClick={onSkip}
                        className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors font-medium text-lg px-8 py-4 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent hover:border-slate-200 dark:hover:border-white/10"
                    >
                        Skip to Manual Entry <ArrowRight size={20} />
                    </button>
                </motion.div>
            </div>
        </div>
    );
};
