'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useToast } from '@/context/ToastContext';
import { reservationsService, Reservation } from '@/services/reservations.service';
import Link from 'next/link';
import { format, isFuture, isPast } from 'date-fns';
import ParticipantReservationAction from '@/components/ParticipantReservationAction';

type TabKey = 'all' | 'upcoming' | 'confirmed' | 'pending' | 'past';

export default function DashboardPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const toast = useToast();
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loadingData, setLoadingData] = useState(true);
    const [activeTab, setActiveTab] = useState<TabKey>('all');

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [loading, user, router]);

    const fetchData = async () => {
        try {
            const resData = await reservationsService.findAllMine();
            setReservations(resData);
        } catch (err) {
            console.error("Failed to fetch dashboard data", err);
            toast.error("Failed to load your reservations");
        } finally {
            setLoadingData(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    if (loading || loadingData) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                        <div className="w-12 h-12 border-[3px] border-apple-gray-100 rounded-full" />
                        <div className="absolute inset-0 w-12 h-12 border-[3px] border-transparent border-t-apple-blue rounded-full animate-spin" />
                    </div>
                </div>
            </div>
        );
    }

    const username = user?.firstName || 'User';
    const initials = (user?.firstName?.[0] || 'U') + (user?.lastName?.[0] || '');

    const confirmedCount = reservations.filter(r => r.status === 'CONFIRMED').length;
    const pendingCount = reservations.filter(r => r.status === 'PENDING').length;

    // Helper to safely check dates
    const safeDate = (dateStr: string) => new Date(dateStr);

    const upcomingReservations = reservations.filter(r =>
        r.eventId?.date && isFuture(safeDate(r.eventId.date)) && r.status !== 'CANCELED' && r.status !== 'REFUSED'
    );
    const pastReservations = reservations.filter(r =>
        r.eventId?.date && isPast(safeDate(r.eventId.date))
    );

    const tabs: { key: TabKey; label: string; count: number }[] = [
        { key: 'all', label: 'All', count: reservations.length },
        { key: 'upcoming', label: 'Upcoming', count: upcomingReservations.length },
        { key: 'confirmed', label: 'Confirmed', count: confirmedCount },
        { key: 'pending', label: 'Pending', count: pendingCount },
        { key: 'past', label: 'Past', count: pastReservations.length },
    ];

    const filteredReservations = (() => {
        switch (activeTab) {
            case 'upcoming': return upcomingReservations;
            case 'confirmed': return reservations.filter(r => r.status === 'CONFIRMED');
            case 'pending': return reservations.filter(r => r.status === 'PENDING');
            case 'past': return pastReservations;
            default: return reservations;
        }
    })();

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    return (
        <div className="animate-fade-in">
            <div className="max-w-245 mx-auto px-6 py-10">
                {/* Welcome Header */}
                <header className="mb-10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-[20px] bg-linear-to-br from-apple-blue to-apple-purple flex items-center justify-center text-white font-bold text-[20px] shadow-[0_8px_24px_rgba(0,113,227,0.25)]">
                                {initials}
                            </div>
                            <div>
                                <p className="text-[14px] text-apple-gray-300 mb-0.5">{getGreeting()}</p>
                                <h1 className="text-[34px] font-bold text-apple-black tracking-[-0.03em] leading-tight">{username}</h1>
                                <Link href="/dashboard/profile" className="text-[13px] font-medium text-apple-blue hover:underline">
                                    View Profile
                                </Link>
                            </div>
                        </div>
                        <Link href="/events" className="btn-primary text-[14px] py-2.5 px-6 hidden sm:inline-flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            Explore Events
                        </Link>
                    </div>
                </header>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-apple-blue to-apple-dark-blue p-6 text-white shadow-[0_8px_30px_rgba(0,113,227,0.18)]">
                        <div className="relative z-10">
                            <p className="text-[32px] font-bold leading-none mb-0.5">{reservations.length}</p>
                            <p className="text-[12px] text-white/60 font-medium">Total Bookings</p>
                        </div>
                    </div>
                </div>

                {/* Reservations List */}
                <div className="rounded-3xl bg-white border border-apple-gray-100 overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                    <div className="border-b border-apple-gray-100/60 p-4 overflow-x-auto">
                        <div className="flex gap-2">
                            {tabs.map(tab => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`text-[13px] font-medium px-4 py-2 rounded-full transition-all whitespace-nowrap ${activeTab === tab.key
                                        ? 'bg-apple-black text-white'
                                        : 'bg-apple-gray-50 text-apple-gray-500 hover:bg-apple-gray-100'
                                        }`}
                                >
                                    {tab.label} ({tab.count})
                                </button>
                            ))}
                        </div>
                    </div>

                    {filteredReservations.length === 0 ? (
                        <div className="text-center py-20 px-6">
                            <p className="text-[14px] text-apple-gray-300 mb-6">No reservations found.</p>
                            <Link href="/events" className="btn-primary inline-flex items-center gap-2 text-[14px] py-2.5 px-6">
                                Browse Events
                            </Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-apple-gray-50">
                            {filteredReservations.map(res => {
                                const eventDate = res.eventId?.date ? new Date(res.eventId.date) : null;
                                const isUpcoming = eventDate && isFuture(eventDate);

                                return (
                                    <div key={res._id} className="px-7 py-5 hover:bg-apple-gray-50/40 transition-colors group">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                                            <div className="flex items-start gap-5 flex-1 min-w-0">
                                                {eventDate && (
                                                    <div className={`hidden sm:flex flex-col items-center justify-center w-14 h-16 rounded-2xl shrink-0 ${isUpcoming ? 'bg-apple-blue/6' : 'bg-apple-gray-50'
                                                        }`}>
                                                        <span className={`text-[20px] font-bold leading-none ${isUpcoming ? 'text-apple-blue' : 'text-apple-gray-300'
                                                            }`}>
                                                            {format(eventDate, 'dd')}
                                                        </span>
                                                        <span className={`text-[11px] font-semibold uppercase mt-0.5 ${isUpcoming ? 'text-apple-blue/60' : 'text-apple-gray-300'
                                                            }`}>
                                                            {format(eventDate, 'MMM')}
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <Link href={`/events/${res.eventId?._id}`} className="text-[15px] font-semibold text-apple-black mb-1 group-hover:text-apple-blue transition-colors truncate block">
                                                        {res.eventId?.title || 'Unknown Event'}
                                                    </Link>
                                                    <div className="flex flex-wrap items-center gap-3 text-[12px] text-apple-gray-300">
                                                        {eventDate && (
                                                            <span>{format(eventDate, 'h:mm a')}</span>
                                                        )}
                                                        {res.eventId?.location && (
                                                            <span>{res.eventId.location}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 ml-19 sm:ml-0">
                                                <span className={`text-[11px] font-bold px-3 py-1 rounded-full
                                                    ${res.status === 'CONFIRMED' ? 'bg-emerald-50 text-emerald-600' :
                                                        res.status === 'PENDING' ? 'bg-amber-50 text-amber-600' :
                                                            res.status === 'REFUSED' || res.status === 'CANCELED' ? 'bg-red-50 text-red-500' :
                                                                'bg-apple-gray-50 text-apple-gray-400'}
                                                `}>
                                                    {res.status}
                                                </span>
                                                {(res.status === 'PENDING' || res.status === 'CONFIRMED') && (
                                                    <ParticipantReservationAction id={res._id} status={res.status} onUpdate={fetchData} />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
