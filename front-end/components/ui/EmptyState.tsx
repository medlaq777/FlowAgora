/**
 * EmptyState Component
 * Displays a user-friendly empty state with optional icon, message, and CTA
 */

import Link from 'next/link';

export type EmptyStateIcon = 'calendar' | 'search' | 'users' | 'inbox' | 'alert' | 'custom';

interface EmptyStateProps {
    icon?: EmptyStateIcon;
    customIcon?: React.ReactNode;
    title: string;
    description?: string;
    action?: {
        label: string;
        href?: string;
        onClick?: () => void;
    };
    className?: string;
}

const iconMap: Record<EmptyStateIcon, React.ReactNode> = {
    calendar: (
        <svg className="w-8 h-8 text-apple-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    ),
    search: (
        <svg className="w-8 h-8 text-apple-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
    ),
    users: (
        <svg className="w-8 h-8 text-apple-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
    ),
    inbox: (
        <svg className="w-8 h-8 text-apple-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
    ),
    alert: (
        <svg className="w-8 h-8 text-apple-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
    ),
    custom: null,
};

export default function EmptyState({
    icon = 'inbox',
    customIcon,
    title,
    description,
    action,
    className = '',
}: EmptyStateProps) {
    const iconElement = customIcon || iconMap[icon];

    return (
        <div className={`apple-card p-20 text-center ${className}`} role="status" aria-live="polite">
            {iconElement && (
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-apple-gray-50 flex items-center justify-center">
                    {iconElement}
                </div>
            )}

            <h3 className="text-apple-gray-400 text-lg font-medium mb-1">
                {title}
            </h3>

            {description && (
                <p className="text-apple-gray-300 text-sm mt-1 max-w-md mx-auto leading-relaxed">
                    {description}
                </p>
            )}

            {action && (
                <div className="mt-6">
                    {action.href ? (
                        <Link href={action.href} className="btn-primary inline-flex items-center gap-2 text-[14px] py-2.5 px-6">
                            {action.label}
                        </Link>
                    ) : (
                        <button
                            onClick={action.onClick}
                            className="btn-primary inline-flex items-center gap-2 text-[14px] py-2.5 px-6"
                        >
                            {action.label}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
