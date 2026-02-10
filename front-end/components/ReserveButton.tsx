'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
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

    // Check if user already reserved this event
    useEffect(() => {
        const checkReservation = async () => {
            if (isAuthenticated) {
                try {
                    const myReservations = await reservationsService.findAllMine();
                    const found = myReservations.some(r =>
                        (typeof r.eventId === 'string' ? r.eventId : r.eventId._id) === eventId &&
                        r.status !== 'CANCELED' &&
                        r.status !== 'REFUSED'
                    );
                    setHasReserved(found);
                } catch {
                    // Silent fail
                }
            }
        };
        checkReservation();
    }, [isAuthenticated, eventId]);

    const handleReserve = async () => {
        if (!isAuthenticated) {
            router.push(`/login?redirect=/events/${eventId}`);
            return;
        }

        setLoading(true);
        try {
            await reservationsService.create({ eventId });
            toast.success('Reservation requested! Check your dashboard.');
            setHasReserved(true);
            router.push('/dashboard');
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Failed to reserve spot';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    if (hasReserved) {
        return (
            <button disabled className="btn-secondary opacity-50 cursor-not-allowed bg-emerald-50 text-emerald-600 border-emerald-100">
                Reserving / Reserved
            </button>
        );
    }

    if (isFull) {
        return (
            <button disabled className="btn-secondary opacity-50 cursor-not-allowed">
                Sold Out
            </button>
        );
    }

    if (!canReserve) {
        return (
            <button disabled className="btn-secondary opacity-50 cursor-not-allowed">
                Unavailable
            </button>
        );
    }

    return (
        <button
            onClick={handleReserve}
            disabled={loading}
            className={`btn-primary ${loading ? 'opacity-80' : ''}`}
        >
            {loading ? 'Reserving...' : 'Reserve Spot'}
        </button>
    );
}
