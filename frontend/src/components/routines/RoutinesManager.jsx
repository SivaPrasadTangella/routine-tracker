import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Calendar, Clock, Activity, Search, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { useRoutine } from '../../context/RoutineContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { AddRoutineModal } from './AddRoutineModal';
import { cn } from '../../lib/utils';
import { format } from 'date-fns';

const RoutinesManager = () => {
    const { routines, addRoutine, editRoutine, deleteRoutine, deleteAllRoutines } = useRoutine();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRoutine, setEditingRoutine] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterPriority, setFilterPriority] = useState('all');
    const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });

    const handleSort = (key) => {
        setSortConfig((current) => ({
            key,
            direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
        }));
    };

    const filteredAndSortedRoutines = routines
        .filter(routine => {
            const matchesSearch = routine.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesPriority = filterPriority === 'all' ||
                (filterPriority === 'urgent' && routine.priority === 5) ||
                (filterPriority === 'important' && (routine.priority > 1 && routine.priority < 5)) ||
                (filterPriority === 'low' && routine.priority === 1);
            return matchesSearch && matchesPriority;
        })
        .sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });

    const handleEdit = (routine) => {
        setEditingRoutine(routine);
        setIsModalOpen(true);
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setEditingRoutine(null);
    };

    const handleSave = (data) => {
        if (editingRoutine) {
            editRoutine(editingRoutine.id, data);
        } else {
            addRoutine(data);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in max-w-5xl mx-auto pb-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">My Routines</h1>
                    <p className="text-slate-500 dark:text-zinc-400 mt-2 font-medium text-lg">Manage your daily habits and goals</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <Button
                        onClick={() => {
                            if (window.confirm('Are you sure you want to remove ALL routines? This cannot be undone.')) {
                                deleteAllRoutines();
                            }
                        }}
                        className="gap-2 bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:-translate-y-0.5 transition-all duration-300 w-full sm:w-auto justify-center"
                    >
                        <Trash2 size={20} />
                        Remove All
                    </Button>
                    <Button
                        onClick={() => setIsModalOpen(true)}
                        className="gap-2 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:bg-indigo-500 hover:-translate-y-0.5 transition-all duration-300 w-full sm:w-auto justify-center"
                    >
                        <Plus size={20} />
                        New Routine
                    </Button>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 sticky top-0 z-20 bg-slate-50/80 dark:bg-black/80 backdrop-blur-xl py-4 -mx-4 px-4 sm:mx-0 sm:px-0 transition-all">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <Input
                        placeholder="Search routines..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 h-11 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md border-slate-200/60 dark:border-zinc-800 focus:bg-white dark:focus:bg-zinc-900 transition-all"
                    />
                </div>
                <select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    className="h-11 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md px-4 py-2 text-sm font-medium focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all cursor-pointer hover:bg-white dark:hover:bg-zinc-900"
                >
                    <option value="all">All Priorities</option>
                    <option value="urgent">Urgent</option>
                    <option value="important">Important</option>
                    <option value="low">Low</option>
                </select>
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block glass-card overflow-hidden rounded-3xl border border-white/60 dark:border-white/5 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-2xl shadow-xl shadow-slate-200/50 dark:shadow-none">
                <div className="overflow-x-auto">
                    <table className="w-full text-left bg-transparent">
                        <thead className="text-xs uppercase text-slate-500 dark:text-zinc-400 bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
                            <tr>
                                <th
                                    className="px-6 py-4 font-bold tracking-wider cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                                    onClick={() => handleSort('name')}
                                >
                                    <div className="flex items-center gap-1">
                                        Routine Name
                                        {sortConfig.key === 'name' ? (
                                            sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                                        ) : <ArrowUpDown size={14} className="opacity-40" />}
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-4 font-bold tracking-wider cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                                    onClick={() => handleSort('priority')}
                                >
                                    <div className="flex items-center gap-1">
                                        Priority
                                        {sortConfig.key === 'priority' ? (
                                            sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                                        ) : <ArrowUpDown size={14} className="opacity-40" />}
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-4 font-bold tracking-wider cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                                    onClick={() => handleSort('created_at')}
                                >
                                    <div className="flex items-center gap-1">
                                        Created
                                        {sortConfig.key === 'created_at' ? (
                                            sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                                        ) : <ArrowUpDown size={14} className="opacity-40" />}
                                    </div>
                                </th>
                                <th className="px-6 py-4 font-bold tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                            {filteredAndSortedRoutines.map((routine) => (
                                <tr
                                    key={routine.id}
                                    className="group hover:bg-white/60 dark:hover:bg-white/10 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:backdrop-blur-md relative z-10"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "w-10 h-10 rounded-xl flex items-center justify-center shadow-md",
                                                "bg-gradient-to-br from-indigo-500 to-violet-600 text-white"
                                            )}>
                                                <span className="font-bold text-sm">
                                                    {routine.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <span className="font-medium text-slate-900 dark:text-white">
                                                {routine.name}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {routine.priority && (
                                            <span className={cn(
                                                "text-[10px] px-2.5 py-1 rounded-lg font-bold uppercase tracking-wider inline-flex",
                                                routine.priority >= 4 ? "bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400" :
                                                    routine.priority === 1 ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" :
                                                        "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
                                            )}>
                                                {routine.priority === 5 ? 'Urgent' : routine.priority === 1 ? 'Low' : 'Important'}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center text-sm text-slate-500 dark:text-zinc-500">
                                            <Clock size={14} className="mr-1.5 text-slate-400" />
                                            {format(new Date(routine.created_at), 'MMM d, yyyy')}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 hover:bg-indigo-50 dark:hover:bg-indigo-500/20 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg"
                                                onClick={() => handleEdit(routine)}
                                            >
                                                <Pencil size={16} />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 hover:bg-red-50 dark:hover:bg-red-500/20 hover:text-red-600 dark:hover:text-red-400 rounded-lg"
                                                onClick={() => deleteRoutine(routine.id)}
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Card View */}
            <div className="block sm:hidden space-y-4">
                {filteredAndSortedRoutines.map((routine) => (
                    <div
                        key={routine.id}
                        className="glass-card p-5 rounded-2xl border border-white/60 dark:border-white/5 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl shadow-lg relative overflow-hidden"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "w-10 h-10 rounded-xl flex items-center justify-center shadow-sm",
                                    "bg-gradient-to-br from-indigo-500 to-violet-600 text-white"
                                )}>
                                    <span className="font-bold text-sm">
                                        {routine.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white leading-tight">
                                        {routine.name}
                                    </h3>
                                    <div className="flex items-center text-xs text-slate-500 dark:text-zinc-400 mt-1">
                                        <Clock size={12} className="mr-1" />
                                        {format(new Date(routine.created_at), 'MMM d')}
                                    </div>
                                </div>
                            </div>
                            {routine.priority && (
                                <span className={cn(
                                    "text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-wider",
                                    routine.priority >= 4 ? "bg-red-50 text-red-600 border border-red-100/50" :
                                        routine.priority === 1 ? "bg-emerald-50 text-emerald-600 border border-emerald-100/50" :
                                            "bg-indigo-50 text-indigo-600 border border-indigo-100/50"
                                )}>
                                    {routine.priority === 5 ? 'Urgent' : routine.priority === 1 ? 'Low' : 'Imp'}
                                </span>
                            )}
                        </div>

                        <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-white/5">
                            <Button
                                variant="ghost"
                                className="flex-1 justify-center h-9 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:hover:bg-indigo-500/20 rounded-xl"
                                onClick={() => handleEdit(routine)}
                            >
                                <Pencil size={14} className="mr-2" />
                                Edit
                            </Button>
                            <Button
                                variant="ghost"
                                className="flex-1 justify-center h-9 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 rounded-xl"
                                onClick={() => deleteRoutine(routine.id)}
                            >
                                <Trash2 size={14} className="mr-2" />
                                Delete
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State (Shared) */}
            {filteredAndSortedRoutines.length === 0 && (
                <div className="glass-card py-20 flex flex-col items-center justify-center text-slate-400 dark:text-zinc-500 rounded-3xl">
                    <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
                        <Activity size={32} className="text-slate-300 dark:text-zinc-600" />
                    </div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">No routines found</h3>
                    <p className="text-sm font-medium mb-6 text-center max-w-xs">
                        {searchTerm || filterPriority !== 'all'
                            ? "Try adjusting your search or filters."
                            : "Create your first routine to start tracking."}
                    </p>
                    {(!searchTerm && filterPriority === 'all') && (
                        <Button onClick={() => setIsModalOpen(true)} className="shadow-lg shadow-indigo-500/20">
                            Create First Routine
                        </Button>
                    )}
                </div>
            )}

            <AddRoutineModal
                isOpen={isModalOpen}
                onClose={handleClose}
                onSave={handleSave}
                initialData={editingRoutine}
            />
        </div>
    );
};

export default RoutinesManager;
