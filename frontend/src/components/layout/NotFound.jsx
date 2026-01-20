import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, Home, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/Button';

const NotFound = () => {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-50/50 via-purple-50/50 to-pink-50/50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
            <div className="glass-card max-w-lg w-full p-8 md:p-12 text-center rounded-3xl border border-white/60 dark:border-white/5 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-2xl shadow-xl shadow-slate-200/50 dark:shadow-none animate-fade-in relative overflow-hidden">

                {/* Decorative background elements */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center">
                    <div className="w-24 h-24 rounded-3xl bg-slate-50 dark:bg-zinc-800/50 flex items-center justify-center mb-6 shadow-inner border border-slate-100 dark:border-white/5">
                        <FileQuestion size={48} className="text-indigo-500 dark:text-indigo-400" />
                    </div>

                    <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 mb-2">404</h1>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Page Not Found</h2>

                    <p className="text-slate-500 dark:text-zinc-400 mb-8 max-w-sm mx-auto leading-relaxed">
                        Oops! The page you are looking for seems to have wandered off or doesn't exist anymore.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        <Link to="/">
                            <Button className="w-full sm:w-auto gap-2 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:bg-indigo-500 hover:-translate-y-0.5 transition-all duration-300">
                                <Home size={18} />
                                Back to Home
                            </Button>
                        </Link>
                        <Button
                            variant="outline"
                            onClick={() => window.history.back()}
                            className="w-full sm:w-auto gap-2"
                        >
                            <ArrowLeft size={18} />
                            Go Back
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
