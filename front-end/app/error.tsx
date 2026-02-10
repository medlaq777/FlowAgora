/**
 * Global Error Page
 * Catches and displays errors at the app level
 */

'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Global error:', error);
    }, [error]);

    return (
        <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-6">
            <div className="max-w-lg w-full text-center animate-fade-in-up">
                <div className="text-center max-w-md">
                    <div className="w-16 h-16 rounded-full bg-apple-red/10 flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-apple-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h1 className="text-[28px] font-bold text-apple-black mb-3">Something went wrong</h1>
                    <p className="text-[15px] text-apple-gray-400 mb-6">
                        We&apos;re sorry, but something unexpected happened. Don&apos;t worry, we&apos;re on it!
                    </p>
                    <div className="flex items-center gap-3 justify-center">
                        <button
                            onClick={() => reset()}
                            className="btn-primary"
                        >
                            Try Again
                        </button>
                        <Link href="/" className="btn-secondary">
                            Go Home
                        </Link>
                    </div>
                </div>

                {process.env.NODE_ENV === 'development' && (
                    <details className="mb-8 text-left bg-apple-gray-50 rounded-xl p-4">
                        <summary className="text-[13px] text-apple-gray-400 cursor-pointer hover:text-apple-black mb-2 font-medium">
                            Error details (development only)
                        </summary>
                        <pre className="text-[11px] text-red-600 font-mono overflow-auto mt-2">
                            {error.message}
                            {error.stack && `\n\n${error.stack}`}
                        </pre>
                        {error.digest && (
                            <p className="text-[11px] text-apple-gray-400 mt-2">
                                Error ID: {error.digest}
                            </p>
                        )}
                    </details>
                )}

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button onClick={reset} className="btn-primary w-full sm:w-auto">
                        Try Again
                    </button>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="btn-secondary w-full sm:w-auto"
                    >
                        Go to Home
                    </button>
                </div>

                <p className="mt-8 text-[13px] text-apple-gray-300">
                    If this problem persists, please{' '}
                    <a href="mailto:support@flowagora.com" className="text-apple-blue hover:underline">
                        contact support
                    </a>
                </p>
            </div>
        </div>
    );
}
