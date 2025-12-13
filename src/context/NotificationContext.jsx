import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const NotificationContext = createContext();

export function useNotification() {
    return useContext(NotificationContext);
}

export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState([]);

    const addNotification = useCallback((type, message, duration = 5000) => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, type, message }]);

        setTimeout(() => {
            removeNotification(id);
        }, duration);
    }, []);

    const removeNotification = useCallback((id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    const success = (msg) => addNotification('success', msg);
    const error = (msg) => addNotification('error', msg);
    const info = (msg) => addNotification('info', msg);

    return (
        <NotificationContext.Provider value={{ addNotification, removeNotification, success, error, info }}>
            {children}
            {/* Toast Container */}
            <div className="fixed top-4 right-4 z-[100] space-y-2 pointer-events-none">
                {notifications.map(n => (
                    <div
                        key={n.id}
                        className={`
                            pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border animate-slide-in-right
                            ${n.type === 'success' ? 'bg-white border-green-200 text-green-800' : ''}
                            ${n.type === 'error' ? 'bg-white border-red-200 text-red-800' : ''}
                            ${n.type === 'info' ? 'bg-white border-blue-200 text-blue-800' : ''}
                        `}
                    >
                        {n.type === 'success' && <CheckCircle className="w-5 h-5 text-green-500" />}
                        {n.type === 'error' && <AlertCircle className="w-5 h-5 text-red-500" />}
                        {n.type === 'info' && <Info className="w-5 h-5 text-blue-500" />}

                        <p className="text-sm font-medium">{n.message}</p>

                        <button onClick={() => removeNotification(n.id)} className="ml-2 text-slate-400 hover:text-slate-600">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </NotificationContext.Provider>
    );
}
