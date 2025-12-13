import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Users } from 'lucide-react';

// Simple utility for class merging if not available elsewhere
const cn = (...classes) => classes.filter(Boolean).join(' ');

const NAV_ITEMS = [
    { label: 'Home', path: '/' },
    { label: 'Ask AI', path: '/chat' },
    { label: 'Notices', path: '/notices' },
    { label: 'Events', path: '/events' },
    { label: 'Market', path: '/marketplace' },
    { label: 'Profile', path: '/profile' },
];

export default function Sidebar({ isOpen, setIsOpen }) {
    const { user, logout } = useAuth();
    return (
        <>
            {/* Mobile Backdrop */}
            <div className={cn(
                "fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity duration-300",
                isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            )} onClick={() => setIsOpen(false)} />

            {/* Sidebar Container */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1)",
                "lg:static lg:translate-x-0 bg-transparent",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="h-full lg:p-4">
                    <div className="h-full glass flex flex-col lg:rounded-2xl overflow-hidden border-r lg:border border-white/40 shadow-glass">
                        {/* Logo Area */}
                        <div className="flex h-20 items-center px-8 border-b border-white/20 bg-gradient-to-r from-white/50 to-transparent">
                            <span className="text-2xl font-bold bg-gradient-to-r from-brand-600 to-accent-600 bg-clip-text text-transparent">
                                CampusQuery
                            </span>
                            <button onClick={() => setIsOpen(false)} className="ml-auto lg:hidden text-slate-500 hover:text-brand-600">
                                ✕
                            </button>
                        </div>

                        {/* Navigation */}
                        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
                            <div className="mb-4 px-4">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                    Menu
                                </p>
                            </div>

                            {NAV_ITEMS.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsOpen(false)}
                                    className={({ isActive }) => cn(
                                        "group flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 ease-out",
                                        isActive
                                            ? "bg-brand-500/10 text-brand-700 shadow-sm border border-brand-100"
                                            : "text-slate-600 hover:bg-white/50 hover:text-brand-600 hover:pl-5"
                                    )}
                                >
                                    {({ isActive }) => (
                                        <>
                                            <span className={cn(
                                                "h-2 w-2 rounded-full transition-all duration-300",
                                                isActive ? "bg-brand-500 scale-125" : "bg-slate-300 group-hover:bg-brand-400"
                                            )} />
                                            <span className="font-medium">{item.label}</span>
                                        </>
                                    )}
                                </NavLink>
                            ))}
                        </div>

                        {/* User Profile Snippet */}
                        <div className="p-4 bg-white/30 border-t border-white/20 backdrop-blur-md">
                            <div className="absolute bottom-4 left-4 right-4">
                                {user ? (
                                    <div className="glass-card p-3 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
                                            <p className="text-xs text-slate-500 truncate">{user.role}</p>
                                        </div>
                                        <button
                                            onClick={logout}
                                            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-red-500 transition-colors"
                                        >
                                            <Users className="w-4 h-4 rotate-180" /> {/* Simulating log out icon for now */}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="glass-card p-3">
                                        <NavLink
                                            to="/login"
                                            className="flex items-center justify-center gap-2 w-full py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg transition-colors text-sm font-semibold"
                                        >
                                            <Users className="w-4 h-4" />
                                            <span>Sign In</span>
                                        </NavLink>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
