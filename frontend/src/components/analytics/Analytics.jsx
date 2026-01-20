import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoutine } from '../../context/RoutineContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, TrendingUp, Award, Activity, PieChart as PieChartIcon, BarChart3, RefreshCcw } from 'lucide-react';
import {
    subDays, format, startOfWeek, endOfWeek, addDays,
    subMonths, addMonths, startOfMonth, endOfMonth, eachDayOfInterval,
    subYears, addYears, startOfYear, endOfYear, eachMonthOfInterval
} from 'date-fns';
import { cn } from '../../lib/utils';

const Analytics = () => {
    const { routines, logs, resetAllHistory } = useRoutine();
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState('week'); // 'week', 'month', 'year'
    const [chartType, setChartType] = useState('pie'); // 'pie' or 'bar'
    const [currentDate, setCurrentDate] = useState(new Date());

    // Navigation Handlers
    const handlePrev = () => {
        if (viewMode === 'week') setCurrentDate(prev => subDays(prev, 7));
        else if (viewMode === 'month') setCurrentDate(prev => subMonths(prev, 1));
        else if (viewMode === 'year') setCurrentDate(prev => subYears(prev, 1));
    };

    const handleNext = () => {
        if (viewMode === 'week') setCurrentDate(prev => addDays(prev, 7));
        else if (viewMode === 'month') setCurrentDate(prev => addMonths(prev, 1));
        else if (viewMode === 'year') setCurrentDate(prev => addYears(prev, 1));
    };

    const handleDateChange = (e) => {
        const date = new Date(e.target.value);
        if (!isNaN(date.getTime())) {
            setCurrentDate(date);
        }
    };

    const getDateLabel = () => {
        if (viewMode === 'week') {
            const start = startOfWeek(currentDate, { weekStartsOn: 1 }); // Start Monday
            const end = endOfWeek(currentDate, { weekStartsOn: 1 });
            return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
        }
        if (viewMode === 'month') return format(currentDate, 'MMMM yyyy');
        if (viewMode === 'year') return format(currentDate, 'yyyy');
    };

    // 1. Chart Data based on View Mode
    const getChartData = () => {
        try {
            let data = [];

            if (viewMode === 'week') {
                // Selected Week
                const start = startOfWeek(currentDate, { weekStartsOn: 1 });
                for (let i = 0; i < 7; i++) {
                    const date = addDays(start, i);
                    const dateKey = format(date, 'yyyy-MM-dd');
                    const dayLogs = logs[dateKey] || {};
                    const completed = routines.filter(r => dayLogs[r.id]).length;
                    const total = routines.length;
                    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

                    data.push({
                        name: format(date, 'EEE dd'),
                        fullDate: dateKey,
                        completion: percentage
                    });
                }
            } else if (viewMode === 'month') {
                // Selected Month
                const start = startOfMonth(currentDate);
                const end = endOfMonth(currentDate);
                const daysInMonth = eachDayOfInterval({ start, end });

                daysInMonth.forEach(date => {
                    const dateKey = format(date, 'yyyy-MM-dd');
                    const dayLogs = logs[dateKey] || {};
                    const completed = routines.filter(r => dayLogs[r.id]).length;
                    const total = routines.length;
                    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

                    // Show day number only for cleaner X-Axis
                    data.push({
                        name: format(date, 'dd'),
                        fullDate: dateKey,
                        completion: percentage
                    });
                });
            } else if (viewMode === 'year') {
                // Selected Year
                const start = startOfYear(currentDate);
                const end = endOfYear(currentDate);
                const monthsInYear = eachMonthOfInterval({ start, end });

                monthsInYear.forEach(monthDate => {
                    const monthStart = startOfMonth(monthDate);
                    const monthEnd = endOfMonth(monthDate);
                    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

                    let totalPercentageSum = 0;
                    let daysCount = 0;

                    daysInMonth.forEach(date => {
                        const dateKey = format(date, 'yyyy-MM-dd');
                        const dayLogs = logs[dateKey] || {};
                        const completed = routines.filter(r => dayLogs[r.id]).length;
                        const total = routines.length;
                        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

                        totalPercentageSum += percentage;
                        daysCount++;
                    });

                    const avgPercentage = daysCount > 0 ? Math.round(totalPercentageSum / daysCount) : 0;

                    data.push({
                        name: format(monthDate, 'MMM'),
                        fullDate: format(monthDate, 'yyyy-MM'),
                        completion: avgPercentage
                    });
                });
            }
            // Ensure data is sorted chronologically by fullDate
            return data.sort((a, b) => new Date(a.fullDate) - new Date(b.fullDate));
        } catch (error) {
            console.error("Error generating chart data:", error);
            return [];
        }
    };

    const chartData = getChartData();
    // 2. Routine Performance (Dynamic Time Window)
    const getRoutinePerformance = () => {
        try {
            // Calculate completion rate for each routine
            const data = routines.map(routine => {
                let completedCount = 0;
                // Depending on viewMode, we calculate strictly for that period

                let start, end;
                if (viewMode === 'week') {
                    start = startOfWeek(currentDate, { weekStartsOn: 1 });
                    end = endOfWeek(currentDate, { weekStartsOn: 1 });
                } else if (viewMode === 'month') {
                    start = startOfMonth(currentDate);
                    end = endOfMonth(currentDate);
                } else {
                    start = startOfYear(currentDate);
                    end = endOfYear(currentDate);
                }

                const days = eachDayOfInterval({ start, end });
                let totalDays = days.length;

                days.forEach(date => {
                    const dateKey = format(date, 'yyyy-MM-dd');
                    if (logs[dateKey]?.[routine.id]) {
                        completedCount++;
                    }
                });

                return {
                    name: routine.name,
                    value: completedCount,
                    total: totalDays,
                    rate: Math.round((completedCount / totalDays) * 100),
                    color: routine.color || '#6366f1'
                };
            });
            return data.sort((a, b) => b.rate - a.rate);
        } catch (error) {
            console.error("Error generating performance data:", error);
            return [];
        }
    };

    const routinePerformance = getRoutinePerformance();
    const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981']; // Indigo, Violet, Pink, Rose, Amber, Emerald

    // Custom Tooltip for Charts
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-zinc-900 p-2 rounded-lg border border-slate-200 dark:border-zinc-800 shadow-lg">
                    <p className="font-bold text-slate-800 dark:text-white text-xs mb-1">{label}</p>
                    <p className="text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                        {payload[0].value}% Completed
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Analytics</h1>
                    <p className="text-slate-500 dark:text-zinc-400 font-medium">Progress over time</p>
                </div>
                <button
                    onClick={() => {
                        if (window.confirm("Are you sure you want to reset all progress? This cannot be undone.")) {
                            resetAllHistory();
                        }
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors border border-red-200 dark:border-red-900/30 text-sm font-bold"
                >
                    <RefreshCcw size={16} />
                    Reset Progress
                </button>
            </div>

            {/* Main Chart */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                            <TrendingUp size={20} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                            Completion Rate
                        </h3>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex bg-slate-100 dark:bg-zinc-950 p-1 rounded-lg">
                            {['week', 'month', 'year'].map((mode) => (
                                <button
                                    key={mode}
                                    onClick={() => setViewMode(mode)}
                                    className={cn(
                                        "px-3 py-1 text-xs font-bold rounded-md transition-all",
                                        viewMode === mode
                                            ? "bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm"
                                            : "text-slate-500 hover:text-slate-700"
                                    )}
                                >
                                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-1 bg-slate-100 dark:bg-zinc-950 rounded-lg p-1 border border-slate-200 dark:border-zinc-800">
                            <button onClick={handlePrev} className="p-1 hover:bg-white dark:hover:bg-zinc-800 rounded">
                                <ChevronLeft size={16} />
                            </button>
                            <span className="text-xs font-bold text-slate-700 dark:text-zinc-300 px-2 min-w-[120px] text-center">
                                {getDateLabel()}
                            </span>
                            <button onClick={handleNext} className="p-1 hover:bg-white dark:hover:bg-zinc-800 rounded">
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <XAxis
                                dataKey="name"
                                tickLine={false}
                                axisLine={false}
                                tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
                            />
                            <YAxis hide domain={[0, 100]} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }} />
                            <Bar
                                dataKey="completion"
                                radius={[4, 4, 0, 0]}
                                fill="#4f46e5"
                                barSize={32}
                                onClick={(data) => {
                                    if (data && data.fullDate) {
                                        navigate(`/?date=${data.fullDate}`);
                                    }
                                }}
                                style={{ cursor: 'pointer' }}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Performance */}
                {/* Performance */}
                <div className="bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl border border-white/50 dark:border-zinc-800 shadow-xl dark:shadow-none p-6 rounded-3xl transition-all duration-300">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl text-emerald-600 dark:text-emerald-400">
                                <Award size={20} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Top Habits</h3>
                        </div>
                        <button
                            onClick={() => setChartType(prev => prev === 'pie' ? 'bar' : 'pie')}
                            className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-indigo-400 dark:hover:bg-white/5 rounded-lg transition-colors"
                            title={chartType === 'pie' ? "Switch to List View" : "Switch to Pie Chart"}
                        >
                            {chartType === 'pie' ? <BarChart3 size={20} /> : <PieChartIcon size={20} />}
                        </button>
                    </div>

                    {chartType === 'pie' ? (
                        <div className="h-[350px] w-full flex items-center justify-center">
                            {routinePerformance.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart margin={{ top: 20, bottom: 20 }}>
                                        <Pie
                                            data={routinePerformance.slice(0, 5)}
                                            cx="50%"
                                            cy="45%"
                                            innerRadius={60}
                                            outerRadius={90}
                                            paddingAngle={5}
                                            dataKey="rate"
                                            nameKey="name"
                                            stroke="none"
                                        >
                                            {routinePerformance.slice(0, 5).map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            content={({ active, payload }) => {
                                                if (active && payload && payload.length) {
                                                    return (
                                                        <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md p-3 rounded-xl border border-white/20 dark:border-zinc-700/50 shadow-xl">
                                                            <p className="font-bold text-slate-900 dark:text-white text-sm mb-1">{payload[0].name}</p>
                                                            <p className="text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                                                                {payload[0].value}% Completion Rate
                                                            </p>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                        />
                                        <Legend
                                            verticalAlign="bottom"
                                            height={36}
                                            iconType="circle"
                                            formatter={(value, entry) => (
                                                <span
                                                    className="font-bold text-xs ml-1"
                                                    style={{ color: entry.color }}
                                                >
                                                    {value}
                                                </span>
                                            )}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="text-slate-400 dark:text-zinc-600 flex flex-col items-center">
                                    <Activity size={48} className="mb-2 opacity-20" />
                                    <span className="text-sm font-medium">No sufficient data yet</span>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-5">
                            {routinePerformance.slice(0, 5).map((item, index) => (
                                <div key={index} className="flex items-center justify-between group">
                                    <span
                                        className="font-bold text-sm transition-colors"
                                        style={{ color: COLORS[index % COLORS.length] }}
                                    >
                                        {item.name}
                                    </span>
                                    <div className="flex items-center gap-3">
                                        <div className="w-24 h-2 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-indigo-500 rounded-full transition-all duration-1000 ease-out"
                                                style={{ width: `${item.rate}%`, backgroundColor: COLORS[index % COLORS.length] }}
                                            ></div>
                                        </div>
                                        <span className="text-xs font-bold w-9 text-right text-slate-600 dark:text-slate-400">{item.rate}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Quick Stats */}
                <div className="flex flex-col gap-4">
                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Habits</p>
                            <h4 className="text-3xl font-bold text-indigo-600 dark:text-white">{routines.length}</h4>
                        </div>
                        <Activity className="text-slate-100 dark:text-zinc-800" size={48} />
                    </div>

                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Peak Performance</p>
                            <h4 className="text-2xl font-bold text-emerald-600 dark:text-white">
                                {[...chartData].sort((a, b) => b.completion - a.completion)[0]?.name || '-'}
                            </h4>
                        </div>
                        <Award className="text-slate-100 dark:text-zinc-800" size={48} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
