import Link from 'next/link';
import { format } from 'date-fns';
import { eventsService, Event as EventModel } from '@/services/events.service';

// Ensure fresh data is fetched on every request
export const dynamic = 'force-dynamic';

export default async function EventsPage() {
    let events: EventModel[] = [];
    try {
        events = await eventsService.findAllPublished();
    } catch (error) {
        console.error('Failed to fetch events', error);
    }

    return (
        <div>
            <div className="max-w-245 mx-auto px-6 py-16">
                <div className="text-center mb-14">
                    <h1 className="text-[40px] md:text-[48px] font-semibold text-apple-black tracking-[-0.03em] mb-3">
                        Explore Events
                    </h1>
                    <p className="text-[17px] text-apple-gray-300 max-w-md mx-auto">
                        Discover upcoming experiences crafted just for you.
                    </p>
                </div>

                {events.length === 0 ? (
                    <div className="apple-card p-20 text-center">
                        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-apple-gray-50 flex items-center justify-center">
                            <svg className="w-8 h-8 text-apple-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <p className="text-apple-gray-400 text-lg font-medium">No events found</p>
                        <p className="text-apple-gray-300 text-sm mt-1">Check back later for new experiences.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {events.map((event) => (
                            <Link key={event._id} href={`/events/${event._id}`} className="group">
                                <article className="apple-card h-full flex flex-col overflow-hidden">
                                    <div className="relative h-35 bg-apple-gray-50 flex items-center justify-center">
                                        <div className="text-center">
                                            <p className="text-[40px] font-semibold text-apple-black/80 leading-none">{format(new Date(event.date), 'dd')}</p>
                                            <p className="text-[13px] font-medium text-apple-gray-300 uppercase tracking-wider mt-1">{format(new Date(event.date), 'MMM yyyy')}</p>
                                        </div>
                                    </div>

                                    <div className="p-5 flex-1 flex flex-col">
                                        <h2 className="text-[17px] font-semibold text-apple-black mb-2 leading-snug group-hover:text-apple-blue transition-colors line-clamp-2">
                                            {event.title}
                                        </h2>

                                        <p className="text-[13px] text-apple-gray-300 mb-4 line-clamp-2 leading-relaxed">
                                            {event.description}
                                        </p>

                                        <div className="mt-auto space-y-2">
                                            <div className="flex items-center gap-2 text-[13px] text-apple-gray-400">
                                                <svg className="w-3.5 h-3.5 text-apple-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <span className="truncate">{event.location}</span>
                                            </div>

                                            <div className="flex items-center gap-2 text-[13px] text-apple-gray-400">
                                                <svg className="w-3.5 h-3.5 text-apple-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span>{format(new Date(event.date), 'h:mm a')}</span>
                                            </div>
                                        </div>

                                        <div className="mt-4 pt-3.5 border-t border-apple-gray-100/60">
                                            <span className="text-[13px] font-medium text-apple-blue flex items-center gap-1 group-hover:gap-2 transition-all duration-300">
                                                Reserve a spot
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </span>
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
