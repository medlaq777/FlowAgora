'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { usersService, User } from '@/services/users.service';
import { reservationsService, Reservation } from '@/services/reservations.service';
import { useToast } from '@/context/ToastContext';
import { format } from 'date-fns';

export default function AdminUserDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const toast = useToast();
    const [user, setUser] = useState<User | null>(null);
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [userData, reservationsData] = await Promise.all([
                usersService.findOne(id),
                reservationsService.findByUser(id)
            ]);
            setUser(userData);
            setReservations(reservationsData);
        } catch (error) {
            console.error('Failed to fetch user details', error);
            toast.error('Failed to load user details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, toast]);

    if (loading) return (
        <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-apple-gray-200 border-t-apple-blue rounded-full animate-spin" />
        </div>
    );

    if (!user) return (
        <div className="p-10 text-center">User not found</div>
    );

    return (
        <div className="max-w-7xl mx-auto px-6 py-10 animate-fade-in">
            <Link href="/admin/users" className="text-[13px] font-medium text-apple-gray-400 hover:text-apple-black mb-6 inline-flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Users
            </Link>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <div>
                    <h1 className="text-[32px] font-bold text-apple-black tracking-[-0.03em] mb-1">
                        {user.firstName} {user.lastName}
                    </h1>
                    <div className="flex items-center gap-3 text-[14px] text-apple-gray-500">
                        <span>{user.email}</span>
                        <span className="w-1 h-1 rounded-full bg-apple-gray-300" />
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full
                            ${user.role === 'ADMIN' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}
                        `}>
                            {user.role}
                        </span>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-apple-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
                <div className="px-6 py-5 border-b border-apple-gray-50">
                    <h2 className="text-[17px] font-semibold text-apple-black">Reservation History</h2>
                </div>

                {reservations.length === 0 ? (
                    <div className="p-10 text-center text-apple-gray-300">
                        No reservations found for this user.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-apple-gray-50/50 text-[12px] uppercase tracking-wider text-apple-gray-400 border-b border-apple-gray-100">
                                    <th className="px-6 py-4 font-medium">Event</th>
                                    <th className="px-6 py-4 font-medium">Date</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-apple-gray-50">
                                {reservations.map((res) => (
                                    <tr key={res._id} className="hover:bg-apple-gray-50/40 transition-colors">
                                        <td className="px-6 py-4">
                                            <Link href={`/admin/events/${res.eventId?._id}`} className="text-[15px] font-semibold text-apple-black hover:text-apple-blue transition-colors">
                                                {res.eventId?.title || 'Unknown Event'}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 text-[14px] text-apple-gray-500">
                                            {res.eventId?.date ? format(new Date(res.eventId.date), 'MMM dd, yyyy') : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1.5
                                                ${res.status === 'CONFIRMED' ? 'bg-emerald-50 text-emerald-600' :
                                                    res.status === 'PENDING' ? 'bg-amber-50 text-amber-600' :
                                                        'bg-red-50 text-red-500'}
                                            `}>
                                                {res.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link href={`/admin/events/${res.eventId?._id}`} className="text-[13px] font-medium text-apple-blue hover:underline">
                                                View Event
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
