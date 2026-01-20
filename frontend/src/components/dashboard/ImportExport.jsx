import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, Download, Database } from 'lucide-react';
import { useRoutine } from '../../context/RoutineContext';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';
import { format } from 'date-fns';

const ImportExport = () => {
    const { routines, logs, importData } = useRoutine();
    const [status, setStatus] = useState({ type: 'idle', message: '' });
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setStatus({ type: 'loading', message: 'Parsing Excel file...' });

        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                const bstr = evt.target.result;
                const workbook = XLSX.read(bstr, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const ws = workbook.Sheets[sheetName];
                const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

                processExcelData(data);
            } catch (error) {
                console.error("Import Error", error);
                setStatus({ type: 'error', message: 'Failed to parse file. Ensure format is correct.' });
            }
        };
        reader.readAsBinaryString(file);
    };

    const processExcelData = (data) => {
        if (data.length < 2) {
            setStatus({ type: 'error', message: 'File is empty or missing headers' });
            return;
        }

        const headers = data[0];
        const routineNames = headers.slice(1); // Skip 'Date' column

        const newRoutines = [];
        const newLogs = {};

        // 1. Prepare new routines
        routineNames.forEach(name => {
            if (!name) return;
            const cleanName = name.toString().trim();
            newRoutines.push({
                id: crypto.randomUUID(),
                name: cleanName,
                color: 'bg-indigo-500',
                created_at: new Date().toISOString()
            });
        });

        // 2. Process Logs
        let logsCount = 0;

        for (let i = 1; i < data.length; i++) {
            const row = data[i];
            const rawDate = row[0];
            if (!rawDate) continue;

            let dateStr;
            // Handle Excel dates
            if (typeof rawDate === 'number') {
                const dateObj = new Date(Math.round((rawDate - 25569) * 86400 * 1000));
                dateStr = format(dateObj, 'yyyy-MM-dd');
            } else {
                try {
                    const d = new Date(rawDate);
                    if (isNaN(d.getTime())) continue;
                    dateStr = format(d, 'yyyy-MM-dd');
                } catch (e) { continue; }
            }

            if (!newLogs[dateStr]) newLogs[dateStr] = {};

            // Iterate columns
            for (let j = 1; j < row.length; j++) {
                const routineName = headers[j]?.toString().trim();
                if (!routineName) continue;

                const val = row[j];
                const isCompleted = (val === 1 || val === '1' || val === true || val === 'TRUE' || val === 'x' || val === 'X');

                if (isCompleted) {
                    const existingRoutine = routines.find(r => r.name.toLowerCase() === routineName.toLowerCase());
                    const newRoutine = newRoutines.find(r => r.name.toLowerCase() === routineName.toLowerCase());
                    const targetId = existingRoutine?.id || newRoutine?.id;

                    if (targetId) {
                        newLogs[dateStr][targetId] = true;
                        logsCount++;
                    }
                }
            }
        }

        importData(newRoutines, newLogs);

        setStatus({
            type: 'success',
            message: `Successfully imported data. Processed ${logsCount} completion records.`
        });
    };

    const handleExport = () => {
        if (routines.length === 0) {
            setStatus({ type: 'error', message: 'No data to export.' });
            return;
        }

        const routineHeader = routines.map(r => r.name);
        const headers = ['Date', ...routineHeader];

        const data = [headers];

        // Get all unique dates from logs
        let dates = Object.keys(logs).sort().reverse(); // Newest first

        // Filter by date range
        if (startDate || endDate) {
            dates = dates.filter(date => {
                if (startDate && date < startDate) return false;
                if (endDate && date > endDate) return false;
                return true;
            });
        }

        if (dates.length === 0) {
            setStatus({ type: 'error', message: 'No data found in the selected date range.' });
            return;
        }

        dates.forEach(date => {
            const row = [date];
            const dayLogs = logs[date] || {};
            routines.forEach(r => {
                row.push(dayLogs[r.id] ? 'TRUE' : '');
            });
            data.push(row);
        });

        // Create workbook
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, "HabitTracker Data");

        // Download
        XLSX.writeFile(wb, `habit_tracker_export_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
        setStatus({ type: 'success', message: 'Export downloaded successfully.' });
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Data Management</h1>
                <p className="text-slate-500 dark:text-zinc-400 font-medium">Backup or restore history</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Import Card */}
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm transition-all">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
                            <FileSpreadsheet size={20} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold">Import</h3>
                            <p className="text-slate-500 text-xs">Upload tracking sheet</p>
                        </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-zinc-950 border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-xl p-8 flex flex-col items-center justify-center text-center space-y-3 hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors relative">
                        <Upload size={24} className="text-slate-400" />
                        <div className="text-xs">
                            <p className="font-bold text-slate-700 dark:text-zinc-300">Click to upload .xlsx</p>
                            <p className="text-slate-400 mt-1">Columns matched by name</p>
                        </div>
                        <input
                            type="file"
                            accept=".xlsx, .xls"
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                            onChange={handleFileUpload}
                        />
                    </div>

                    {status.message && (
                        <div className={cn(
                            "mt-4 p-3 rounded-lg flex items-center gap-2 text-xs font-semibold",
                            status.type === 'success' ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                                status.type === 'error' ? "bg-red-50 text-red-700 border border-red-100" :
                                    "bg-blue-50 text-blue-700 border border-blue-100"
                        )}>
                            {status.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                            {status.message}
                        </div>
                    )}
                </div>

                {/* Export Card */}
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm transition-all">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
                            <Database size={20} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold">Export</h3>
                            <p className="text-slate-500 text-xs">Download backup</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">From</label>
                                <input
                                    type="date"
                                    className="w-full p-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg text-xs"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">To</label>
                                <input
                                    type="date"
                                    className="w-full p-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg text-xs"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </div>
                        </div>

                        <Button
                            onClick={handleExport}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 font-bold py-5"
                        >
                            <Download size={18} className="mr-2" />
                            Download Excel
                        </Button>
                    </div>
                </div>
            </div>

            <div className="bg-slate-50 dark:bg-zinc-900/50 p-6 rounded-xl border border-slate-200 dark:border-zinc-800">
                <h3 className="font-bold text-sm mb-4">Excel Format Guide</h3>
                <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                    <table className="w-full text-[11px] text-center">
                        <thead className="bg-slate-100 dark:bg-zinc-800 text-slate-500 font-bold uppercase tracking-wider">
                            <tr>
                                <th className="p-3 border-r dark:border-zinc-800">Date</th>
                                <th className="p-3 border-r dark:border-zinc-800">Habit Name</th>
                                <th className="p-3">...</th>
                            </tr>
                        </thead>
                        <tbody className="text-slate-600 dark:text-zinc-400">
                            <tr className="border-t dark:border-zinc-800">
                                <td className="p-3 border-r dark:border-zinc-800">2024-01-01</td>
                                <td className="p-3 border-r dark:border-zinc-800 text-emerald-600 font-bold">TRUE</td>
                                <td className="p-3">1 / x</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ImportExport;
