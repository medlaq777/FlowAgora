'use client';

import { useState } from 'react';
import { reservationsService } from '@/services/reservations.service';
import { useToast } from '@/context/ToastContext';

interface Props {
    id: string;
    onUpdate: () => void;
    status?: 'PENDING' | 'CONFIRMED' | 'CANCELED' | 'REFUSED';
}

export default function ParticipantReservationAction({ id, onUpdate, status }: Props) {
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const handleCancel = async () => {
        if (!confirm('Are you sure you want to cancel this reservation?')) return;

        setLoading(true);
        try {
            await reservationsService.cancel(id);
            toast.success('Reservation cancelled');
            onUpdate();
        } catch {
            toast.error('Failed to cancel reservation');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async () => {
        setLoading(true);
        try {
            const blob = await reservationsService.generateTicket(id);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `ticket-${id}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch {
            toast.error('Failed to download ticket');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center gap-2">
            {status === 'CONFIRMED' && (
                <button
                    onClick={handleDownload}
                    disabled={loading}
                    className="text-[11px] font-medium text-apple-blue hover:bg-apple-blue/5 px-2 py-1 rounded-md transition-colors disabled:opacity-50"
                >
                    Download Ticket
                </button>
            )}
            <button
                onClick={handleCancel}
                disabled={loading}
                className="text-[11px] font-medium text-apple-red hover:bg-apple-red/5 px-2 py-1 rounded-md transition-colors disabled:opacity-50"
            >
                Cancel
            </button>
        </div>
    );
}
