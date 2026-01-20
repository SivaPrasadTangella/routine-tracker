import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { format, addDays, isSameDay, parseISO, isValid } from 'date-fns';
import { ChevronLeft, ChevronRight, Check, Plus, Calendar as CalendarIcon, X } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useRoutine } from '../../context/RoutineContext';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';
import RadialProgressCard from './RadialProgressCard';

const Dashboard = () => {
    const { routines, logs, toggleLog } = useRoutine();
    const { user } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();

    // Initialize date from URL or default to today
    const dateParam = searchParams.get('date');
    let selectedDate = new Date();
    if (dateParam) {
        const parsedDate = parseISO(dateParam);
        if (isValid(parsedDate)) {
            selectedDate = parsedDate;
        }
    }

    // Temporary: Test Error Boundary
    // if (Math.random() > 0.5) throw new Error("Test Error Boundary");
    const [filter, setFilter] = useState('all'); // 'all', 'pending', 'completed'
    const [sortBy, setSortBy] = useState('priority'); // 'priority', 'name'

    // Format date for storage key (YYYY-MM-DD)
    const dateKey = format(selectedDate, 'yyyy-MM-dd');

    const handleDateChange = (days) => {
        const newDate = addDays(selectedDate, days);
        setSearchParams({ date: format(newDate, 'yyyy-MM-dd') }, { replace: true });
    };

    const getDayProgress = () => {
        if (routines.length === 0) return 0;
        const completed = routines.filter(r => logs[dateKey]?.[r.id]).length;
        return Math.round((completed / routines.length) * 100);
    };

    const completedCount = routines.filter(r => logs[dateKey]?.[r.id]).length;
    const pendingCount = routines.length - completedCount;

    const pieData = [
        { name: 'Done', value: completedCount },
        { name: 'Pending', value: pendingCount },
    ];

    const COLORS = ['#6366f1', '#e2e8f0']; // Indigo-400, Slate-200

    // Filter and Sort Logic
    const filteredRoutines = routines.filter(routine => {
        const isCompleted = logs[dateKey]?.[routine.id];
        if (filter === 'pending') return !isCompleted;
        if (filter === 'completed') return isCompleted;
        return true;
    });

    const sortedRoutines = [...filteredRoutines].sort((a, b) => {
        const isCompletedA = logs[dateKey]?.[a.id];
        const isCompletedB = logs[dateKey]?.[b.id];

        if (sortBy === 'priority') {
            // Pending first
            if (isCompletedA === isCompletedB) return 0;
            return isCompletedA ? 1 : -1;
        }
        return a.name.localeCompare(b.name);
    });

    return (
        <div className="space-y-8 animate-fade-in max-w-5xl mx-auto pb-10">
            {/* Header & Date Navigation */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div onClick={() => setSearchParams({})} className="cursor-pointer group">
                    <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-2 drop-shadow-sm group-hover:opacity-80 transition-opacity">
                        {isSameDay(selectedDate, new Date()) ? (
                            <>Hello, <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-gradient-x">
                                {user?.username || 'User'}
                            </span>
                            </>
                        ) : (
                            format(selectedDate, 'EEEE')
                        )}
                    </h1>
                    <p className="text-slate-500 dark:text-zinc-400 font-bold text-lg tracking-wide group-hover:text-indigo-500 transition-colors">{format(selectedDate, 'MMMM do, yyyy')}</p>
                </div>

                <div className="flex items-center gap-1 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md border border-slate-200/60 dark:border-zinc-800 p-1.5 rounded-2xl shadow-sm self-start md:self-auto">
                    <Button variant="ghost" size="icon" onClick={() => handleDateChange(-1)} className="h-9 w-9 hover:bg-white dark:hover:bg-zinc-800 rounded-xl">
                        <ChevronLeft size={18} />
                    </Button>
                    <div className="flex items-center px-4 min-w-[130px] justify-center font-bold text-sm text-slate-700 dark:text-zinc-200">
                        <CalendarIcon size={16} className="mr-2 text-indigo-500" />
                        {format(selectedDate, 'MMM dd')}
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleDateChange(1)} disabled={isSameDay(selectedDate, new Date())} className="h-9 w-9 hover:bg-white dark:hover:bg-zinc-800 rounded-xl disabled:opacity-30">
                        <ChevronRight size={18} />
                    </Button>
                </div>
            </div>

            {/* Analytics Section */}
            <div className="grid gap-6 md:grid-cols-2">
                <RadialProgressCard progress={getDayProgress()} />

                {/* Pie Chart Card */}
                {/* Pie Chart Card */}
                <div className="glass-card p-8 flex flex-col items-center justify-center relative overflow-hidden group">
                    {/* Decorative gradient background */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>

                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2 self-start w-full flex justify-between items-center z-10">
                        Daily Overview
                        {routines.length > 0 && (
                            <span className="text-xs font-medium px-2 py-1 bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 rounded-lg">
                                {Math.round((completedCount / routines.length) * 100)}% Done
                            </span>
                        )}
                    </h3>

                    <div className="flex-1 w-full min-h-[220px] relative z-10">
                        {routines.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={85}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                        animationDuration={1000}
                                    >
                                        <Cell key="completed" fill="#6366f1" />
                                        <Cell key="pending" fill="#e2e8f0" className="dark:fill-zinc-800" />
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-zinc-500 opacity-60">
                                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
                                    <Plus className="w-8 h-8 text-slate-300" />
                                </div>
                                <span className="text-sm font-medium">No routines scheduled</span>
                            </div>
                        )}
                        {/* Center Text */}
                        {routines.length > 0 && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col pb-8">
                                <span className="text-4xl font-black text-slate-900 dark:text-white">{completedCount}</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Done</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Filters & Sort */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 sticky top-0 z-20 py-4 mb-2">
                {/* Glass Filter Tabs */}
                <div className="flex items-center p-1.5 rounded-2xl bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-white/20 dark:border-white/5 shadow-lg shadow-indigo-500/5">
                    {['all', 'pending', 'completed'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={cn(
                                "px-5 py-2.5 rounded-xl text-xs font-bold capitalize transition-all duration-300 relative overflow-hidden",
                                filter === f
                                    ? "text-indigo-600 dark:text-indigo-300 bg-white/80 dark:bg-white/10 shadow-sm"
                                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-white/20"
                            )}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-3 bg-white/40 dark:bg-black/40 backdrop-blur-xl p-1.5 rounded-2xl border border-white/20 dark:border-white/5 shadow-lg shadow-indigo-500/5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3">Sort</span>
                    <div className="flex bg-white/50 dark:bg-white/5 rounded-xl p-1">
                        {['priority', 'name'].map(s => (
                            <button
                                key={s}
                                onClick={() => setSortBy(s)}
                                className={cn(
                                    "px-4 py-1.5 rounded-lg text-[10px] font-bold capitalize transition-all duration-200",
                                    sortBy === s
                                        ? "bg-indigo-500 text-white shadow-md shadow-indigo-500/20"
                                        : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-zinc-200"
                                )}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Routine List */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {sortedRoutines.map((routine) => {
                    const isCompleted = logs[dateKey]?.[routine.id];

                    return (
                        <div
                            key={routine.id}
                            onClick={() => toggleLog(dateKey, routine.id)}
                            className={cn(
                                "relative p-6 rounded-2xl border transition-all duration-300 cursor-pointer group glass-card",
                                isCompleted
                                    ? "bg-slate-50/50 dark:bg-white/5 border-transparent opacity-50 hover:opacity-80 scale-[0.98]"
                                    : "hover-lift border-white/60 dark:border-white/5 bg-white/60 dark:bg-zinc-900/60"
                            )}
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex-1 min-w-0 pr-4">
                                    <h3 className={cn(
                                        "font-bold text-lg truncate transition-colors",
                                        isCompleted ? "text-slate-500 line-through" : "text-slate-900 dark:text-white"
                                    )}>
                                        {routine.name}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-2">
                                        {routine.priority && (
                                            <span className={cn(
                                                "text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider",
                                                routine.priority >= 4 ? "bg-red-50 text-red-600 border border-red-100/50" :
                                                    routine.priority === 1 ? "bg-emerald-50 text-emerald-600 border border-emerald-100/50" :
                                                        "bg-indigo-50 text-indigo-600 border border-indigo-100/50"
                                            )}>
                                                {routine.priority === 5 ? 'Urgent' : routine.priority === 1 ? 'Low' : 'Important'}
                                            </span>
                                        )}
                                        <span className={cn(
                                            "text-[10px] font-medium transition-colors",
                                            isCompleted ? "text-slate-400" : "text-slate-500 dark:text-zinc-500 group-hover:text-indigo-500"
                                        )}>
                                            {isCompleted ? "Completed" : "Tap to complete"}
                                        </span>
                                    </div>
                                </div>

                                <div className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm",
                                    isCompleted
                                        ? "bg-green-500 text-white scale-110 shadow-green-500/30"
                                        : "bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-transparent group-hover:border-indigo-400"
                                )}>
                                    <Check size={16} strokeWidth={4} />
                                </div>
                            </div>

                            <button
                                onClick={(e) => { e.stopPropagation(); deleteRoutine(routine.id); }}
                                className="absolute -top-2 -right-2 p-2 bg-white dark:bg-zinc-800 rounded-full shadow-lg text-slate-300 opacity-0 group-hover:opacity-100 hover:text-red-500 hover:scale-110 transition-all duration-200"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default Dashboard;
