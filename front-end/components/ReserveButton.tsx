'use client';

import { useState } from 'react';
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

    const handleReserve = async () => {
        if (!isAuthenticated) {
            router.push(`/login?redirect=/events/${eventId}`);
            return;
        }

        setLoading(true);
        try {
            await reservationsService.create({ eventId });
            toast.success('Reservation requested! Check your dashboard.');
            router.push('/dashboard');
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Failed to reserve spot';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

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
