'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import TicketDownload from '@/components/TicketDownload';
import ParticipantReservationAction from '@/components/ParticipantReservationAction';
import { api } from '@/services/api';

interface Reservation {
    _id: string;
    eventId: {
        _id: string;
        title: string;
        date: string;
        location: string;
    };
    status: string;
    createdAt: string;
}

export default function DashboardPage() {
  const { user, token, isLoading } = useAuth();
  const router = useRouter();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loadingConfig, setLoadingConfig] = useState(true);

  const fetchReservations = async () => {
    try {
      const data = await api.get<Reservation[]>('/reservations/my-reservations');
      setReservations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingConfig(false);
    }
  };

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/login');
      } else {
        fetchReservations();
      }
    }
  }, [user, isLoading, token, router]);

  if (isLoading || loadingConfig) {
      return (
        <div className="flex min-h-screen items-center justify-center">
             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Dashboard</h1>
            <Link href="/" className="text-blue-600 hover:underline">Go to Events</Link>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">My Reservations</h2>
            </div>
            
            {reservations.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                    You have no reservations yet. <Link href="/" className="text-blue-600 hover:underline">Browse events</Link>
                </div>
            ) : (
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {reservations.map((res) => (
                        <li key={res._id} className="p-6">
                            <div className="flex items-center justify-between flex-wrap gap-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {/* Handle populated event or fallback */}
                                        {res.eventId?.title || 'Unknown Event'}
                                    </h3>
                                     <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        <p>{res.eventId?.date ? format(new Date(res.eventId.date), 'PPP p') : 'Date N/A'}</p>
                                        <p>{res.eventId?.location || 'Location N/A'}</p>
                                    </div>
                                    <div className="mt-2">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full 
                                            ${res.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' : 
                                              res.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}
                                        `}>
                                            {res.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    {res.status === 'CONFIRMED' && (
                                        <TicketDownload id={res._id} />
                                    )}
                                    {(res.status === 'CONFIRMED' || res.status === 'PENDING') && (
                                        <ParticipantReservationAction id={res._id} onUpdate={fetchReservations} />
                                    )}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
      </div>
    </div>
  );
}
