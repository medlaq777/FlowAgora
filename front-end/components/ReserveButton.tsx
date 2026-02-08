'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/services/api';

interface ReserveButtonProps {
  eventId: string;
  isFull: boolean;
  canReserve: boolean;
}

export default function ReserveButton({ eventId, isFull, canReserve }: ReserveButtonProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleReserve = async () => {
    if (!user) {
      router.push(`/login?redirect=/events/${eventId}`);
      return;
    }

    if (!confirm('Are you sure you want to reserve a spot?')) return;

    setLoading(true);
    try {
      await api.post('/reservations', { eventId });
      alert('Reservation successful!');
      router.push('/dashboard');
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert('Failed to reserve');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleReserve}
      disabled={!canReserve || loading}
      className={`py-3 px-8 rounded-md font-medium text-white transition-colors
        ${canReserve && !loading
          ? 'bg-blue-600 hover:bg-blue-700 shadow-md transform hover:-translate-y-0.5' 
          : 'bg-gray-400 cursor-not-allowed'}
      `}
    >
      {loading ? 'Processing...' : isFull ? 'Sold Out' : 'Reserve a Spot'}
    </button>
  );
}
