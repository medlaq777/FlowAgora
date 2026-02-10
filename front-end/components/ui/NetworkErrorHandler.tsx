/**
 * NetworkErrorHandler Component
 * Detects network status and displays banner when offline
 */

'use client';

import { useEffect, useState } from 'react';

/**
 * Hook to check network status
 */
export function useNetworkStatus() {
    const [isOnline, setIsOnline] = useState(() => {
        if (typeof window !== 'undefined') {
            return navigator.onLine;
        }
        return true;
    });

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
        };

        const handleOffline = () => {
            setIsOnline(false);
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return isOnline;
}

export default function NetworkErrorHandler() {
    const isOnline = useNetworkStatus();
    const [wasOffline, setWasOffline] = useState(false);
    const [showOnlineMessage, setShowOnlineMessage] = useState(false);

    useEffect(() => {
        if (!isOnline) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setWasOffline(true);
            setShowOnlineMessage(false);
        } else if (wasOffline) {
            setShowOnlineMessage(true);
            const timer = setTimeout(() => {
                setShowOnlineMessage(false);
                setWasOffline(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isOnline, wasOffline]);

    if (!isOnline) {
        return (
            <div
                className="fixed top-16 left-0 right-0 z-50 bg-apple-red text-white px-4 py-3 text-center text-sm font-medium animate-slide-down"
                role="alert"
                aria-live="assertive"
            >
                <div className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
                    </svg>
                    You&apos;re offline. Please check your internet connection.
                </div>
            </div>
        );
    }

    if (showOnlineMessage) {
        return (
            <div
                className="fixed top-16 left-0 right-0 z-50 bg-apple-green text-white px-4 py-3 text-center text-sm font-medium animate-slide-down"
                role="alert"
                aria-live="polite"
            >
                <div className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    You&apos;re back online!
                </div>
            </div>
        );
    }

    return null;
}
