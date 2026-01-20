import React from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ListTodo, BarChart2, FolderDown, Menu, X, LogOut, Activity, Settings } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';
import ThemeControl from '../ui/ThemeControl';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { to: '/', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/routines', label: 'My Routines', icon: ListTodo },
        { to: '/analytics', label: 'Analytics', icon: BarChart2 },
        { to: '/import', label: 'Import/Export', icon: FolderDown },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* Sidebar Container */}
            <aside className={cn(
                "fixed top-0 left-0 z-50 h-full w-64 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-r border-slate-200 dark:border-zinc-800 transition-transform duration-300 ease-in-out md:translate-x-0 shadow-2xl md:shadow-none",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100 dark:border-zinc-800/50">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-9 h-9 rounded-full overflow-hidden border border-indigo-100 dark:border-indigo-500/20 shadow-sm relative group-hover:scale-105 transition-transform">
                            {user?.profile_photo ? (
                                <img src={user.profile_photo} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold">
                                    {user?.username?.[0]?.toUpperCase()}
                                </div>
                            )}
                        </div>
                        <span className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {user?.username}
                        </span>
                    </Link>
                    <button onClick={onClose} className="md:hidden text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100 dark:border-zinc-800/50">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Appearance</span>
                    <ThemeControl />
                </div>

                <nav className="p-4 space-y-1.5">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            onClick={() => { if (window.innerWidth < 768) onClose() }}
                            className={({ isActive }) => cn(
                                "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium group",
                                isActive
                                    ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shadow-sm"
                                    : "text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/50 hover:text-slate-900 dark:hover:text-white"
                            )}
                        >
                            <item.icon size={20} className={cn("transition-colors", ({ isActive }) => isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 group-hover:text-indigo-500")} />
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="absolute bottom-0 left-0 w-full p-4 border-t border-slate-100 dark:border-zinc-800/50">
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-zinc-800/50 font-bold rounded-xl mb-1"
                        onClick={() => navigate('/profile')}
                    >
                        <Settings size={20} className="mr-3" />
                        Settings
                    </Button>
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 font-bold rounded-xl"
                        onClick={handleLogout}
                    >
                        <LogOut size={20} className="mr-3" />
                        Sign Out
                    </Button>
                </div>
            </aside>
        </>
    );
};

const Layout = () => {
    const { user } = useAuth(); // Add this
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-white transition-colors duration-300 flex">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
                {/* Mobile Header */}
                <header className="md:hidden h-14 bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between px-4 sticky top-0 z-30">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)}>
                            <Menu size={24} />
                        </Button>
                        <span className="font-bold text-lg">RoutineTracker</span>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 p-4 md:p-8">
                    <div className="max-w-5xl mx-auto space-y-6">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
