'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usersService, User } from '@/services/users.service';
import { format } from 'date-fns';
import { useToast } from '@/context/ToastContext';

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await usersService.findAll();
                setUsers(data);
            } catch (error) {
                console.error('Failed to fetch users', error);
                toast.error('Failed to load users');
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, [toast]);

    if (loading) return (
        <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-apple-gray-200 border-t-apple-blue rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-6 py-10 animate-fade-in">
            <Link href="/admin" className="text-[13px] font-medium text-apple-gray-400 hover:text-apple-black mb-6 inline-flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Dashboard
            </Link>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <div>
                    <h1 className="text-[32px] font-bold text-apple-black tracking-[-0.03em]">User Management</h1>
                    <p className="text-apple-gray-400">View and manage registered users.</p>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-apple-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-apple-gray-50/50 text-[12px] uppercase tracking-wider text-apple-gray-400 border-b border-apple-gray-100">
                                <th className="px-6 py-4 font-medium">Name</th>
                                <th className="px-6 py-4 font-medium">Email</th>
                                <th className="px-6 py-4 font-medium">Role</th>
                                <th className="px-6 py-4 font-medium">Joined Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-apple-gray-50">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-apple-gray-50/40 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-apple-gray-100 flex items-center justify-center text-[12px] font-bold text-apple-gray-500">
                                                {(user.firstName[0] || '') + (user.lastName[0] || '')}
                                            </div>
                                            <span className="text-[14px] font-semibold text-apple-black">
                                                {user.firstName} {user.lastName}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-[14px] text-apple-gray-500">
                                        {user.email}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1.5
                                            ${user.role === 'ADMIN' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}
                                        `}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-[14px] text-apple-gray-500">
                                        {user.createdAt ? format(new Date(user.createdAt), 'MMM dd, yyyy') : 'N/A'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
