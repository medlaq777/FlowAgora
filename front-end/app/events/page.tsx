import { Event, EventStatus } from "@/types/event";
import Link from "next/link";
import { format } from 'date-fns';

async function getEvents(): Promise<Event[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`, { 
    cache: 'no-store'
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch events');
  }
 
  return res.json();
}

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Available Events</h1>
      
      {events.length === 0 ? (
        <p className="text-gray-500">No events currently available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event._id} className="border rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 bg-white dark:bg-gray-800 dark:border-gray-700 flex flex-col h-full">
              <div className="mb-4">
                <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full 
                  ${event.status === EventStatus.PUBLISHED ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 'bg-gray-100 text-gray-800'}
                `}>
                  {event.status}
                </span>
              </div>
              
              <h2 className="text-xl font-semibold mb-2 line-clamp-2">{event.title}</h2>
              
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3 grow">
                {event.description}
              </p>
              
              <div className="space-y-2 text-sm text-gray-500 dark:text-gray-300 mt-auto">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <span>{format(new Date(event.date), 'PPP p')}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  <span>{event.location}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  <span>
                    Places: {event.capacity - (event.reservedCount || 0)} / {event.capacity}
                  </span>
                </div>
              </div>
              
              <Link 
                href={`/events/${event._id}`} 
                className="mt-6 block w-full text-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
