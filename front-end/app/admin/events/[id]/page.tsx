'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
// import { useRouter } from 'next/navigation';
import { eventsService, Event } from '@/services/events.service';
import { reservationsService, Reservation } from '@/services/reservations.service';
import { useToast } from '@/context/ToastContext';
import { format } from 'date-fns';

export default function AdminEventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    // const router = useRouter();
    const toast = useToast();
    const [event, setEvent] = useState<Event | null>(null);
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    const fetchData = async () => {
        try {
            const [eventData, reservationsData] = await Promise.all([
                eventsService.findOne(id),
                reservationsService.findByEvent(id)
            ]);
            setEvent(eventData);
            setReservations(reservationsData);
        } catch (error) {
            console.error('Failed to fetch event details', error);
            toast.error('Failed to load event details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, toast]);

    const handleStatusChange = async (newStatus: Event['status']) => {
        if (!confirm(`Are you sure you want to mark this event as ${newStatus}?`)) return;

        setProcessing(true);
        try {
            await eventsService.updateStatus(id, newStatus);
            toast.success(`Event marked as ${newStatus}`);
            fetchData();
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Failed to update status';
            toast.error(message);
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-apple-gray-200 border-t-apple-blue rounded-full animate-spin" />
        </div>
    );

    if (!event) return (
        <div className="p-10 text-center">Event not found</div>
    );

    const totalReservations = reservations.length;
    // const confirmedReservations = reservations.filter(r => r.status === 'CONFIRMED').length;
    // const pendingReservations = reservations.filter(r => r.status === 'PENDING').length;

    return (
        <div className="max-w-7xl mx-auto px-6 py-10 animate-fade-in">
            <Link href="/admin" className="text-[13px] font-medium text-apple-gray-400 hover:text-apple-black mb-6 inline-flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Dashboard
            </Link>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-[32px] font-bold text-apple-black tracking-[-0.03em] leading-tight">
                            {event.title}
                        </h1>
                        <span className={`text-[12px] font-bold px-2.5 py-0.5 rounded-full border ${event.status === 'PUBLISHED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                            event.status === 'DRAFT' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                'bg-apple-gray-50 text-apple-gray-400 border-apple-gray-100'
                            }`}>
                            {event.status}
                        </span>
                    </div>
                    <div className="flex items-center gap-4 text-[14px] text-apple-gray-400">
                        <span className="flex items-center gap-1.5">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {format(new Date(event.date), 'MMMM dd, yyyy')}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {format(new Date(event.date), 'h:mm a')}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {event.location}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {event.status === 'DRAFT' && (
                        <button
                            onClick={() => handleStatusChange('PUBLISHED')}
                            disabled={processing}
                            className="btn-primary"
                        >
                            Publish Event
                        </button>
                    )}
                    {event.status === 'PUBLISHED' && (
                        <button
                            onClick={() => handleStatusChange('DRAFT')}
                            disabled={processing}
                            className="btn-secondary"
                        >
                            Unpublish
                        </button>
                    )}
                    {event.status !== 'CANCELLED' && (
                        <button
                            onClick={() => handleStatusChange('CANCELLED')}
                            disabled={processing}
                            className="px-4 py-2 rounded-full border border-red-200 text-red-600 hover:bg-red-50 text-[14px] font-medium transition-colors"
                        >
                            Cancel Event
                        </button>
                    )}
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Stats & Reservations */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="apple-card p-5 text-center">
                            <p className="text-[12px] font-semibold text-apple-gray-300 uppercase">Capacity</p>
                            <p className="text-[24px] font-bold text-apple-black mt-1">{event.capacity}</p>
                        </div>
                        <div className="apple-card p-5 text-center">
                            <p className="text-[12px] font-semibold text-apple-gray-300 uppercase">Reserved</p>
                            <p className="text-[24px] font-bold text-apple-blue mt-1">{totalReservations}</p>
                        </div>
                        <div className="apple-card p-5 text-center">
                            <p className="text-[12px] font-semibold text-apple-gray-300 uppercase">Remaining</p>
                            <p className="text-[24px] font-bold text-apple-gray-500 mt-1">{event.capacity - totalReservations}</p>
                        </div>
                    </div>

                    {/* Reservations Table */}
                    <div className="apple-card p-6 overflow-hidden">
                        <h2 className="text-[18px] font-semibold text-apple-black mb-5">Reservations</h2>

                        {reservations.length === 0 ? (
                            <p className="text-apple-gray-300 text-center py-8">No reservations yet.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-apple-gray-100 text-[12px] font-medium text-apple-gray-300 uppercase">
                                            <th className="pb-3 pl-2">User ID</th>
                                            <th className="pb-3">Date</th>
                                            <th className="pb-3">Status</th>
                                            <th className="pb-3 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-apple-gray-50">
                                        {reservations.map(res => (
                                            <tr key={res._id} className="text-[14px]">
                                                <td className="py-3 pl-2 font-mono text-apple-gray-500">{res.userId}</td>
                                                <td className="py-3 text-apple-black">{format(new Date(res.createdAt), 'MMM d, h:mm a')}</td>
                                                <td className="py-3">
                                                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full
                                                    ${res.status === 'CONFIRMED' ? 'bg-emerald-50 text-emerald-600' :
                                                            res.status === 'PENDING' ? 'bg-amber-50 text-amber-600' :
                                                                'bg-red-50 text-red-500'}
                                                `}>
                                                        {res.status}
                                                    </span>
                                                </td>
                                                <td className="py-3 text-right">
                                                    {res.status === 'PENDING' && (
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={async () => {
                                                                    if (!confirm('Confirm this reservation?')) return;
                                                                    try {
                                                                        await reservationsService.updateStatus(res._id, 'CONFIRMED');
                                                                        toast.success('Reservation confirmed');
                                                                        fetchData();
                                                                    } catch (error: unknown) {
                                                                        const message = error instanceof Error ? error.message : 'Failed to confirm';
                                                                        toast.error(message);
                                                                    }
                                                                }}
                                                                className="text-[11px] font-medium text-emerald-600 hover:bg-emerald-50 px-2 py-1 rounded-md transition-colors"
                                                            >
                                                                Confirm
                                                            </button>
                                                            <button
                                                                onClick={async () => {
                                                                    if (!confirm('Refuse this reservation?')) return;
                                                                    try {
                                                                        await reservationsService.updateStatus(res._id, 'REFUSED');
                                                                        toast.success('Reservation refused');
                                                                        fetchData();
                                                                    } catch (error: unknown) {
                                                                        const message = error instanceof Error ? error.message : 'Failed to refuse';
                                                                        toast.error(message);
                                                                    }
                                                                }}
                                                                className="text-[11px] font-medium text-red-600 hover:bg-red-50 px-2 py-1 rounded-md transition-colors"
                                                            >
                                                                Refuse
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Metadata / Actions */}
                <div className="space-y-6">
                    <div className="apple-card p-6">
                        <h3 className="text-[15px] font-semibold text-apple-black mb-4">Event Details</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-[12px] font-medium text-apple-gray-300">Description</p>
                                <p className="text-[14px] text-apple-gray-500 mt-1 leading-relaxed">{event.description}</p>
                            </div>
                            <div>
                                <p className="text-[12px] font-medium text-apple-gray-300">Created By</p>
                                <p className="text-[14px] text-apple-gray-500 mt-1 font-mono">{event.creatorId}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
