import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User, Mail, ArrowRight, Activity } from 'lucide-react';
import ThemeControl from '../../components/ui/ThemeControl';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const result = await register(username, email, password);
        if (result.success) {
            navigate('/');
        } else {
            setError(result.error);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#f8fafc] dark:bg-[#000000] text-slate-900 dark:text-white transition-colors duration-300 px-4 relative overflow-hidden">
            {/* Abstract Background Blobs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-500/20 blur-[100px] opacity-70 animate-pulse"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-violet-500/20 blur-[100px] opacity-70 animate-pulse delay-700"></div>
            </div>

            <div className="absolute top-4 right-4 z-50"><ThemeControl /></div>

            <div className="w-full max-w-md relative z-10 animate-scale-in">
                <div className="glass-card p-8 rounded-3xl shadow-2xl shadow-indigo-500/10 border border-white/60 dark:border-white/10 backdrop-blur-xl bg-white/70 dark:bg-zinc-900/70">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <Activity className="mx-auto text-indigo-600 dark:text-indigo-400 mb-4" size={40} />
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Create Account
                        </h1>
                        <p className="text-slate-500 dark:text-zinc-400 mt-1">
                            Join RoutineTracker today
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-3 rounded-lg mb-6 text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="group">
                            <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-1.5 ml-1">
                                Username
                            </label>
                            <div className="relative">
                                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                <input
                                    type="text"
                                    className="input-field pl-11 h-12 bg-white/50 dark:bg-black/50 border-slate-200 dark:border-zinc-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Choose a username"
                                    required
                                />
                            </div>
                        </div>

                        <div className="group">
                            <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-1.5 ml-1">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                <input
                                    type="email"
                                    className="input-field pl-11 h-12 bg-white/50 dark:bg-black/50 border-slate-200 dark:border-zinc-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div>

                        <div className="group">
                            <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-1.5 ml-1">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                <input
                                    type="password"
                                    className="input-field pl-11 h-12 bg-white/50 dark:bg-black/50 border-slate-200 dark:border-zinc-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Create a password"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 mt-4"
                        >
                            Create Account
                            <ArrowRight size={20} />
                        </button>
                    </form>

                    <div className="mt-6 text-center pt-6 border-t border-slate-100 dark:border-zinc-800">
                        <span className="text-slate-500 dark:text-zinc-500 text-sm">Already have an account? </span>
                        <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline text-sm">
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
