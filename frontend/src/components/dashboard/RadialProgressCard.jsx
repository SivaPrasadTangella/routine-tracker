import React from 'react';

// Simple circular progress component using SVG
const RadialProgressCard = ({ progress }) => {
    const size = 160;
    const strokeWidth = 12;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <div className="glass-card p-6 flex flex-col items-center justify-center text-center relative overflow-hidden group">
            {/* Decorative gradient background */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -ml-16 -mt-16 pointer-events-none group-hover:bg-indigo-500/20 transition-all duration-700"></div>

            <div className="relative z-10" style={{ width: size, height: size }}>
                <svg width={size} height={size} className="transform -rotate-90">
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={strokeWidth}
                        className="text-slate-100 dark:text-white/5"
                    />
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        style={{ strokeDashoffset: offset }}
                        strokeLinecap="round"
                        className="text-indigo-600 dark:text-indigo-500 transition-all duration-1000 ease-out"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{Math.round(progress)}%</span>
                </div>
            </div>
            <p className="mt-4 text-sm font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest">Daily Progress</p>
        </div>
    );
};

export default RadialProgressCard;
