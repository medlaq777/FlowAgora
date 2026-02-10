'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usersService, User } from '@/services/users.service';
import { useToast } from '@/context/ToastContext';
import Link from 'next/link';
import Alert from '@/components/ui/Alert';
import { ProfileHeaderSkeleton } from '@/components/ui/LoadingSkeleton';

export default function ProfilePage() {
    const { user: authUser } = useAuth();
    const [profile, setProfile] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await usersService.getProfile();
                setProfile(data);
            } catch (error) {
                console.error('Failed to fetch profile', error);
                toast.error('Failed to load profile');
            } finally {
                setLoading(false);
            }
        };

        if (authUser) {
            fetchProfile();
        }
    }, [authUser, toast]);

    if (loading) return (
        <div className="max-w-3xl mx-auto px-6 py-12">
            <ProfileHeaderSkeleton />
        </div>
    );

    if (!profile) return null;

    const initials = (profile.firstName[0] || '') + (profile.lastName[0] || '');

    return (
        <div className="max-w-3xl mx-auto px-6 py-12 animate-fade-in">
            <Link href="/dashboard" className="text-[13px] font-medium text-apple-gray-400 hover:text-apple-black mb-6 inline-flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Dashboard
            </Link>

            <h1 className="text-[32px] font-bold text-apple-black tracking-[-0.03em] mb-8">My Profile</h1>

            <div className="apple-card p-8">
                <div className="flex items-center gap-6 mb-8">
                    <div className="w-20 h-20 rounded-[24px] bg-linear-to-br from-apple-blue to-apple-purple flex items-center justify-center text-white font-bold text-[28px] shadow-lg shadow-apple-blue/20">
                        {initials}
                    </div>
                    <div>
                        <h2 className="text-[24px] font-bold text-apple-black">{profile.firstName} {profile.lastName}</h2>
                        <span className={`text-[12px] font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 mt-1
                            ${profile.role === 'ADMIN' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}
                        `}>
                            {profile.role}
                        </span>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="text-[13px] font-medium text-apple-gray-400 uppercase tracking-wide block mb-1">Email Address</label>
                        <p className="text-[17px] font-medium text-apple-black border-b border-apple-gray-100 pb-2">{profile.email}</p>
                    </div>
                    <div>
                        <label className="text-[13px] font-medium text-apple-gray-400 uppercase tracking-wide block mb-1">Member Since</label>
                        <p className="text-[17px] font-medium text-apple-black border-b border-apple-gray-100 pb-2">
                            {new Date(profile.createdAt).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>
                    </div>
                    <div>
                        <label className="text-[13px] font-medium text-apple-gray-400 uppercase tracking-wide block mb-1">User ID</label>
                        <p className="text-[14px] font-mono text-apple-gray-500 bg-apple-gray-50 p-2 rounded-lg">{profile.id}</p>
                    </div>
                </div>
            </div>

            {/* Security Section */}
            <div className="apple-card p-8 mt-6">
                <h3 className="text-[18px] font-semibold text-apple-black mb-4">Security</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-apple-gray-100">
                        <div>
                            <p className="text-[15px] font-medium text-apple-black">Password</p>
                            <p className="text-[13px] text-apple-gray-300 mt-0.5">Manage your account password</p>
                        </div>
                        <button className="text-[13px] font-medium text-apple-gray-400 cursor-not-allowed" disabled>
                            Change Password
                        </button>
                    </div>
                    <Alert variant="info" dismissible={false}>
                        Profile editing and password management features are coming soon. Contact support if you need to update your information.
                    </Alert>
                </div>
            </div>
        </div>
    );
}
