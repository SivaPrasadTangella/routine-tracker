import React, { createContext, useContext, useState, useEffect } from 'react';
import { routineService } from '../lib/services';
import { useAuth } from './AuthContext';

const RoutineContext = createContext();

export const useRoutine = () => useContext(RoutineContext);

export const RoutineProvider = ({ children }) => {
    const { user } = useAuth();
    const [routines, setRoutines] = useState([]);
    const [logs, setLogs] = useState({});

    // Fetch routines and logs when user is logged in
    useEffect(() => {
        if (user) {
            fetchRoutines();
            fetchLogs();
        } else {
            setRoutines([]);
            setLogs({});
        }
    }, [user]);

    const fetchRoutines = async () => {
        try {
            const data = await routineService.getAll();
            setRoutines(data);
        } catch (error) {
            console.error("Failed to fetch routines:", error);
        }
    };

    const fetchLogs = async () => {
        try {
            const data = await routineService.getLogs();
            setLogs(data);
        } catch (error) {
            console.error("Failed to fetch logs:", error);
        }
    };

    const addRoutine = async (routineData) => {
        try {
            const newRoutine = await routineService.create(routineData);
            setRoutines([...routines, newRoutine]);
        } catch (error) {
            console.error("Failed to add routine:", error);
        }
    };

    const editRoutine = async (id, updatedRoutine) => {
        try {
            const data = await routineService.update(id, updatedRoutine);
            setRoutines(routines.map(r => r.id === id ? data : r));
        } catch (error) {
            console.error("Failed to update routine:", error);
        }
    };

    const deleteRoutine = async (id) => {
        try {
            await routineService.delete(id);
            setRoutines(routines.filter(r => r.id !== id));
        } catch (error) {
            console.error("Failed to delete routine:", error);
        }
    };

    const deleteAllRoutines = async () => {
        try {
            await routineService.deleteAll();
            setRoutines([]);
        } catch (error) {
            console.error("Failed to delete all routines:", error);
        }
    };

    const resetAllHistory = async () => {
        try {
            await routineService.resetHistory();
            setLogs({});
        } catch (error) {
            console.error("Failed to reset history:", error);
        }
    };

    const toggleLog = async (date, routineId) => {
        try {
            // Optimistic update
            setLogs(prevLogs => {
                const dayLogs = prevLogs[date] || {};
                const newStatus = !dayLogs[routineId];
                return { ...prevLogs, [date]: { ...dayLogs, [routineId]: newStatus } };
            });

            await routineService.toggleLog(routineId, date);
            // Ideally re-fetch or confirm, but optimistic is fine for now
        } catch (error) {
            console.error("Failed to toggle log:", error);
            // Revert on error (could be better)
            fetchLogs();
        }
    };

    const getCompletionForDate = (date) => {
        const dayLogs = logs[date] || {};
        const total = routines.length;
        if (total === 0) return 0;

        const completed = routines.filter(r => dayLogs[r.id]).length;
        return Math.round((completed / total) * 100);
    };

    const importData = async (newRoutines, newLogs) => {
        // 1. Create Routines
        const routineMap = {}; // name (lower) -> real database id
        const fakeIdToRealId = {}; // fake-uuid -> real database id

        // First index existing routines
        routines.forEach(r => routineMap[r.name.toLowerCase()] = r.id);

        for (const routine of newRoutines) {
            const lowerName = routine.name.toLowerCase();
            let realId = routineMap[lowerName];

            if (!realId) {
                try {
                    const newRoutine = await routineService.create({ name: routine.name, color: routine.color });
                    realId = newRoutine.id;
                    routineMap[lowerName] = realId;
                    setRoutines(prev => [...prev, newRoutine]);
                } catch (error) {
                    console.error("Failed to create routine during import:", routine.name, error);
                    continue;
                }
            }
            // Map the fake ID from file processing to the real ID
            fakeIdToRealId[routine.id] = realId;
        }

        // 2. Create Logs
        for (const [date, dayLogs] of Object.entries(newLogs)) {
            for (const [routineId, status] of Object.entries(dayLogs)) {
                if (status) {
                    // routineId might be a real ID (if matched existing) or a fake ID (if new)
                    // check if it's a fake ID first
                    let targetId = fakeIdToRealId[routineId] || routineId;

                    try {
                        await routineService.toggleLog(targetId, date);
                        // Update local logs state
                        setLogs(prevLogs => {
                            const prevDayLogs = prevLogs[date] || {};
                            return { ...prevLogs, [date]: { ...prevDayLogs, [targetId]: true } };
                        });
                    } catch (error) {
                        console.error(`Failed to log for routine ${targetId} on ${date}:`, error);
                    }
                }
            }
        }
    };

    const value = {
        routines,
        logs,
        addRoutine,
        editRoutine,
        deleteRoutine,
        deleteAllRoutines,
        resetAllHistory,
        toggleLog,
        getCompletionForDate,
        importData
    };

    return (
        <RoutineContext.Provider value={value}>
            {children}
        </RoutineContext.Provider>
    );
};
