'use client';

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export default function TicketDownload({ id }: { id: string }) {
    const { token } = useAuth();
    const [downloading, setDownloading] = useState(false);

    const downloadTicket = async () => {
        setDownloading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reservations/${id}/ticket`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!res.ok) throw new Error('Failed to download ticket');

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `ticket-${id}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (e) {
            console.error(e);
            alert('Error downloading ticket');
        } finally {
            setDownloading(false);
        }
    };

    return (
        <button 
            onClick={downloadTicket}
            disabled={downloading}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium disabled:opacity-50"
        >
            {downloading ? 'Downloading...' : 'Download Ticket'}
        </button>
    );
}
