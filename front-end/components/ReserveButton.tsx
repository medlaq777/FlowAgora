'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { reservationsService } from '@/services/reservations.service';
import { useToast } from '@/context/ToastContext';

interface Props {
    eventId: string;
    isFull: boolean;
    canReserve: boolean;
}

export default function ReserveButton({ eventId, isFull, canReserve }: Props) {
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [hasReserved, setHasReserved] = useState(false);
    const [reservationStatus, setReservationStatus] = useState<string | null>(null);
    const [checkingReservation, setCheckingReservation] = useState(true);

    useEffect(() => {
        const checkReservation = async () => {
            if (!isAuthenticated) {
                setCheckingReservation(false);
                return;
            }

            try {
                const reservations = await reservationsService.findAllMine();
                const existing = reservations.find((r) => {
                    const resEventId = typeof r.eventId === 'string' ? r.eventId : r.eventId._id;
                    return resEventId === eventId;
                });
                if (existing) {
                    setHasReserved(true);
                    setReservationStatus(existing.status);
                }
            } catch (error) {
                console.error('Failed to check reservation', error);
            } finally {
                setCheckingReservation(false);
            }
        };

        checkReservation();
    }, [eventId, isAuthenticated]);

    const handleReserve = async () => {
        if (!isAuthenticated) {
            toast.info('Please sign in to reserve a spot');
            router.push('/login');
            return;
        }

        setLoading(true);
        try {
            await reservationsService.create({ eventId });
            toast.success('Reservation submitted! Check your dashboard for status updates.');
            setHasReserved(true);
            setReservationStatus('PENDING');
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Failed to reserve spot';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    if (checkingReservation) {
        return (
            <button disabled className="btn-primary opacity-50 cursor-not-allowed">
                <svg className="w-4 h-4 animate-spin mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Checking...
            </button>
        );
    }

    if (hasReserved) {
        const statusConfig = {
            PENDING: {
                color: 'bg-amber-50 text-amber-700 border-amber-200',
                icon: (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                ),
                message: 'Your reservation is pending approval',
                description: 'The event organizer will review and confirm your reservation soon.'
            },
            CONFIRMED: {
                color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                icon: (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                ),
                message: 'Your reservation is confirmed!',
                description: 'You can download your ticket from your dashboard.'
            },
            REFUSED: {
                color: 'bg-red-50 text-red-700 border-red-200',
                icon: (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                ),
                message: 'Your reservation was declined',
                description: 'Unfortunately, your reservation was not approved. You can try other events.'
            },
            CANCELED: {
                color: 'bg-gray-50 text-gray-700 border-gray-200',
                icon: (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ),
                message: 'Reservation cancelled',
                description: 'You have cancelled this reservation.'
            }
        };

        const config = statusConfig[reservationStatus as keyof typeof statusConfig] || statusConfig.PENDING;

        return (
            <div className="space-y-3">
                <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border ${config.color}`}>
                    {config.icon}
                    <span className="text-sm font-medium">{config.message}</span>
                </div>
                <p className="text-xs text-apple-gray-400">{config.description}</p>
            </div>
        );
    }

    if (!canReserve) {
        if (isFull) {
            return (
                <button disabled className="btn-primary opacity-50 cursor-not-allowed" aria-label="Event is fully booked">
                    Sold Out
                </button>
            );
        }
        return (
            <button disabled className="btn-primary opacity-50 cursor-not-allowed" aria-label="Event not available for reservation">
                Unavailable
            </button>
        );
    }

    return (
        <button
            onClick={handleReserve}
            disabled={loading}
            className="btn-primary"
            aria-label="Reserve a spot for this event"
        >
            {loading ? (
                <>
                    <svg className="w-4 h-4 animate-spin mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Reserving...
                </>
            ) : (
                'Reserve Your Spot'
            )}
        </button>
    );
}
