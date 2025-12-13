import React, { useState, useEffect } from 'react';
import { Search, Filter, Pin, Calendar, AlertCircle, Plus, X, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import Button from '../components/ui/Button';

export default function Notices() {
    const { user } = useAuth();
    const { success, error: notifyError } = useNotification();
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    // Admin Modal State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const categories = ['All', 'Academics', 'Exams', 'Hostel', 'Sports', 'General'];

    const fetchNotices = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/notices?category=${selectedCategory}`);
            const data = await res.json();
            setNotices(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotices();
    }, [selectedCategory]);

    const filteredNotices = notices.filter(notice =>
        notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notice.summary.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Campus Notices</h1>
                    <p className="text-slate-500">Stay updated with the latest official announcements.</p>
                </div>

                {/* Admin Add Button */}
                {user?.role === 'Admin' && (
                    <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2">
                        <Plus className="w-5 h-5" />
                        Add Notice
                    </Button>
                )}
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search notices..."
                        className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors
                                ${selectedCategory === cat
                                    ? 'bg-brand-600 text-white'
                                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}
                            `}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Notices Grid */}
            {loading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => <div key={i} className="h-48 bg-white/50 animate-pulse rounded-2xl"></div>)}
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredNotices.map(notice => (
                        <div key={notice._id} className="glass-card hover:shadow-lg transition-all p-6 border-l-4 border-l-brand-500 flex flex-col relative">
                            {notice.important && (
                                <div className="absolute top-4 right-4">
                                    <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-red-600 bg-red-50 px-2 py-1 rounded-full border border-red-100">
                                        <AlertCircle className="w-3 h-3" /> Important
                                    </span>
                                </div>
                            )}

                            <div className="mb-4">
                                <span className="inline-block px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">
                                    {notice.category}
                                </span>
                                <h3 className="text-xl font-bold text-slate-800 leading-snug">{notice.title}</h3>
                            </div>

                            <p className="text-slate-600 text-sm mb-6 flex-1">{notice.summary}</p>

                            <div className="flex items-center gap-2 text-xs font-medium text-slate-400 pt-4 border-t border-slate-50">
                                <Calendar className="w-4 h-4" />
                                {new Date(notice.date).toLocaleDateString()}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Notice Modal */}
            {isAddModalOpen && (
                <AddNoticeModal
                    onClose={() => setIsAddModalOpen(false)}
                    onSuccess={() => {
                        setIsAddModalOpen(false);
                        fetchNotices();
                        success('Notice published successfully!');
                    }}
                />
            )}
        </div>
    );
}

function AddNoticeModal({ onClose, onSuccess }) {
    const { user } = useAuth();
    const { error } = useNotification();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        category: 'General',
        date: new Date().toISOString().split('T')[0],
        summary: '',
        important: false
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = JSON.parse(localStorage.getItem('user'))?.token;
            const res = await fetch('http://localhost:5000/api/notices', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                onSuccess();
            } else {
                throw new Error('Failed to create notice');
            }
        } catch (err) {
            console.error(err);
            error('Failed to publish notice. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl p-6 relative animate-scale-in">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-xl font-bold text-slate-900 mb-1">Publish New Notice</h2>
                <p className="text-sm text-slate-500 mb-6">Create a new official announcement.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Title</label>
                        <input
                            required
                            type="text"
                            className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 focus:border-brand-500 outline-none"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Category</label>
                            <select
                                className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 focus:border-brand-500 outline-none"
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                            >
                                {['Academics', 'Exams', 'Hostel', 'Sports', 'General'].map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Date</label>
                            <input
                                required
                                type="date"
                                className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 focus:border-brand-500 outline-none"
                                value={formData.date}
                                onChange={e => setFormData({ ...formData, date: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="impt"
                            checked={formData.important}
                            onChange={e => setFormData({ ...formData, important: e.target.checked })}
                            className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
                        />
                        <label htmlFor="impt" className="text-sm font-medium text-slate-700">Mark as Important</label>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Summary</label>
                        <textarea
                            required
                            rows="4"
                            className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 focus:border-brand-500 outline-none resize-none"
                            placeholder="Detail the announcement here..."
                            value={formData.summary}
                            onChange={e => setFormData({ ...formData, summary: e.target.value })}
                        ></textarea>
                    </div>

                    <Button type="submit" className="w-full mt-2" disabled={loading}>
                        {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Publish Notice'}
                    </Button>
                </form>
            </div>
        </div>
    );
}
