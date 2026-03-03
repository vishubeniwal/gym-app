import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', fullWidth, ...props }, ref) => {
        const variants = {
            primary: 'bg-brand-600 text-white hover:bg-brand-700 shadow-sm active:scale-95 transition-transform',
            secondary: 'bg-surface-100 dark:bg-surface-800 text-surface-900 dark:text-surface-100 hover:bg-surface-200 dark:hover:bg-surface-700 active:scale-95 transition-transform',
            outline: 'border border-surface-200 dark:border-surface-700 bg-transparent hover:bg-surface-50 dark:hover:bg-surface-800 text-surface-900 dark:text-surface-100 active:scale-95 transition-transform',
            ghost: 'bg-transparent hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-900 dark:text-surface-100 active:scale-95 transition-transform',
            danger: 'bg-danger-500 text-white hover:bg-danger-600 shadow-sm active:scale-95 transition-transform',
        };

        const sizes = {
            sm: 'h-8 px-3 text-sm',
            md: 'h-10 px-4 py-2',
            lg: 'h-12 px-6 text-lg',
            icon: 'h-10 w-10 flex items-center justify-center p-2',
        };

        return (
            <button
                ref={ref}
                className={cn(
                    'inline-flex items-center justify-center rounded-xl font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:opacity-50 disabled:pointer-events-none transition-colors duration-200',
                    variants[variant],
                    sizes[size],
                    fullWidth && 'w-full',
                    className
                )}
                {...props}
            />
        );
    }
);
Button.displayName = 'Button';
