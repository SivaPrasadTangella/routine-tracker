import React, { useEffect, useState } from 'react';

const getWeekProgress = () => {
    const now = new Date();
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    // Adjust to Monday start
    const day = start.getDay();
    const diff = (day === 0 ? 6 : day - 1);
    start.setDate(start.getDate() - diff);

    const end = new Date(start);
    end.setDate(end.getDate() + 7);

    const elapsed = now - start;
    const total = end - start;
    return Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)));
};

const WeeklyProgressBar = () => {
    const [progress, setProgress] = useState(getWeekProgress());

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(getWeekProgress());
        }, 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full mb-8">
            <div className="flex justify-between items-center mb-2 px-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">Weekly Cycle</span>
                <span className="text-xs font-bold text-teal-600 dark:text-teal-400">{progress}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-zinc-700/50 rounded-full h-3 p-[2px] shadow-inner">
                <div
                    className="h-full rounded-full bg-gradient-to-r from-teal-400 to-indigo-500 shadow-[0_0_12px_rgba(45,212,191,0.5)] transition-all duration-1000 ease-out relative"
                    style={{ width: `${progress}%` }}
                >
                    <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
                </div>
            </div>
        </div>
    );
};

export default WeeklyProgressBar;
