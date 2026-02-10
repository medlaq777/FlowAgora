'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { eventsService, Event } from '@/services/events.service';
import { format, isFuture } from 'date-fns';
import { useToast } from '@/context/ToastContext';

export default function AdminDashboardPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data = await eventsService.findAllAdmin();
                setEvents(data);
            } catch (error) {
                console.error('Failed to fetch admin events', error);
                toast.error('Failed to load events');
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, [toast]);

    if (loading) return (
        <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-apple-gray-200 border-t-apple-blue rounded-full animate-spin" />
        </div>
    );

    const publishedCount = events.filter(e => e.status === 'PUBLISHED').length;
    const draftCount = events.filter(e => e.status === 'DRAFT').length;

    return (
        <div className="max-w-7xl mx-auto px-6 py-10 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <div>
                    <h1 className="text-[32px] font-bold text-apple-black tracking-[-0.03em]">Admin Dashboard</h1>
                    <p className="text-apple-gray-400">Manage your events and track performance.</p>
                </div>
                <Link href="/admin/users" className="btn-secondary py-2.5 px-5">
                    Manage Users
                </Link>
                <Link href="/admin/events/create" className="btn-primary py-2.5 px-5 shadow-lg shadow-apple-blue/20">
                    + Create Event
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                <div className="apple-card p-6">
                    <p className="text-[13px] font-medium text-apple-gray-400 uppercase tracking-wide">Total Events</p>
                    <p className="text-[36px] font-bold text-apple-black mt-1 leading-none">{events.length}</p>
                </div>
                <div className="apple-card p-6">
                    <p className="text-[13px] font-medium text-apple-gray-400 uppercase tracking-wide">Published</p>
                    <p className="text-[36px] font-bold text-emerald-600 mt-1 leading-none">{publishedCount}</p>
                </div>
                <div className="apple-card p-6">
                    <p className="text-[13px] font-medium text-apple-gray-400 uppercase tracking-wide">Drafts</p>
                    <p className="text-[36px] font-bold text-amber-500 mt-1 leading-none">{draftCount}</p>
                </div>
            </div>

            {/* Events Table */}
            <div className="bg-white rounded-3xl border border-apple-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
                <div className="px-6 py-5 border-b border-apple-gray-50 flex items-center justify-between">
                    <h2 className="text-[17px] font-semibold text-apple-black">Recent Events</h2>
                </div>

                {events.length === 0 ? (
                    <div className="p-10 text-center text-apple-gray-300">
                        No events found. Start by creating one.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-apple-gray-50/50 text-[12px] uppercase tracking-wider text-apple-gray-400 border-b border-apple-gray-100">
                                    <th className="px-6 py-4 font-medium">Event Name</th>
                                    <th className="px-6 py-4 font-medium">Date</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium text-right">Occupancy</th>
                                    <th className="px-6 py-4 font-medium"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-apple-gray-50">
                                {events.map((event) => {
                                    const occupancy = Math.round(((event.reservedCount || 0) / event.capacity) * 100);
                                    const isUpcoming = isFuture(new Date(event.date));

                                    return (
                                        <tr key={event._id} className="hover:bg-apple-gray-50/40 transition-colors group">
                                            <td className="px-6 py-4">
                                                <Link href={`/admin/events/${event._id}`} className="block">
                                                    <span className="text-[15px] font-semibold text-apple-black group-hover:text-apple-blue transition-colors block">
                                                        {event.title}
                                                    </span>
                                                    <span className="text-[13px] text-apple-gray-300 truncate max-w-50 block">
                                                        {event.location}
                                                    </span>
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className={`text-[14px] font-medium ${isUpcoming ? 'text-apple-black' : 'text-apple-gray-300'}`}>
                                                        {format(new Date(event.date), 'MMM dd, yyyy')}
                                                    </span>
                                                    <span className="text-[12px] text-apple-gray-300">
                                                        {format(new Date(event.date), 'h:mm a')}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1.5
                            ${event.status === 'PUBLISHED' ? 'bg-emerald-50 text-emerald-600' :
                                                        event.status === 'DRAFT' ? 'bg-amber-50 text-amber-600' :
                                                            event.status === 'CANCELLED' ? 'bg-red-50 text-red-500' :
                                                                'bg-apple-gray-100 text-apple-gray-400'}
                        `}>
                                                    {event.status === 'PUBLISHED' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                                                    {event.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex flex-col items-end gap-1">
                                                    <span className="text-[14px] font-medium text-apple-black">
                                                        {event.reservedCount || 0} <span className="text-apple-gray-300 text-[12px]">/ {event.capacity}</span>
                                                    </span>
                                                    <div className="w-24 h-1 bg-apple-gray-100 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full ${occupancy >= 100 ? 'bg-apple-red' : 'bg-apple-blue'}`}
                                                            style={{ width: `${Math.min(occupancy, 100)}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link href={`/admin/events/${event._id}`} className="text-[13px] font-medium text-apple-blue hover:underline">
                                                    Manage
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
