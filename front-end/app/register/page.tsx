'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usersService } from '@/services/users.service';
import { useToast } from '@/context/ToastContext';

export default function RegisterPage() {
  const router = useRouter();
  const toast = useToast();
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
        role: 'PARTICIPANT',
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
            Join FlowAgora
          </h1>
          <p className="text-[17px] text-apple-gray-300 leading-relaxed">
            Create your account to start discovering and reserving spots at events.
          </p>
        </div>

        {/* Registration Form */}
        <form className="space-y-5 animate-fade-in" onSubmit={handleSubmit}>

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
      </div>
    </div>
  );
}
