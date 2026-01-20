import React from 'react';
import { Activity } from 'lucide-react';

const LoadingScreen = () => {
    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-50 dark:bg-black transition-colors duration-300">
            {/* Abstract Background Blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-500/20 blur-[100px] opacity-70 animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-violet-500/20 blur-[100px] opacity-70 animate-pulse delay-700"></div>
            </div>

            <div className="relative z-10 flex flex-col items-center animate-fade-in">
                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-indigo-500/30 blur-xl rounded-full animate-pulse"></div>
                    <div className="relative bg-white dark:bg-zinc-900 p-4 rounded-2xl shadow-xl shadow-indigo-500/20 border border-slate-100 dark:border-zinc-800">
                        <Activity className="w-12 h-12 text-indigo-600 dark:text-indigo-400 animate-bounce" strokeWidth={2.5} />
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
                    RoutineTracker
                </h2>
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-[bounce_1s_infinite_0ms]"></div>
                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-[bounce_1s_infinite_200ms]"></div>
                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-[bounce_1s_infinite_400ms]"></div>
                </div>
            </div>
        </div>
    );
};

export default LoadingScreen;
