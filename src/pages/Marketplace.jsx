import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, Plus, ShoppingBag, X, Loader2, Image as ImageIcon } from 'lucide-react';
import Button from '../components/ui/Button';

export default function Marketplace() {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [isSellModalOpen, setIsSellModalOpen] = useState(false);
    const [contactItem, setContactItem] = useState(null);

    // Fetch Products
    const fetchProducts = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/marketplace');
            if (res.ok) {
                const data = await res.json();
                setProducts(data);
            }
        } catch (error) {
            console.error("Failed to fetch products:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Filter Logic
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Student Marketplace</h1>
                    <p className="text-slate-500">Buy and sell items within the campus community.</p>
                </div>

                <Button
                    onClick={() => user ? setIsSellModalOpen(true) : alert('Please log in to sell items.')}
                    className={`flex items-center gap-2 ${!user && 'opacity-70'}`}
                >
                    <Plus className="w-5 h-5" />
                    {user ? 'Sell Item' : 'Login to Sell'}
                </Button>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search for books, electronics..."
                        className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                    {['All', 'Books', 'Electronics', 'Stationery', 'Furniture', 'Others'].map(cat => (
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

            {/* Product Grid */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-64 rounded-xl bg-white/50 animate-pulse"></div>
                    ))}
                </div>
            ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map(product => (
                        <ProductCard
                            key={product._id}
                            product={product}
                            onContact={() => setContactItem(product)}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">No items found matching your filters.</p>
                </div>
            )}

            {/* Sell Item Modal */}
            {isSellModalOpen && (
                <SellItemModal
                    onClose={() => setIsSellModalOpen(false)}
                    onSuccess={() => {
                        setIsSellModalOpen(false);
                        fetchProducts();
                    }}
                />
            )}

            {/* Contact/Buy Modal */}
            {contactItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 relative animate-scale-in text-center">
                        <button onClick={() => setContactItem(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                            <X className="w-5 h-5" />
                        </button>

                        <div className="w-16 h-16 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ShoppingBag className="w-8 h-8" />
                        </div>

                        <h3 className="text-xl font-bold text-slate-900 mb-1">Interested in buying?</h3>
                        <p className="text-sm text-slate-500 mb-6">Contact the seller directly to arrange the purchase.</p>

                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-left space-y-3 mb-6">
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase">Item</p>
                                <p className="font-semibold text-slate-800">{contactItem.title}</p>
                                <p className="text-brand-600 font-bold">₹{contactItem.price}</p>
                            </div>
                            <div className="border-t border-slate-200 pt-3">
                                <p className="text-xs font-bold text-slate-400 uppercase">Seller</p>
                                <p className="font-medium text-slate-800">{contactItem.seller?.name || 'Student'}</p>
                                <p className="text-sm text-slate-600 select-all font-mono bg-white p-1 rounded border border-slate-200 mt-1">
                                    {contactItem.seller?.email || 'No email provided'}
                                </p>
                            </div>
                        </div>

                        <Button
                            onClick={() => {
                                window.location.href = `mailto:${contactItem.seller?.email}?subject=Interested in ${contactItem.title}`;
                            }}
                            className="w-full"
                        >
                            Send Email
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

function ProductCard({ product, onContact }) {
    const getConditionColor = (condition) => {
        switch (condition) {
            case 'New': return 'bg-green-100 text-green-700';
            case 'Like New': return 'bg-blue-100 text-blue-700';
            case 'Used': return 'bg-yellow-100 text-yellow-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    return (
        <div className="glass-card group hover:shadow-lg transition-all overflow-hidden flex flex-col h-full">
            <div className="h-48 bg-slate-100 flex items-center justify-center relative overflow-hidden">
                {product.image ? (
                    <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                    <ShoppingBag className="w-12 h-12 text-slate-300" />
                )}
                <div className="absolute top-3 right-3">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${getConditionColor(product.condition)}`}>
                        {product.condition}
                    </span>
                </div>
            </div>
            <div className="p-4 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded">{product.category}</span>
                    <span className="text-xs text-slate-400">{new Date(product.createdAt).toLocaleDateString()}</span>
                </div>
                <h3 className="font-bold text-slate-800 mb-1 line-clamp-2">{product.title}</h3>
                <p className="text-lg font-extrabold text-slate-900 mb-4">₹{product.price}</p>

                <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600 uppercase">
                            {product.seller?.name?.charAt(0) || '?'}
                        </div>
                        <span className="text-xs text-slate-500 truncate max-w-[100px]">{product.seller?.name || 'Unknown'}</span>
                    </div>
                    <button
                        onClick={onContact}
                        className="px-3 py-1.5 rounded-lg bg-brand-50 text-brand-700 text-xs font-bold hover:bg-brand-100 transition-colors"
                    >
                        Buy / Contact
                    </button>
                </div>
            </div>
        </div>
    );
}

function SellItemModal({ onClose, onSuccess }) {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        category: 'Others',
        condition: 'Used',
        description: '',
        image: '',
        contact: user?.email || ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = JSON.parse(localStorage.getItem('user'))?.token;
            const res = await fetch('http://localhost:5000/api/marketplace', {
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
                alert('Failed to list item');
            }
        } catch (error) {
            console.error(error);
            alert('Error listing item');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl p-6 relative animate-scale-in max-h-[90vh] overflow-y-auto">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-xl font-bold text-slate-900 mb-1">Sell an Item</h2>
                <p className="text-sm text-slate-500 mb-6">List your item for sale in the marketplace.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Item Title</label>
                        <input
                            required
                            type="text"
                            className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 focus:border-brand-500 outline-none"
                            placeholder="e.g. Casio Calculator"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Price (₹)</label>
                            <input
                                required
                                type="number"
                                className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 focus:border-brand-500 outline-none"
                                placeholder="500"
                                value={formData.price}
                                onChange={e => setFormData({ ...formData, price: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Category</label>
                            <select
                                className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 focus:border-brand-500 outline-none"
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                            >
                                {['Books', 'Electronics', 'Stationery', 'Furniture', 'Others'].map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Condition</label>
                        <div className="flex gap-2 mt-1">
                            {['New', 'Like New', 'Used'].map(c => (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, condition: c })}
                                    className={`px-3 py-1.5 text-sm rounded-lg border transition-all ${formData.condition === c
                                            ? 'bg-brand-50 border-brand-500 text-brand-700 font-medium'
                                            : 'bg-white border-slate-200 text-slate-600'
                                        }`}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                            Image URL <ImageIcon className="w-3 h-3" />
                        </label>
                        <input
                            type="url"
                            className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 focus:border-brand-500 outline-none"
                            placeholder="https://example.com/image.jpg"
                            value={formData.image}
                            onChange={e => setFormData({ ...formData, image: e.target.value })}
                        />
                        {formData.image && (
                            <div className="mt-2 h-32 rounded-lg bg-slate-100 overflow-hidden border border-slate-200">
                                <img src={formData.image} alt="Preview" className="w-full h-full object-contain" onError={(e) => e.target.style.display = 'none'} />
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
                        <textarea
                            required
                            rows="3"
                            className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 focus:border-brand-500 outline-none resize-none"
                            placeholder="Describe the condition, features, etc."
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        ></textarea>
                    </div>

                    <Button type="submit" className="w-full mt-2" disabled={loading}>
                        {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'List Item'}
                    </Button>
                </form>
            </div>
        </div>
    );
}
