import React, { useState } from 'react';
import { X, Check, Bell, Mail, Phone, Clock } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { cn } from '../../lib/utils';

const COLORS = [
    'bg-slate-500', 'bg-red-500', 'bg-orange-500', 'bg-amber-500',
    'bg-green-500', 'bg-emerald-500', 'bg-teal-500', 'bg-cyan-500',
    'bg-sky-500', 'bg-blue-500', 'bg-indigo-500', 'bg-violet-500',
    'bg-purple-500', 'bg-fuchsia-500', 'bg-pink-500', 'bg-rose-500'
];

export const AddRoutineModal = ({ isOpen, onClose, onSave, initialData = null }) => {
    const [name, setName] = useState(initialData?.name || '');
    const [color, setColor] = useState(initialData?.color || 'bg-indigo-500');
    const [priority, setPriority] = useState(initialData?.priority || 3);
    const [reminder_time, setReminderTime] = useState(initialData?.reminder_time || '');
    const [notify_email, setNotifyEmail] = useState(initialData?.notify_email || false);
    const [notify_sms, setNotifySms] = useState(initialData?.notify_sms || false);

    // Reset state when opening/closing or changing initialData
    React.useEffect(() => {
        if (isOpen) {
            setName(initialData?.name || '');
            setColor(initialData?.color || 'bg-indigo-500');
            setPriority(initialData?.priority || 3);
            setReminderTime(initialData?.reminder_time || '');
            setNotifyEmail(initialData?.notify_email || false);
            setNotifySms(initialData?.notify_sms || false);
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
            onSave({ name, color, priority, reminder_time, notify_email, notify_sms });
            if (!initialData) {
                setName('');
                setColor('bg-indigo-500');
                setPriority(3);
                setReminderTime('');
                setNotifyEmail(false);
                setNotifySms(false);
            }
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 dark:bg-black/60 transition-opacity">
            <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 p-8 rounded-xl shadow-xl border border-slate-200 dark:border-zinc-800">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">{initialData ? 'Edit Routine' : 'New Routine'}</h2>
                        <p className="text-sm text-slate-500 dark:text-zinc-400">Habit details</p>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                    >
                        <X size={20} />
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</label>
                        <Input
                            placeholder="Routine name..."
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoFocus
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Priority</label>
                        <div className="flex gap-1 p-1 bg-slate-100 dark:bg-zinc-800 rounded-lg border border-slate-200 dark:border-zinc-700">
                            {[1, 2, 3, 4, 5].map((p) => (
                                <button
                                    key={p}
                                    type="button"
                                    onClick={() => setPriority(p)}
                                    className={cn(
                                        "flex-1 h-8 rounded-md text-xs font-bold transition-all",
                                        priority === p
                                            ? "bg-white dark:bg-zinc-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                                            : "text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300"
                                    )}
                                >
                                    {p === 1 ? 'Low' : p === 5 ? 'High' : p}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Color Tag</label>
                        <div className="flex flex-wrap gap-2">
                            {COLORS.map((c) => (
                                <button
                                    key={c}
                                    type="button"
                                    className={cn(
                                        "w-6 h-6 rounded-full transition-transform hover:scale-110 flex items-center justify-center",
                                        c,
                                        color === c ? "ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-zinc-900" : "opacity-80"
                                    )}
                                    onClick={() => setColor(c)}
                                >
                                    {color === c && <Check size={12} className="text-white" strokeWidth={4} />}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Reminder & Notifications</label>
                        <div className="bg-slate-50 dark:bg-zinc-800/50 p-4 rounded-xl space-y-4">
                            <div className="flex items-center gap-3">
                                <Clock size={18} className="text-slate-400" />
                                <input
                                    type="time"
                                    value={reminder_time}
                                    onChange={(e) => setReminderTime(e.target.value)}
                                    className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm font-bold text-slate-700 dark:text-zinc-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${notify_email ? 'bg-indigo-500 border-indigo-500' : 'border-slate-300 dark:border-zinc-600 bg-white dark:bg-zinc-900'}`}>
                                        {notify_email && <X size={12} className="text-white rotate-45" strokeWidth={4} />}
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            checked={notify_email}
                                            onChange={(e) => setNotifyEmail(e.target.checked)}
                                        />
                                    </div>
                                    <span className="text-sm font-medium text-slate-600 dark:text-zinc-400 group-hover:text-indigo-500 transition-colors flex items-center gap-2">
                                        <Mail size={14} /> Notify via Email
                                    </span>
                                </label>

                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${notify_sms ? 'bg-indigo-500 border-indigo-500' : 'border-slate-300 dark:border-zinc-600 bg-white dark:bg-zinc-900'}`}>
                                        {notify_sms && <X size={12} className="text-white rotate-45" strokeWidth={4} />}
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            checked={notify_sms}
                                            onChange={(e) => setNotifySms(e.target.checked)}
                                        />
                                    </div>
                                    <span className="text-sm font-medium text-slate-600 dark:text-zinc-400 group-hover:text-indigo-500 transition-colors flex items-center gap-2">
                                        <Phone size={14} /> Notify via SMS
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-indigo-600 hover:bg-indigo-700 font-bold px-6"
                        >
                            {initialData ? 'Save Changes' : 'Create Routine'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
