import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export default function Card({ className, children, ...props }) {
    return (
        <div
            className={cn('glass-card rounded-2xl p-6 bg-white', className)}
            {...props}
        >
            {children}
        </div>
    );
}
