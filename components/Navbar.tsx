
import React from 'react';
import { useTheme } from './ThemeContext';
import { Sun, Moon, ShieldCheck, Plus, Home, LogOut } from 'lucide-react';


import { User } from '../types';

interface NavbarProps {
  onReset: () => void;
  onAnalyze: () => void;
  onToggleHistory: () => void;
  onLogin: () => void;
  onLogout: () => void;
  onRegister: () => void;
  onFeatures: () => void;
  onProfile: () => void;
  user: User | null;
  appState: 'landing' | 'input' | 'analyzing' | 'report' | 'discovery' | 'login' | 'register' | 'features' | 'profile';
}

export const Navbar: React.FC<NavbarProps> = ({ onReset, onAnalyze, onToggleHistory, onLogin, onLogout, onRegister, onFeatures, onProfile, user, appState }) => {
  const { theme, toggleTheme } = useTheme();

  const handleFeaturesScroll = () => {
    const el = document.getElementById('features');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    else onReset(); // Go home if not on landing
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 no-print transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo Area */}
        <div
          className="flex items-center gap-2 cursor-pointer group"
          onClick={onReset}
        >
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white group-hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/20">
            <ShieldCheck size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white hidden sm:block">
            Competitor <span className="text-indigo-600">AI</span>
          </span>
        </div>

        {/* Center Navigation */}
        <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-900 rounded-full px-2 py-1 border border-slate-200 dark:border-slate-800">
          <button
            onClick={onReset}
            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Home
          </button>
          <button
            onClick={onFeatures}
            className={`px-4 py-2 text-sm font-medium transition-colors rounded-full ${appState === 'features' ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'}`}
          >
            Features
          </button>
          <button
            onClick={onAnalyze}
            className={`px-4 py-2 text-sm font-medium transition-colors rounded-full ${['discovery', 'input'].includes(appState)
              ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
          >
            Analyze My Niche
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {user && (
            <button
              onClick={onToggleHistory}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Home size={18} className="md:hidden" />
              <span className="hidden md:inline">History</span>
            </button>
          )}

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1" />

          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400"
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
            {user ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={onProfile}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-sm ring-2 ring-white dark:ring-slate-900">
                    {user.name.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{user.name.split(' ')[0]}</span>
                </button>

                <button
                  onClick={onLogout}
                  className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                  title="Sign Out"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={onLogin}
                  className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={onRegister}
                  className="px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 rounded-full shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all hover:scale-105"
                >
                  Join Now
                </button>
              </>
            )}
          </div>

          <button
            onClick={onAnalyze}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
};
