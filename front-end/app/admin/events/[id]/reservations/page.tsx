'use client';

import { useEffect, useState, use } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import ReservationAction from '@/components/ReservationAction';
import { format } from 'date-fns';

interface Reservation {
    _id: string;
    userId: string; 
    eventId: string;
    status: string;
    createdAt: string;
}

export default function EventReservationsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { token } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReservations = () => {
      fetch(`http://localhost:3000/reservations/by-event/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        setReservations(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (token && id) {
        fetchReservations();
    }
  }, [token, id]);

  if (loading) return <div>Loading reservations...</div>;

  return (
    <div>
        <div className="mb-6 flex items-center gap-4">
            <Link href="/admin/events" className="text-blue-600 hover:underline">&larr; Back to Events</Link>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Reservations for Event</h1>
        </div>

        {reservations.length === 0 ? (
            <p className="text-gray-500">No reservations found.</p>
        ) : (
             <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {reservations.map((res) => (
                            <tr key={res._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 font-mono">{res._id.slice(-6)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{res.userId}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{format(new Date(res.createdAt), 'PP p')}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                        ${res.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' : 
                                          res.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}
                                    `}>
                                        {res.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    <ReservationAction id={res._id} status={res.status} onUpdate={fetchReservations} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             </div>
        )}
    </div>
  );
}
