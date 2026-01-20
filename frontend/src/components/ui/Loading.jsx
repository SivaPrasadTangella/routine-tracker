import React from 'react';
import { Activity } from 'lucide-react';

const Loading = ({ fullScreen = true, message = 'Loading...' }) => {
    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-slate-50 dark:bg-zinc-950 flex flex-col items-center justify-center z-50 transition-colors duration-300">
                <div className="relative">
                    <div className="w-16 h-16 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-2xl flex items-center justify-center animate-pulse">
                        <Activity className="text-indigo-600 dark:text-indigo-400 animate-bounce" size={32} />
                    </div>
                    <div className="absolute inset-0 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-2xl animate-ping opacity-75"></div>
                </div>
                <h2 className="mt-8 text-xl font-bold text-slate-700 dark:text-zinc-300 tracking-tight animate-pulse">
                    {message}
                </h2>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center p-8">
            <Activity className="text-indigo-500 animate-spin" size={24} />
        </div>
    );
};

export default Loading;
