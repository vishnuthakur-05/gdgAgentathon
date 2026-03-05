import React, { useState } from 'react';
import { Mail, Lock, User, Loader2, ArrowRight, CheckCircle } from 'lucide-react';
import { AuthLayout } from './AuthLayout';
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../src/firebase';

interface RegisterProps {
    onLogin: () => void;
    onRegisterSuccess: (user: { name: string, email: string }) => void;
    onBack: () => void;
}

export const Register: React.FC<RegisterProps> = ({ onLogin, onRegisterSuccess, onBack }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Password Strength Logic
    const getStrength = (pass: string) => {
        let score = 0;
        if (pass.length > 5) score++;
        if (pass.length > 8) score++;
        if (/[A-Z]/.test(pass)) score++;
        if (/[0-9]/.test(pass)) score++;
        if (/[^A-Za-z0-9]/.test(pass)) score++;
        return score;
    };

    const strength = getStrength(password);
    const strengthColor =
        strength <= 2 ? 'bg-red-500' :
            strength <= 4 ? 'bg-amber-500' :
                'bg-indigo-500';

    const strengthWidth = `${(strength / 5) * 100}%`;

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Update Auth Profile
            await updateProfile(user, {
                displayName: name
            });

            // Save to Firestore
            await setDoc(doc(db, "users", user.uid), {
                name: name,
                email: email,
                createdAt: new Date().toISOString()
            });

            // Send Verification Email
            await sendEmailVerification(user);

            setSuccess(true);

            // Wait slightly before auto-login/redirect is handled by parent, 
            // OR we just stay here and let user click 'Continue' which calls onRegisterSuccess
        } catch (err: any) {
            console.error("Registration Code:", err.code, "Message:", err.message);
            let msg = "Registration failed. Please try again.";
            if (err.code === 'auth/email-already-in-use') {
                msg = "This email is already registered. Try signing in.";
            } else if (err.code === 'auth/weak-password') {
                msg = "Password should be at least 6 characters.";
            } else if (err.code === 'auth/invalid-email') {
                msg = "Please enter a valid email address.";
            }
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <AuthLayout>
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Account Created</h2>
                    <p className="text-slate-400">Welcome to Competitor AI.</p>
                </div>

                <div className="text-center space-y-6">
                    <div className="flex justify-center">
                        <div className="p-4 bg-green-500/10 rounded-full text-green-500">
                            <CheckCircle size={48} />
                        </div>
                    </div>
                    <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
                        <p className="text-white font-medium">Verification email sent!</p>
                        <p className="text-sm text-slate-400 mt-1">We've sent a link to <span className="text-indigo-400">{email}</span></p>
                        <p className="text-xs text-slate-500 mt-2">Please verify your email to access all features.</p>
                    </div>
                    <button
                        onClick={() => onRegisterSuccess({ name, email })}
                        className="w-full bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2"
                    >
                        Continue to Dashboard <ArrowRight size={18} />
                    </button>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout>
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Create Account</h2>
                <p className="text-slate-400">Join thousands of businesses mastering their market.</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-5">
                {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
                        {error}
                    </div>
                )}

                {/* Name Input */}
                <div className="space-y-2">
                    <label
                        htmlFor="name"
                        className="block text-sm font-medium text-slate-400"
                    >
                        Full Name
                    </label>
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 transition-colors">
                            <User size={20} />
                        </div>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-12 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                            placeholder="John Doe"
                            id="name"
                        />
                    </div>
                </div>

                {/* Email Input */}
                <div className="space-y-2">
                    <label
                        htmlFor="register-email"
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
                            id="register-email"
                        />
                    </div>
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                    <div className="space-y-2">
                        <label
                            htmlFor="register-password"
                            className="block text-sm font-medium text-slate-400"
                        >
                            Create Password
                        </label>
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
                                placeholder="Min. 8 characters"
                                id="register-password"
                            />
                        </div>
                    </div>

                    {/* Strength Meter */}
                    <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className={`h-full transition-all duration-500 ${strengthColor}`}
                            style={{ width: strengthWidth }}
                        />
                    </div>
                    <div className="flex justify-between text-xs text-slate-500">
                        <span>Weak</span>
                        <span>Strong</span>
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
                            Create Account <ArrowRight size={18} />
                        </>
                    )}
                </button>

                <div className="text-center text-sm text-slate-400">
                    Already have an account?{' '}
                    <button onClick={onLogin} className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                        Sign In
                    </button>
                </div>
            </form>

            <div className="mt-8 text-center">
                <button onClick={onBack} className="text-xs text-slate-500 hover:text-slate-400">Back to Home</button>
            </div>
        </AuthLayout>
    );
};
