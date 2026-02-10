/**
 * Custom 404 Not Found Page
 */

import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-6">
            <div className="max-w-lg w-full text-center animate-fade-in-up">
                <div className="w-20 h-20 mx-auto mb-8 rounded-3xl bg-apple-gray-50 flex items-center justify-center">
                    <svg className="w-10 h-10 text-apple-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>

                <h1 className="text-[64px] font-bold text-apple-black tracking-[-0.04em] leading-none mb-4">
                    404
                </h1>

                <h1 className="text-[32px] font-bold text-apple-black mb-3">Page Not Found</h1>
                <p className="text-[17px] text-apple-gray-400 mb-8">
                    We couldn&apos;t find the page you&apos;re looking for. It might have been moved or deleted.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link href="/" className="btn-primary w-full sm:w-auto">
                        Go to Home
                    </Link>
                    <Link href="/events" className="btn-secondary w-full sm:w-auto">
                        Browse Events
                    </Link>
                </div>

                <div className="mt-12 pt-8 border-t border-apple-gray-100">
                    <p className="text-[13px] text-apple-gray-300 mb-3">
                        Looking for something specific?
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4 text-[13px]">
                        <Link href="/events" className="text-apple-blue hover:underline">
                            Events
                        </Link>
                        <span className="text-apple-gray-200">•</span>
                        <Link href="/dashboard" className="text-apple-blue hover:underline">
                            Dashboard
                        </Link>
                        <span className="text-apple-gray-200">•</span>
                        <Link href="/login" className="text-apple-blue hover:underline">
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
