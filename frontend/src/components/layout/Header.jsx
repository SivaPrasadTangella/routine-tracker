import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, Activity, User } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';
import ThemeControl from '../ui/ThemeControl';
import { useAuth } from '../../context/AuthContext';
import { NAV_ITEMS, APP_NAME, LOGOUT_LABEL } from './navigation';

const Header = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <>
            {/* Main Header */}
            <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl border-slate-200/60 dark:border-zinc-800/60 shadow-sm shadow-indigo-500/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <Link to="/" className="flex items-center gap-2 group">
                                <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/20 transition-colors">
                                    <Activity className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200">
                                    {APP_NAME}
                                </span>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center space-x-1">
                            {NAV_ITEMS.map((item) => (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    className={({ isActive }) => cn(
                                        "px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300",
                                        "flex items-center gap-2",
                                        isActive
                                            ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 shadow-sm"
                                            : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5"
                                    )}
                                >
                                    <item.icon size={18} />
                                    <span>{item.label}</span>
                                </NavLink>
                            ))}
                        </nav>

                        {/* Right Actions */}
                        <div className="hidden md:flex items-center gap-4">
                            <ThemeControl />
                            <Link to="/profile">
                                <Button variant="ghost" size="icon" className="text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:text-slate-400 dark:hover:text-indigo-400 dark:hover:bg-indigo-500/10 rounded-xl">
                                    <User size={20} />
                                </Button>
                            </Link>
                            <div className="h-6 w-px bg-slate-200 dark:bg-zinc-800" />
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleLogout}
                                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                            >
                                <LogOut size={18} className="mr-2" />
                                {LOGOUT_LABEL}
                            </Button>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden flex items-center gap-4">
                            <ThemeControl />
                            <button
                                onClick={() => setIsMobileMenuOpen(true)}
                                className="p-2 -mr-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-zinc-800 transition-colors"
                            >
                                <Menu size={24} />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <div className={cn(
                "fixed top-0 right-0 z-[70] h-full w-[280px] bg-white dark:bg-zinc-950 shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden border-l border-slate-200 dark:border-zinc-800",
                isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
            )}>
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-zinc-800">
                        <span className="font-bold text-lg text-slate-900 dark:text-white">Menu</span>
                        <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-zinc-800 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                        <NavLink
                            to="/profile"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={({ isActive }) => cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                                isActive
                                    ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 shadow-sm"
                                    : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
                            )}
                        >
                            <User size={20} />
                            <span className="font-medium">Profile</span>
                        </NavLink>
                        {NAV_ITEMS.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={({ isActive }) => cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                                    isActive
                                        ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 shadow-sm"
                                        : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
                                )}
                            >
                                <item.icon size={20} />
                                <span className="font-medium">{item.label}</span>
                            </NavLink>
                        ))}
                    </nav>

                    <div className="p-4 border-t border-slate-100 dark:border-zinc-800">
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                            onClick={handleLogout}
                        >
                            <LogOut size={20} className="mr-3" />
                            {LOGOUT_LABEL}
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Header;
