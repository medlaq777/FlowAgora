'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
    const { user, logout, isAuthenticated } = useAuth();
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const isActive = (path: string) => pathname === path;

    return (
        <nav className="fixed top-0 inset-x-0 z-40 bg-white/80 backdrop-blur-md border-b border-apple-gray-100" role="navigation" aria-label="Main navigation">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 font-semibold text-xl tracking-tight hover:opacity-80 transition-opacity" aria-label="FlowAgora home">
                    <div className="w-8 h-8 rounded-lg bg-apple-blue flex items-center justify-center text-white" aria-hidden="true">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <span className="bg-clip-text text-transparent bg-linear-to-r from-apple-black to-apple-gray-400">
                        FlowAgora
                    </span>
                </Link>
                <div className="hidden md:flex items-center gap-6 text-[13px] font-medium text-apple-gray-500">
                    <Link
                        href="/events"
                        className={`transition-colors hover:text-apple-black ${isActive('/events') ? 'text-apple-black' : ''}`}
                        aria-current={isActive('/events') ? 'page' : undefined}
                    >
                        Explore
                    </Link>

                    {isAuthenticated ? (
                        <>
                            {user?.role === 'ADMIN' ? (
                                <Link
                                    href="/admin"
                                    className={`transition-colors hover:text-apple-black ${isActive('/admin') ? 'text-apple-black' : ''}`}
                                    aria-current={isActive('/admin') ? 'page' : undefined}
                                >
                                    Admin
                                </Link>
                            ) : (
                                <Link
                                    href="/dashboard"
                                    className={`transition-colors hover:text-apple-black ${isActive('/dashboard') ? 'text-apple-black' : ''}`}
                                    aria-current={isActive('/dashboard') ? 'page' : undefined}
                                >
                                    Dashboard
                                </Link>
                            )}

                            <div className="h-4 w-px bg-apple-gray-200" aria-hidden="true" />

                            <div className="flex items-center gap-3">
                                <span className="text-apple-black" aria-label={`Logged in as ${user?.firstName}`}>
                                    {user?.firstName}
                                </span>
                                <button
                                    onClick={logout}
                                    className="text-apple-gray-400 hover:text-apple-red transition-colors"
                                    aria-label="Sign out"
                                >
                                    Sign Out
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="h-4 w-px bg-apple-gray-200" aria-hidden="true" />
                            <Link
                                href="/login"
                                className={`transition-colors hover:text-apple-black ${isActive('/login') ? 'text-apple-black' : ''}`}
                                aria-current={isActive('/login') ? 'page' : undefined}
                            >
                                Sign In
                            </Link>
                            <Link href="/register" className="btn-primary py-1.5 px-4 text-xs font-semibold">
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden p-2 text-apple-gray-500 hover:text-apple-black transition-colors"
                    aria-label="Toggle mobile menu"
                    aria-expanded={mobileMenuOpen}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {mobileMenuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-apple-gray-100 bg-white/95 backdrop-blur-md">
                    <div className="px-4 py-4 space-y-3">
                        <Link
                            href="/events"
                            className={`block py-2 text-base font-medium transition-colors ${isActive('/events') ? 'text-apple-black' : 'text-apple-gray-500'}`}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Explore Events
                        </Link>

                        {isAuthenticated ? (
                            <>
                                <Link
                                    href={user?.role === 'ADMIN' ? '/admin' : '/dashboard'}
                                    className={`block py-2 text-base font-medium transition-colors ${isActive(user?.role === 'ADMIN' ? '/admin' : '/dashboard') ? 'text-apple-black' : 'text-apple-gray-500'}`}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {user?.role === 'ADMIN' ? 'Admin Dashboard' : 'My Dashboard'}
                                </Link>

                                <div className="border-t border-apple-gray-100 pt-3 mt-3">
                                    <p className="text-sm text-apple-gray-400 mb-2">Signed in as {user?.firstName}</p>
                                    <button
                                        onClick={() => {
                                            logout();
                                            setMobileMenuOpen(false);
                                        }}
                                        className="w-full text-left py-2 text-base font-medium text-apple-red"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className={`block py-2 text-base font-medium transition-colors ${isActive('/login') ? 'text-apple-black' : 'text-apple-gray-500'}`}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/register"
                                    className="block btn-primary w-full text-center"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
