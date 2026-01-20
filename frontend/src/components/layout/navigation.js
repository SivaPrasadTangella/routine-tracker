import { LayoutDashboard, ListTodo, BarChart2, FolderDown } from 'lucide-react';

export const NAV_ITEMS = [
    {
        to: '/',
        label: 'Dashboard',
        icon: LayoutDashboard,
        id: 'nav_dashboard' // keys for potential i18n
    },
    {
        to: '/routines',
        label: 'My Routines',
        icon: ListTodo,
        id: 'nav_routines'
    },
    {
        to: '/analytics',
        label: 'Analytics',
        icon: BarChart2,
        id: 'nav_analytics'
    },
    {
        to: '/import',
        label: 'Import/Export',
        icon: FolderDown,
        id: 'nav_import'
    },
];

export const APP_NAME = "RoutineTracker";
export const LOGOUT_LABEL = "Sign Out";
