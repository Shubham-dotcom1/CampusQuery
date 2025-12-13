import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, Sparkles, Bell, Calendar, ShoppingBag, BookOpen, MapPin, ArrowRight, Loader2 } from 'lucide-react';

export default function Home() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [notices, setNotices] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const suggestions = [
        "Mess payment process",
        "Library timings",
        "Bus schedule",
        "Next tech event"
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [noticesRes, eventsRes] = await Promise.all([
                    fetch('http://localhost:5000/api/notices'),
                    fetch('http://localhost:5000/api/events')
                ]);

                if (noticesRes.ok) {
                    const data = await noticesRes.json();
                    setNotices(data.slice(0, 3)); // Get top 3
                }
                if (eventsRes.ok) {
                    const data = await eventsRes.json();
                    setEvents(data.slice(0, 3));
                }
            } catch (error) {
                console.error("Error fetching home data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate('/chat', { state: { initialQuery: searchQuery } });
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-12 pb-10">
            {/* 1. Welcome & Search Section */}
            <section className="text-center space-y-6 pt-8">
                <div className="space-y-2">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-accent-600 animate-fade-in">
                        Welcome to CampusQuery {user ? `, ${user.name.split(' ')[0]} 👋` : '👋'}
                    </h1>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto animate-slide-up">
                        Your campus, simplified. Ask questions, explore events, and stay updated.
                    </p>
                </div>

                {/* Global Search */}
                <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto group animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
                    </div>
                    <input
                        type="text"
                        className="w-full pl-12 pr-16 py-4 rounded-2xl bg-white border border-slate-200 shadow-sm focus:ring-4 focus:ring-brand-100 focus:border-brand-400 transition-all outline-none text-lg placeholder:text-slate-400"
                        placeholder="Search for notices, events, or ask AI..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="absolute inset-y-0 right-2 flex items-center">
                        <button type="submit" className="p-2 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition-colors">
                            <ArrowRight className="h-5 w-5" />
                        </button>
                    </div>
                </form>

                {/* AI Suggestions */}
                <div className="flex flex-wrap justify-center gap-2 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <span className="text-sm font-medium text-slate-400 py-1.5">Students often ask:</span>
                    {suggestions.map((suggestion) => (
                        <button
                            key={suggestion}
                            onClick={() => navigate('/chat', { state: { initialQuery: suggestion } })}
                            className="text-sm px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600 hover:border-brand-300 hover:text-brand-600 hover:bg-brand-50 transition-all"
                        >
                            {suggestion}
                        </button>
                    ))}
                </div>
            </section>

            {/* 2. Quick Actions Grid */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                <QuickCard to="/chat" icon={Sparkles} title="Ask AI" desc="Instant answers" color="bg-purple-500" />
                <QuickCard to="/notices" icon={Bell} title="Notices" desc="Latest updates" color="bg-blue-500" />
                <QuickCard to="/events" icon={Calendar} title="Events" desc="What's happening" color="bg-pink-500" />
                <QuickCard to="/marketplace" icon={ShoppingBag} title="Market" desc="Buy & Sell" color="bg-orange-500" />
            </section>

            <div className="grid md:grid-cols-3 gap-8 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                {/* 3. Latest Notices */}
                <div className="md:col-span-2 space-y-4">
                    <SectionHeader title="Latest Notices" link="/notices" />
                    <div className="space-y-3">
                        {loading ? (
                            <SkeletonLoader count={3} />
                        ) : notices.length > 0 ? (
                            notices.map((notice) => (
                                <Link
                                    to="/notices"
                                    key={notice._id}
                                    className="block p-4 rounded-xl bg-white/60 border border-slate-100 hover:border-brand-200 hover:shadow-md transition-all group"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold text-slate-800 group-hover:text-brand-700 transition-colors line-clamp-1">
                                                {notice.title}
                                            </h3>
                                            <p className="text-sm text-slate-500 mt-1 line-clamp-1">{notice.summary}</p>
                                        </div>
                                        {notice.important && (
                                            <span className="px-2 py-1 text-[10px] font-bold bg-red-100 text-red-600 rounded">
                                                IMPORTANT
                                            </span>
                                        )}
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <EmptyState message="No recent notices found." />
                        )}
                    </div>
                </div>

                {/* 4. Upcoming Events */}
                <div className="space-y-4">
                    <SectionHeader title="Upcoming Events" link="/events" />
                    <div className="space-y-3">
                        {loading ? (
                            <SkeletonLoader count={3} />
                        ) : events.length > 0 ? (
                            events.map((event) => (
                                <Link
                                    to="/events"
                                    key={event._id}
                                    className="block p-4 rounded-xl bg-white/60 border border-slate-100 hover:border-brand-200 hover:shadow-md transition-all"
                                >
                                    <div className="flex gap-3">
                                        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-brand-50 flex flex-col items-center justify-center text-brand-600 border border-brand-100">
                                            <span className="text-xs font-bold uppercase">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                                            <span className="text-sm font-extrabold">{new Date(event.date).getDate()}</span>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-slate-800 line-clamp-1">{event.title}</h4>
                                            <p className="text-xs text-slate-500 mt-1">{event.location}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <EmptyState message="No upcoming events." />
                        )}
                    </div>
                </div>
            </div>

            {/* 5. Marketplace Preview (Mock) */}
            <section className="space-y-4 animate-slide-up" style={{ animationDelay: '0.5s' }}>
                <SectionHeader title="Marketplace Picks" link="/marketplace" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { title: "Engineering Math Textbook", price: "₹250", img: "📚" },
                        { title: "Scientific Calculator (Casio)", price: "₹400", img: "🖩" },
                        { title: "Hostel Table Lamp", price: "₹150", img: "💡" },
                        { title: "Blue Bicycle (Gear)", price: "₹2500", img: "🚲" },
                    ].map((item, i) => (
                        <div key={i} className="glass-card p-4 hover:shadow-lg transition-all cursor-pointer group">
                            <div className="h-24 bg-slate-50 rounded-lg flex items-center justify-center text-4xl mb-3 group-hover:scale-105 transition-transform">
                                {item.img}
                            </div>
                            <h4 className="font-medium text-slate-800 text-sm line-clamp-1">{item.title}</h4>
                            <p className="text-brand-600 font-bold text-sm mt-1">{item.price}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

// Subcomponents
function QuickCard({ to, icon: Icon, title, desc, color }) {
    return (
        <Link to={to} className="glass-card p-4 hover:shadow-lg hover:-translate-y-1 transition-all group">
            <div className={`w-10 h-10 rounded-lg ${color} bg-opacity-10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <Icon className={`w-5 h-5 ${color.replace('bg-', 'text-')}`} />
            </div>
            <h3 className="font-bold text-slate-800">{title}</h3>
            <p className="text-xs text-slate-500">{desc}</p>
        </Link>
    );
}

function SectionHeader({ title, link }) {
    return (
        <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-900">{title}</h2>
            <Link to={link} className="text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
            </Link>
        </div>
    );
}

function SkeletonLoader({ count }) {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/40 border border-slate-100 animate-pulse">
                    <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                </div>
            ))}
        </>
    );
}

function EmptyState({ message }) {
    return (
        <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <p className="text-slate-400 text-sm">{message}</p>
        </div>
    );
}
