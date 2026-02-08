'use client';

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

interface ParticipantReservationActionProps {
  id: string; 
  onUpdate: () => void;
}

export default function ParticipantReservationAction({ id, onUpdate }: ParticipantReservationActionProps) {
    const { token } = useAuth();
    const [loading, setLoading] = useState(false);

    const cancelReservation = async () => {
        if (!confirm('Are you sure you want to cancel this reservation?')) return;
        
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:3000/reservations/${id}/cancel`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!res.ok) throw new Error('Failed');
            onUpdate();
        } catch (e) {
            console.error(e);
            alert('Failed to cancel reservation');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button 
            onClick={cancelReservation}
            disabled={loading}
            className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
        >
            {loading ? 'Canceling...' : 'Cancel'}
        </button>
    );
}
