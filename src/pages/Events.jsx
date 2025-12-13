import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Calendar, MapPin, Clock, Plus, X, Loader2 } from 'lucide-react';
import Button from '../components/ui/Button';

export default function Events() {
    const { user } = useAuth();
    const { success } = useNotification();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const fetchEvents = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/events');
            if (res.ok) {
                const data = await res.json();
                setEvents(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Upcoming Events</h1>
                    <p className="text-slate-500">Don't miss out on campus activities.</p>
                </div>
                {user?.role === 'Admin' && (
                    <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2">
                        <Plus className="w-5 h-5" />
                        Add Event
                    </Button>
                )}
            </div>

            <div className="relative border-l-2 border-slate-200 ml-4 md:ml-6 space-y-8 pb-10">
                {loading ? (
                    <div className="pl-8"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>
                ) : events.map((event, idx) => (
                    <div key={event._id} className="relative pl-8 md:pl-10 group">
                        {/* Timeline Dot */}
                        <div className="absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-white border-4 border-brand-200 group-hover:border-brand-500 transition-colors"></div>

                        <div className="glass-card p-6 md:p-8 hover:scale-[1.01] transition-transform duration-300">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-800 mb-2">{event.title}</h3>
                                    <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-500">
                                        <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-full">
                                            <Calendar className="w-4 h-4 text-brand-500" />
                                            {new Date(event.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                        </span>
                                        <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-full">
                                            <Clock className="w-4 h-4 text-brand-500" />
                                            {event.time}
                                        </span>
                                        <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-full">
                                            <MapPin className="w-4 h-4 text-brand-500" />
                                            {event.location}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="inline-block px-3 py-1 rounded-lg bg-brand-50 text-brand-700 text-xs font-bold uppercase tracking-wider">
                                        {event.category}
                                    </span>
                                </div>
                            </div>

                            <p className="text-slate-600 leading-relaxed max-w-3xl">
                                {event.description}
                            </p>

                            <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-400 uppercase">
                                    Organized by <span className="text-slate-600">{event.organizer}</span>
                                </span>
                                <Button variant="outline" size="sm">Add to Calendar</Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Event Modal */}
            {isAddModalOpen && (
                <AddEventModal
                    onClose={() => setIsAddModalOpen(false)}
                    onSuccess={() => {
                        setIsAddModalOpen(false);
                        fetchEvents();
                        success('Event created successfully!');
                    }}
                />
            )}
        </div>
    );
}

function AddEventModal({ onClose, onSuccess }) {
    const { user } = useAuth();
    const { error } = useNotification();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        time: '',
        location: '',
        category: 'General',
        organizer: 'Student Council',
        description: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = JSON.parse(localStorage.getItem('user'))?.token;
            const res = await fetch('http://localhost:5000/api/events', {
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
                throw new Error('Failed to create event');
            }
        } catch (err) {
            console.error(err);
            error('Failed to create event.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl p-6 relative animate-scale-in max-h-[90vh] overflow-y-auto">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-xl font-bold text-slate-900 mb-1">Create New Event</h2>
                <p className="text-sm text-slate-500 mb-6">Schedule a new campus event.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Event Title</label>
                        <input
                            required
                            className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 focus:border-brand-500 outline-none"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
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
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Time</label>
                            <input
                                required
                                type="time"
                                className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 focus:border-brand-500 outline-none"
                                value={formData.time}
                                onChange={e => setFormData({ ...formData, time: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Location</label>
                            <input
                                required
                                className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 focus:border-brand-500 outline-none"
                                value={formData.location}
                                onChange={e => setFormData({ ...formData, location: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Category</label>
                            <input
                                className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 focus:border-brand-500 outline-none"
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
                        <textarea
                            required
                            rows="3"
                            className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 focus:border-brand-500 outline-none resize-none"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        ></textarea>
                    </div>

                    <Button type="submit" className="w-full mt-2" disabled={loading}>
                        {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Create Event'}
                    </Button>
                </form>
            </div>
        </div>
    );
}
