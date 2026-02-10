'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login({ email, password });
        } catch {
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-6">
            <div className="w-full max-w-90 animate-fade-in-up">
                <div className="text-center mb-8">
                    <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-apple-gray-50 flex items-center justify-center">
                        <svg className="w-6 h-6 text-apple-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <h1 className="text-[28px] font-semibold text-apple-black tracking-[-0.03em] mb-1">
                        Sign in
                    </h1>
                    <p className="text-[15px] text-apple-gray-300">
                        to continue to FlowAgora
                    </p>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email-address" className="apple-label">
                            Email
                        </label>
                        <input
                            id="email-address"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="apple-input"
                            placeholder="name@example.com"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="apple-label">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="apple-input"
                            placeholder="Enter your password"
                        />
                    </div>

                    <div className="pt-3 space-y-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`btn-primary w-full justify-center ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Signing in...
                                </span>
                            ) : 'Sign In'}
                        </button>

                        <p className="text-center text-[13px] text-apple-gray-300">
                            Don&apos;t have an account?{' '}
                            <Link href="/register" className="text-apple-blue hover:underline font-medium">
                                Create one
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
