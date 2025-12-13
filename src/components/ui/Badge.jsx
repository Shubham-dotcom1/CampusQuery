import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const variants = {
    default: 'bg-slate-100 text-slate-800',
    brand: 'bg-brand-100 text-brand-800',
    success: 'bg-accent-100 text-accent-700',
    warning: 'bg-yellow-100 text-yellow-800',
};

export default function Badge({ className, variant = 'default', children, ...props }) {
    return (
        <span
            className={cn(
                'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide',
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
}
