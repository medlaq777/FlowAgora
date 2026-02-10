'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usersService } from '@/services/users.service';
import { useToast } from '@/context/ToastContext';

type Role = 'PARTICIPANT' | 'ADMIN';

export default function RegisterPage() {
    const router = useRouter();
    const toast = useToast();
    const [step, setStep] = useState<'role' | 'details'>('role');
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await usersService.create({
                firstName: form.firstName.trim(),
                lastName: form.lastName.trim(),
                email: form.email.trim(),
                password: form.password,
                role: selectedRole || 'PARTICIPANT',
            });
            toast.success('Account created! Please log in.');
            router.push('/login');
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Registration failed';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-6 py-12">
            <div className="w-full max-w-120 animate-fade-in-up">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-[20px] bg-linear-to-br from-apple-blue/10 to-apple-purple/10 flex items-center justify-center">
                        <svg className="w-7 h-7 text-apple-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                    </div>
                    <h1 className="text-[32px] font-semibold text-apple-black tracking-[-0.03em] mb-2">
                        {step === 'role' ? 'Join FlowAgora' : 'Create your account'}
                    </h1>
                    <p className="text-[17px] text-apple-gray-300 leading-relaxed">
                        {step === 'role'
                            ? 'Choose how you want to use the platform.'
                            : `Signing up as ${selectedRole === 'ADMIN' ? 'an Event Organizer' : 'a Participant'}`
                        }
                    </p>
                </div>

                {/* Step indicator */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    <div className={`h-1 rounded-full transition-all duration-500 ${step === 'role' ? 'w-8 bg-apple-blue' : 'w-3 bg-apple-gray-200'}`} />
                    <div className={`h-1 rounded-full transition-all duration-500 ${step === 'details' ? 'w-8 bg-apple-blue' : 'w-3 bg-apple-gray-200'}`} />
                </div>

                {step === 'role' ? (
                    /* Role Selection Step */
                    <div className="space-y-4 animate-fade-in">
                        <button
                            type="button"
                            onClick={() => { setSelectedRole('PARTICIPANT'); setStep('details'); }}
                            className="w-full group"
                        >
                            <div className={`relative overflow-hidden rounded-2xl border-2 p-6 text-left transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,113,227,0.12)] border-apple-gray-100 hover:border-apple-blue/40 bg-white`}>
                                <div className="flex items-start gap-5">
                                    <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-apple-blue/10 to-apple-teal/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                                        <svg className="w-7 h-7 text-apple-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-[18px] font-semibold text-apple-black mb-1 group-hover:text-apple-blue transition-colors">
                                            Participant
                                        </h3>
                                        <p className="text-[14px] text-apple-gray-300 leading-relaxed">
                                            Discover and reserve spots at events. Track your bookings and get tickets.
                                        </p>
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-apple-blue/6 text-apple-blue">Browse Events</span>
                                            <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600">Make Reservations</span>
                                        </div>
                                    </div>
                                    <svg className="w-5 h-5 text-apple-gray-200 group-hover:text-apple-blue group-hover:translate-x-1 transition-all mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </button>

                        <button
                            type="button"
                            onClick={() => { setSelectedRole('ADMIN'); setStep('details'); }}
                            className="w-full group"
                        >
                            <div className={`relative overflow-hidden rounded-2xl border-2 p-6 text-left transition-all duration-300 hover:shadow-[0_8px_30px_rgba(175,82,222,0.12)] border-apple-gray-100 hover:border-apple-purple/40 bg-white`}>
                                <div className="flex items-start gap-5">
                                    <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-apple-purple/10 to-apple-orange/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                                        <svg className="w-7 h-7 text-apple-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-[18px] font-semibold text-apple-black mb-1 group-hover:text-apple-purple transition-colors">
                                            Event Organizer
                                        </h3>
                                        <p className="text-[14px] text-apple-gray-300 leading-relaxed">
                                            Create and manage events. Handle reservations and track attendance.
                                        </p>
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-apple-purple/8 text-apple-purple">Create Events</span>
                                            <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-amber-50 text-amber-600">Manage Bookings</span>
                                        </div>
                                    </div>
                                    <svg className="w-5 h-5 text-apple-gray-200 group-hover:text-apple-purple group-hover:translate-x-1 transition-all mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </button>

                        <p className="text-center text-[13px] text-apple-gray-300 pt-4">
                            Already have an account?{' '}
                            <Link href="/login" className="text-apple-blue hover:underline font-medium">
                                Sign in
                            </Link>
                        </p>
                    </div>
                ) : (
                    /* Details Step */
                    <form className="space-y-5 animate-fade-in" onSubmit={handleSubmit}>
                        {/* Role badge */}
                        <div className="flex items-center justify-between">
                            <button
                                type="button"
                                onClick={() => { setStep('role'); }}
                                className="flex items-center gap-1.5 text-[13px] text-apple-gray-300 hover:text-apple-blue transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Change role
                            </button>
                            <span className={`text-[12px] font-semibold px-3 py-1 rounded-full ${selectedRole === 'ADMIN'
                                ? 'bg-apple-purple/10 text-apple-purple'
                                : 'bg-apple-blue/8 text-apple-blue'
                                }`}>
                                {selectedRole === 'ADMIN' ? 'Organizer' : 'Participant'}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label htmlFor="first-name" className="apple-label">
                                    First Name
                                </label>
                                <input
                                    id="first-name"
                                    name="firstName"
                                    type="text"
                                    required
                                    className="apple-input"
                                    placeholder="John"
                                    value={form.firstName}
                                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                                />
                            </div>
                            <div>
                                <label htmlFor="last-name" className="apple-label">
                                    Last Name
                                </label>
                                <input
                                    id="last-name"
                                    name="lastName"
                                    type="text"
                                    required
                                    className="apple-input"
                                    placeholder="Doe"
                                    value={form.lastName}
                                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                                />
                            </div>
                        </div>

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
                                className="apple-input"
                                placeholder="name@example.com"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
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
                                autoComplete="new-password"
                                required
                                className="apple-input"
                                placeholder="Create a strong password"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                            />
                        </div>

                        <div className="pt-2 space-y-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`btn-primary w-full justify-center text-[16px] py-3.5 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Creating account...
                                    </span>
                                ) : 'Create Account'}
                            </button>

                            <p className="text-center text-[13px] text-apple-gray-300">
                                Already have an account?{' '}
                                <Link href="/login" className="text-apple-blue hover:underline font-medium">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
