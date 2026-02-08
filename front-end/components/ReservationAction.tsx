'use client';

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

interface ReservationActionProps {
  id: string; // Reservation ID
  status: string;
  onUpdate: () => void;
}

export default function ReservationAction({ id, status, onUpdate }: ReservationActionProps) {
    const { token } = useAuth();
    const [loading, setLoading] = useState(false);

    const updateStatus = async (newStatus: string) => {
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:3000/reservations/${id}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });
            if (!res.ok) throw new Error('Failed');
            onUpdate();
        } catch (e) {
            console.error(e);
            alert('Failed to update status');
        } finally {
            setLoading(false);
        }
    };

    if (status === 'CONFIRMED') {
        return <span className="text-green-600 font-medium">Confirmed</span>;
    }
    
    if (status === 'CANCELED') {
        return <span className="text-red-600 font-medium">Canceled</span>;
    }

     if (status === 'REFUSED') {
        return <span className="text-red-600 font-medium">Refused</span>;
    }

    return (
        <div className="space-x-2">
            <button 
                onClick={() => updateStatus('CONFIRMED')}
                disabled={loading}
                className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200"
            >
                Confirm
            </button>
            <button 
                onClick={() => updateStatus('REFUSED')}
                disabled={loading}
                className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
            >
                Refuse
            </button>
        </div>
    );
}
