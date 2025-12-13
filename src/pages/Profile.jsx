import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Book, LogOut, ShoppingBag, Trash2, Calendar, MapPin, Loader2 } from 'lucide-react';
import Button from '../components/ui/Button';

export default function Profile() {
    const { user, logout } = useAuth();
    const [myListings, setMyListings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchMyListings();
        }
    }, [user]);

    const fetchMyListings = async () => {
        try {
            // In a real app, we'd have a specific endpoint or filter. 
            // For now, we fetch all and filter client-side since we are the seller.
            // OPTIMIZATION: Created a specific endpoint in future.
            const res = await fetch('http://localhost:5000/api/marketplace');
            if (res.ok) {
                const data = await res.json();
                // Filter where seller._id matches current user id
                // Note: user object might change format depending on auth response
                const myId = user.id || user._id;
                const myItems = data.filter(item => item.seller?._id === myId || item.seller === myId);
                setMyListings(myItems);
            }
        } catch (error) {
            console.error("Error fetching listings:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteListing = async (productId) => {
        if (!window.confirm("Are you sure you want to remove this item?")) return;

        // Mock deletion for now as we didn't add DELETE route explicitly in the concise plan
        // In real backend, we'd call DELETE /api/marketplace/:id
        // For this demo, we'll just update UI to feel responsive
        setMyListings(prev => prev.filter(item => item._id !== productId));
        alert("Item removed (simulated)");
    };

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center">
                    <User className="w-10 h-10 text-slate-400" />
                </div>
                <h2 className="text-2xl font-bold text-slate-700">Guest User</h2>
                <p className="text-slate-500">Please sign in to view your profile.</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-10">
            {/* Header / Banner */}
            <div className="relative h-48 rounded-3xl bg-gradient-to-r from-brand-500 to-accent-500 overflow-hidden">
                <div className="absolute inset-0 bg-white/10 pattern-grid-lg"></div>
            </div>

            {/* Profile Info Card */}
            <div className="relative px-6 -mt-20">
                <div className="glass-card p-6 flex flex-col md:flex-row items-start md:items-end gap-6 relative z-10">
                    <div className="w-32 h-32 rounded-2xl bg-white p-1 shadow-xl -mt-16 md:-mt-24">
                        <div className="w-full h-full bg-slate-100 rounded-xl flex items-center justify-center text-4xl font-bold text-slate-400 uppercase">
                            {user.name?.charAt(0)}
                        </div>
                    </div>

                    <div className="flex-1 space-y-1">
                        <h1 className="text-3xl font-bold text-slate-900">{user.name}</h1>
                        <p className="text-slate-500 font-medium flex items-center gap-2">
                            <Shield className="w-4 h-4 text-brand-600" />
                            {user.role}
                            <span className="text-slate-300">•</span>
                            <span className="text-slate-400">{user.department || 'General Sciences'}</span>
                        </p>
                    </div>

                    <Button variant="outline" onClick={logout} className="ml-auto flex items-center gap-2 text-red-600 border-red-100 hover:bg-red-50 hover:border-red-200">
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </Button>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="glass-card p-6 space-y-4">
                        <h3 className="font-bold text-slate-900 text-lg">About</h3>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                <Mail className="w-4 h-4 text-slate-400" />
                                {user.email}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                <Book className="w-4 h-4 text-slate-400" />
                                {user.department || 'No Dept. Assigned'}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                <Calendar className="w-4 h-4 text-slate-400" />
                                Joined Dec 2024
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content: Activity */}
                <div className="md:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <ShoppingBag className="w-5 h-5 text-brand-600" />
                            My Marketplace Listings
                        </h2>
                        <span className="text-xs font-bold bg-brand-100 text-brand-700 px-2 py-1 rounded-full">
                            {myListings.length}
                        </span>
                    </div>

                    {loading ? (
                        <div className="py-10 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-slate-400" /></div>
                    ) : myListings.length > 0 ? (
                        <div className="grid gap-4">
                            {myListings.map(item => (
                                <div key={item._id} className="glass-card p-4 flex gap-4 items-center group">
                                    <div className="w-16 h-16 bg-slate-100 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                                        {item.image ? (
                                            <img src={item.image} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <ShoppingBag className="w-6 h-6 text-slate-300" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-slate-800 line-clamp-1">{item.title}</h4>
                                        <p className="text-sm text-brand-600 font-bold">₹{item.price}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500`}>
                                                {item.status}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteListing(item._id)}
                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete Listing"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-12 bg-white/50 rounded-2xl border border-dashed border-slate-200 text-center">
                            <p className="text-slate-500 text-sm">You haven't listed any items yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
