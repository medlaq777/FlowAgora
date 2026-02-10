/**
 * Alert Component
 * Inline alert/notification component with variants and dismissible option
 */

'use client';

import { useState } from 'react';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

interface AlertProps {
    variant?: AlertVariant;
    title?: string;
    children: React.ReactNode;
    dismissible?: boolean;
    onDismiss?: () => void;
    className?: string;
    icon?: React.ReactNode;
}

const variantStyles: Record<AlertVariant, string> = {
    info: 'bg-blue-50 text-blue-600 border-blue-100',
    success: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    warning: 'bg-amber-50 text-amber-600 border-amber-100',
    error: 'bg-red-50 text-red-600 border-red-100',
};

const defaultIcons: Record<AlertVariant, React.ReactNode> = {
    info: (
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    success: (
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    warning: (
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
    ),
    error: (
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
};

export default function Alert({
    variant = 'info',
    title,
    children,
    dismissible = false,
    onDismiss,
    className = '',
    icon,
}: AlertProps) {
    const [isVisible, setIsVisible] = useState(true);

    const handleDismiss = () => {
        setIsVisible(false);
        onDismiss?.();
    };

    if (!isVisible) return null;

    const displayIcon = icon !== undefined ? icon : defaultIcons[variant];

    return (
        <div
            className={`rounded-xl border px-4 py-3 ${variantStyles[variant]} ${className}`}
            role="alert"
            aria-live="polite"
        >
            <div className="flex items-start gap-3">
                {displayIcon && <div className="mt-0.5">{displayIcon}</div>}

                <div className="flex-1 min-w-0">
                    {title && (
                        <h4 className="font-semibold text-sm mb-1">
                            {title}
                        </h4>
                    )}
                    <div className="text-sm leading-relaxed">
                        {children}
                    </div>
                </div>

                {dismissible && (
                    <button
                        onClick={handleDismiss}
                        className="shrink-0 p-1 hover:opacity-70 transition-opacity rounded-md focus:outline-none focus:ring-2 focus:ring-current focus:ring-offset-2"
                        aria-label="Dismiss alert"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
}
