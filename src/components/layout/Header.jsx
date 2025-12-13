import React, { useState, useEffect } from 'react';
import { Search, Bell, Menu, X, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import Input from '../ui/Input';
import Button from '../ui/Button';

export default function Header({ onMenuClick }) {
    const { user } = useAuth();
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    // Fetch notifications (Simulated by fetching recent notices)
    useEffect(() => {
        const fetchUpdates = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/notices');
                if (res.ok) {
                    const data = await res.json();
                    // Just take top 5 as "notifications"
                    const recents = data.slice(0, 5).map(n => ({
                        id: n._id,
                        title: n.title,
                        time: new Date(n.date).toLocaleDateString(),
                        read: false
                    }));
                    setNotifications(recents);
                    setUnreadCount(recents.length);
                }
            } catch (err) {
                console.error("Failed to fetch notifications");
            }
        };
        fetchUpdates();
    }, []);

    const markAsRead = () => {
        setUnreadCount(0);
        // Not persisting for this demo, just clearance
    };

    return (
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between gap-6 px-6 lg:px-10 transition-all duration-300">
            {/* Mobile Menu Toggle - visible on small screens */}
            <button
                onClick={onMenuClick}
                className="text-slate-500 lg:hidden hover:bg-white/50 p-2 rounded-xl transition-colors"
                aria-label="Toggle Menu"
            >
                <span className="text-2xl">☰</span>
            </button>

            {/* Glass Search Bar */}
            <div className="hidden md:flex flex-1 max-w-lg">
                <div className="relative w-full group">
                    <div className="absolute inset-0 bg-brand-400/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <Input
                        type="search"
                        placeholder="Search for notices, events, or ask AI..."
                        className="relative w-full bg-white/60 backdrop-blur-md border border-white/40 shadow-glass-sm 
                                   rounded-full px-6 py-2.5 focus:bg-white focus:ring-2 focus:ring-brand-200 transition-all text-sm"
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
                <div className="relative">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="relative text-slate-500 hover:text-brand-600 hover:bg-white/50 rounded-full h-10 w-10 transition-colors"
                        onClick={() => {
                            setShowNotifications(!showNotifications);
                            if (unreadCount > 0) markAsRead();
                        }}
                    >
                        <Bell className="w-5 h-5" />
                        {unreadCount > 0 && (
                            <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white shadow-sm ring-1 ring-red-500/30 animate-pulse"></span>
                        )}
                    </Button>

                    {/* Dropdown */}
                    {showNotifications && (
                        <>
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setShowNotifications(false)}
                            ></div>
                            <div className="absolute right-0 top-full mt-2 w-80 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 p-2 z-50 animate-scale-in origin-top-right">
                                <div className="flex justify-between items-center px-4 py-3 border-b border-slate-100">
                                    <h3 className="font-bold text-slate-800">Notifications</h3>
                                    <button className="text-xs text-brand-600 font-medium hover:underline">Mark all read</button>
                                </div>
                                <div className="max-h-[300px] overflow-y-auto">
                                    {notifications.length > 0 ? (
                                        notifications.map((n, i) => (
                                            <div key={i} className="p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h4 className="text-sm font-semibold text-slate-700 line-clamp-2 group-hover:text-brand-700">
                                                        {n.title}
                                                    </h4>
                                                    {!n.read && <span className="w-1.5 h-1.5 bg-brand-500 rounded-full flex-shrink-0 mt-1.5"></span>}
                                                </div>
                                                <p className="text-xs text-slate-400">{n.time}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center text-slate-400 text-sm">
                                            No new notifications
                                        </div>
                                    )}
                                </div>
                                <Link
                                    to="/notices"
                                    className="block text-center py-3 text-xs font-bold text-slate-500 hover:text-brand-600 border-t border-slate-100"
                                    onClick={() => setShowNotifications(false)}
                                >
                                    View All Notices
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
