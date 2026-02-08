import Image from "next/image";
import Link from 'next/link';
import { format } from 'date-fns';

interface Event {
  _id: string;
  title: string;
  date: string;
  location: string;
}

async function getUpcomingEvents(): Promise<Event[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/upcoming`, { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}

export default async function Home() {
  const upcomingEvents = await getUpcomingEvents();

  return (
    <div className="min-h-screen p-8 pb-20 font-[--font-geist-sans]">
      <main className="max-w-4xl mx-auto flex flex-col gap-8">
        <div className="flex flex-col items-center sm:items-start gap-4">
          <h1 className="text-4xl font-bold">Welcome to FlowAgora</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">Discover and book amazing events.</p>
          <div className="flex gap-4">
             <Link href="/events" className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition">
                Browse All Events
             </Link>
             {!upcomingEvents.length && (
                <Link href="/login" className="border border-gray-300 px-6 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                  Sign In
                </Link>
             )}
          </div>
        </div>

        <section>
          <h2 className="text-2xl font-semibold mb-6">Upcoming Events</h2>
          {upcomingEvents.length === 0 ? (
            <p className="text-gray-500">No upcoming events found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingEvents.map(event => (
                <Link key={event._id} href={`/events/${event._id}`} className="block group">
                  <div className="border rounded-lg p-6 hover:shadow-lg transition bg-white dark:bg-gray-800 dark:border-gray-700">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition">{event.title}</h3>
                    <p className="text-gray-500 text-sm mb-1">{format(new Date(event.date), 'PPP p')}</p>
                    <p className="text-gray-500 text-sm">{event.location}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
