import { Event, EventStatus } from "@/types/event";
import { format } from 'date-fns';
import Link from "next/link";
import { notFound } from "next/navigation";
import ReserveButton from "@/components/ReserveButton";

async function getEvent(id: string): Promise<Event> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${id}`, { 
    cache: 'no-store' 
  });
  
  if (res.status === 404) {
    return notFound();
  }
  
  if (!res.ok) {
    throw new Error('Failed to fetch event');
  }
 
  return res.json();
}

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await getEvent(id);

  const reservedCount = event.reservedCount || 0;
  const remainingSpots = event.capacity - reservedCount;
  const isFull = remainingSpots <= 0;
  const isPublished = event.status === EventStatus.PUBLISHED;
  const canReserve = isPublished && !isFull;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/events" className="text-blue-600 hover:underline mb-4 inline-block">&larr; Back to Events</Link>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-8">
          <div className="flex justify-between items-start flex-wrap gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">{event.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-gray-500 dark:text-gray-400 text-sm">
                 <span className={`px-2 py-1 rounded-full text-xs font-semibold
                  ${event.status === EventStatus.PUBLISHED ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 'bg-gray-100 text-gray-800'}
                `}>
                  {event.status}
                </span>
                <span>{format(new Date(event.date), 'PPP p')}</span>
                <span>{event.location}</span>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {remainingSpots} <span className="text-sm font-normal text-gray-500">spots left</span>
              </div>
              <div className="text-sm text-gray-500">
                Capacity: {event.capacity}
              </div>
            </div>
          </div>

          <div className="prose dark:prose-invert max-w-none mb-8 text-gray-700 dark:text-gray-300">
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">About this event</h3>
            <p className="whitespace-pre-wrap leading-relaxed">{event.description}</p>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
            <div className="flex justify-end items-center gap-4">
               {isFull && <span className="text-red-500 font-medium">Event is Full</span>}
               


// ... (inside component)

               {isFull && <span className="text-red-500 font-medium">Event is Full</span>}
               
               <ReserveButton 
                 eventId={event._id} 
                 isFull={isFull} 
                 canReserve={canReserve} 
               />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
