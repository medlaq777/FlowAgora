'use client';

import { useState } from 'react';
import { reservationsService } from '@/services/reservations.service';
import { useToast } from '@/context/ToastContext';

interface Props {
    id: string;
    onUpdate: () => void;
    status?: 'PENDING' | 'CONFIRMED' | 'CANCELED' | 'REFUSED';
    eventTitle?: string;
}

export default function ParticipantReservationAction({ id, onUpdate, status, eventTitle }: Props) {
    const [loading, setLoading] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const toast = useToast();

    const handleCancel = async () => {
        if (!confirm('Are you sure you want to cancel this reservation?')) return;

        setLoading(true);
        try {
            await reservationsService.cancel(id);
            toast.success('Reservation cancelled successfully');
            onUpdate();
        } catch {
            toast.error('Failed to cancel reservation. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async () => {
        setDownloading(true);
        try {
            const blob = await reservationsService.generateTicket(id);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `ticket-${eventTitle?.replace(/\s+/g, '-').toLowerCase() || id}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            toast.success('Ticket downloaded successfully!');
        } catch (error) {
            console.error('Download error:', error);
            toast.error('Failed to download ticket. Please try again or contact support.');
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div className="flex items-center gap-2">
            {status === 'CONFIRMED' && (
                <button
                    onClick={handleDownload}
                    disabled={downloading || loading}
                    className="inline-flex items-center gap-1.5 text-[11px] font-medium text-apple-blue hover:bg-apple-blue/5 px-2.5 py-1.5 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Download ticket as PDF"
                >
                    {downloading ? (
                        <>
                            <svg className="w-3 h-3 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Downloading...
                        </>
                    ) : (
                        <>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Download Ticket
                        </>
                    )}
                </button>
            )}
            {status !== 'CANCELED' && status !== 'REFUSED' && (
                <button
                    onClick={handleCancel}
                    disabled={loading || downloading}
                    className="inline-flex items-center gap-1.5 text-[11px] font-medium text-apple-red hover:bg-apple-red/5 px-2.5 py-1.5 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Cancel reservation"
                >
                    {loading ? (
                        <>
                            <svg className="w-3 h-3 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Canceling...
                        </>
                    ) : (
                        'Cancel'
                    )}
                </button>
            )}
        </div>
    );
}
