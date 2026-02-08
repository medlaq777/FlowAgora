'use client';

import { useEffect, useState, use } from 'react';
import { api } from '@/services/api';

interface EventStats {
  totalReservations: number;
  confirmedReservations: number;
  pendingReservations: number;
  canceledReservations: number;
  occupancyRate: number;
  revenue: number;
}

export default function EventStatsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [stats, setStats] = useState<EventStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
        api.get<EventStats>(`/events/${id}/stats`)
        .then(setStats)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <div>Loading stats...</div>;
  if (!stats) return <div>Stats not available</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Event Statistics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Total Reservations</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.totalReservations}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Occupancy Rate</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{Math.round(stats.occupancyRate * 100)}%</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-medium">Confirmed</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">{stats.confirmedReservations}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-medium">Pending</h3>
            <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.pendingReservations}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-medium">Canceled</h3>
            <p className="text-3xl font-bold text-red-600 mt-2">{stats.canceledReservations}</p>
        </div>
      </div>
    </div>
  );
}
