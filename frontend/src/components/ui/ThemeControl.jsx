import React, { useContext, useState, useRef, useEffect } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { Sun, Moon, Monitor, Check } from 'lucide-react';
import { cn } from '../../lib/utils';

const ThemeControl = () => {
    const { theme, setTheme } = useContext(ThemeContext);

    const toggleTheme = () => {
        if (theme === 'light') setTheme('dark');
        else if (theme === 'dark') setTheme('system');
        else setTheme('light');
    };

    const icons = {
        light: Sun,
        dark: Moon,
        system: Monitor
    };

    const Icon = icons[theme] || Monitor;

    return (
        <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 shadow-sm border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all text-slate-600 dark:text-zinc-400 group"
            title={`Current: ${theme}. Click to toggle.`}
        >
            <Icon size={18} className="group-active:scale-90 transition-transform" />
        </button>
    );
};

export default ThemeControl;
