'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const { user, logout, isAuthenticated } = useAuth();
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    return (
        <nav className="fixed top-0 inset-x-0 z-40 bg-white/80 backdrop-blur-md border-b border-apple-gray-100">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 font-semibold text-xl tracking-tight hover:opacity-80 transition-opacity">
                    <div className="w-8 h-8 rounded-lg bg-apple-blue flex items-center justify-center text-white">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-apple-black to-apple-gray-400">
                        FlowAgora
                    </span>
                </Link>

                <div className="flex items-center gap-6 text-[13px] font-medium text-apple-gray-500">
                    <Link href="/events" className={`transition-colors hover:text-apple-black ${isActive('/events') ? 'text-apple-black' : ''}`}>
                        Explore
                    </Link>

                    {isAuthenticated ? (
                        <>
                            {user?.role === 'ADMIN' ? (
                                <Link href="/admin" className={`transition-colors hover:text-apple-black ${isActive('/admin') ? 'text-apple-black' : ''}`}>
                                    Admin
                                </Link>
                            ) : (
                                <Link href="/dashboard" className={`transition-colors hover:text-apple-black ${isActive('/dashboard') ? 'text-apple-black' : ''}`}>
                                    Dashboard
                                </Link>
                            )}

                            <div className="h-4 w-px bg-apple-gray-200" />

                            <div className="flex items-center gap-3">
                                <span className="text-apple-black">{user?.firstName}</span>
                                <button onClick={logout} className="text-apple-gray-400 hover:text-apple-red transition-colors">
                                    Sign Out
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="h-4 w-px bg-apple-gray-200" />
                            <Link href="/login" className={`transition-colors hover:text-apple-black ${isActive('/login') ? 'text-apple-black' : ''}`}>
                                Sign In
                            </Link>
                            <Link href="/register" className="btn-primary py-1.5 px-4 text-xs font-semibold">
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
