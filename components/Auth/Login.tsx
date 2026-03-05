import React, { useState } from 'react';
import { Mail, Lock, Loader2, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { AuthLayout } from './AuthLayout';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth, actionCodeSettings } from '../../src/firebase';

interface LoginProps {
    onRegister: () => void;
    onLoginSuccess: (user: { name: string, email: string }) => void;
    onBack: () => void;
}

export const Login: React.FC<LoginProps> = ({ onRegister, onLoginSuccess, onBack }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    // Reset Password State
    const [isResetMode, setIsResetMode] = useState(false);
    const [resetSuccess, setResetSuccess] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            // Name might be null if not set, but we set it on register. Fallback to email prefix.
            const displayName = user.displayName || email.split('@')[0];

            onLoginSuccess({ name: displayName, email: email });
        } catch (err: any) {
            console.error("Login Error:", err);
            let msg = "Login failed. Please check your credentials.";
            if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
                msg = "Email not registered or incorrect password.";
            } else if (err.code === 'auth/wrong-password') {
                msg = "Incorrect password.";
            } else if (err.code === 'auth/invalid-email') {
                msg = "Invalid email format.";
            }
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setResetSuccess(false);

        try {
            await sendPasswordResetEmail(auth, email, actionCodeSettings);
            setResetSuccess(true);
        } catch (err: any) {
            console.error("Reset Code:", err.code, "Message:", err.message);
            let msg = "Failed to send reset email. Please try again.";
            if (err.code === 'auth/user-not-found') {
                msg = "No account found with this email.";
            } else if (err.code === 'auth/invalid-email') {
                msg = "Please enter a valid email address.";
            }
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    if (isResetMode) {
        return (
            <AuthLayout>
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Reset Password</h2>
                    <p className="text-slate-400">Enter your email to receive recovery instructions.</p>
                </div>

                {resetSuccess ? (
                    <div className="text-center space-y-6">
                        <div className="flex justify-center">
                            <div className="p-4 bg-green-500/10 rounded-full text-green-500">
                                <CheckCircle size={48} />
                            </div>
                        </div>
                        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
                            <p className="text-white font-medium">Reset link sent!</p>
                            <p className="text-sm text-slate-400 mt-1">Check your inbox at <span className="text-indigo-400">{email}</span></p>
                        </div>
                        <button
                            onClick={() => setIsResetMode(false)}
                            className="text-slate-400 hover:text-white transition-colors text-sm font-medium"
                        >
                            Return to Sign In
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handlePasswordReset} className="space-y-6">
                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <label htmlFor="reset-email" className="block text-sm font-medium text-slate-400">Email Address</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                                    <Mail size={20} />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-12 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                    placeholder="name@company.com"
                                    id="reset-email"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? <Loader2 className="animate-spin" /> : "Send Reset Link"}
                        </button>

                        <div className="text-center">
                            <button
                                type="button"
                                onClick={() => setIsResetMode(false)}
                                className="text-sm text-slate-500 hover:text-slate-400 flex items-center justify-center gap-2 mx-auto"
                            >
                                <ArrowLeft size={14} /> Back to Login
                            </button>
                        </div>
                    </form>
                )}
            </AuthLayout>
        );
    }

    return (
        <AuthLayout>
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Welcome Back</h2>
                <p className="text-slate-400">Sign in to access your intelligence dashboard.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
                {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
                        {error}
                    </div>
                )}
                <div className="space-y-4">
                    {/* Email Input */}
                    <div className="space-y-2">
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-slate-400"
                        >
                            Email Address
                        </label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 transition-colors">
                                <Mail size={20} />
                            </div>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-12 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                placeholder="name@company.com"
                                id="email"
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-slate-400"
                            >
                                Password
                            </label>
                            <button
                                type="button"
                                onClick={() => setIsResetMode(true)}
                                className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                            >
                                Forgot Password?
                            </button>
                        </div>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 transition-colors">
                                <Lock size={20} />
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-12 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                placeholder="••••••••"
                                id="password"
                            />
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <Loader2 className="animate-spin" />
                    ) : (
                        <>
                            Sign In <ArrowRight size={18} />
                        </>
                    )}
                </button>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-transparent text-slate-500 bg-slate-950/50 backdrop-blur">Or continue with</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Google Button */}
                    <button type="button" className="relative group overflow-hidden border border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-white rounded-xl py-2.5 transition-all">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:animate-shimmer" />
                        Google
                    </button>
                    {/* GitHub Button */}
                    <button type="button" className="relative group overflow-hidden border border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-white rounded-xl py-2.5 transition-all">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:animate-shimmer" />
                        GitHub
                    </button>
                </div>

                <div className="text-center text-sm text-slate-400">
                    Don't have an account?{' '}
                    <button onClick={onRegister} className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                        Join Now
                    </button>
                </div>
            </form>

            <div className="mt-8 text-center">
                <button onClick={onBack} className="text-xs text-slate-500 hover:text-slate-400">Back to Home</button>
            </div>
        </AuthLayout>
    );
};
