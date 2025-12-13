import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export default function Input({ className, icon: Icon, ...props }) {
    return (
        <div className="relative">
            {Icon && (
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Icon size={18} />
                </div>
            )}
            <input
                className={cn(
                    'block w-full rounded-xl border-slate-200 bg-slate-50 text-slate-900 focus:border-brand-500 focus:ring-brand-500 sm:text-sm py-2.5 transition-colors',
                    Icon ? 'pl-10' : 'pl-4',
                    className
                )}
                {...props}
            />
        </div>
    );
}
