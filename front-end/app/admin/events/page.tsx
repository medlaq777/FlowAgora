'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Event, EventStatus } from '@/types/event';
import { format } from 'date-fns';

export default function AdminEventsPage() {
  const { token } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetch('http://localhost:3000/events/admin', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        setEvents(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch events', err);
        setLoading(false);
      });
    }
  }, [token]);

  if (loading) return <div>Loading events...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Manage Events</h1>
        <Link 
          href="/admin/events/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          Create New Event
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {events.map((event) => (
            <li key={event._id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-blue-600 truncate">{event.title}</p>
                  <div className="ml-2 shrink-0 flex">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${event.status === EventStatus.PUBLISHED ? 'bg-green-100 text-green-800' : 
                        event.status === EventStatus.DRAFT ? 'bg-gray-100 text-gray-800' : 'bg-red-100 text-red-800'}
                    `}>
                      {event.status}
                    </span>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      {format(new Date(event.date), 'PPP p')}
                    </p>
                    <p className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 sm:mt-0 sm:ml-6">
                      {event.location}
                    </p>
                  </div>
                   <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <Link href={`/admin/events/${event._id}/edit`} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</Link>
                      <Link href={`/admin/events/${event._id}/reservations`} className="text-blue-600 hover:text-blue-900">Reservations</Link>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
