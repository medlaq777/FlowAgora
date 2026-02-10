import Link from 'next/link';
import { eventsService, Event } from '@/services/events.service';
import { format } from 'date-fns';

export const dynamic = 'force-dynamic';

const STATS = [
    { value: '500+', label: 'Events Hosted' },
    { value: '10K+', label: 'Happy Attendees' },
    { value: '98%', label: 'Satisfaction' },
];

export default async function Home() {
    let upcomingEvents: Event[] = [];
    try {
        upcomingEvents = await eventsService.findUpcoming();
    } catch (error) {
        console.error('Failed to fetch upcoming events', error);
    }

    return (
        <div>
            <section className="pt-28 pb-20 px-6">
                <div className="max-w-170 mx-auto text-center animate-fade-in-up">
                    <h1 className="text-[44px] md:text-[56px] lg:text-[72px] font-semibold text-apple-black tracking-[-0.04em] leading-[1.05] mb-5">
                        Experience events<br />
                        <span className="text-apple-gray-300">
                            like never before.
                        </span>
                    </h1>
                    <p className="text-[19px] md:text-[21px] text-apple-gray-300 max-w-120 mx-auto leading-normal mb-10">
                        Discover, reserve, and attend exclusive events.
                        Seamlessly designed for the moments that matter.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Link href="/events" className="btn-primary text-[15px] px-7 py-3">
                            Browse Events
                        </Link>
                        <Link href="/register" className="btn-secondary text-[15px] px-7 py-3">
                            Create Account
                        </Link>
                    </div>
                </div>
            </section>

            <section className="border-y border-black/4">
                <div className="max-w-245 mx-auto px-6 py-5">
                    <div className="grid grid-cols-3 divide-x divide-apple-gray-100">
                        {STATS.map((stat) => (
                            <div key={stat.label} className="text-center px-4">
                                <p className="text-[28px] md:text-[32px] font-semibold text-apple-black tracking-[-0.02em]">
                                    {stat.value}
                                </p>
                                <p className="text-[12px] text-apple-gray-300 mt-0.5">
                                    {stat.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="max-w-245 mx-auto px-6 py-24">
                <div className="text-center mb-16">
                    <h2 className="text-[32px] md:text-[40px] font-semibold text-apple-black tracking-[-0.03em] mb-3">
                        Upcoming Events
                    </h2>
                    <p className="text-[17px] text-apple-gray-300">
                        Curated experiences waiting for you.
                    </p>
                </div>

                {upcomingEvents.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-apple-gray-50 flex items-center justify-center">
                            <svg className="w-6 h-6 text-apple-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <p className="text-[17px] font-medium text-apple-gray-400">No upcoming events</p>
                        <p className="text-[15px] text-apple-gray-300 mt-1">Check back soon for new experiences.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {upcomingEvents.map((event, i) => (
                            <Link
                                key={event._id}
                                href={`/events/${event._id}`}
                                className="group animate-fade-in-up"
                                style={{ animationDelay: `${i * 80}ms` }}
                            >
                                <div className="apple-card h-full flex flex-col overflow-hidden">
                                    <div className="h-45 relative overflow-hidden rounded-t-2xl bg-apple-gray-50">
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="text-center">
                                                <p className="text-[40px] font-semibold text-apple-black/80 leading-none">
                                                    {format(new Date(event.date), 'dd')}
                                                </p>
                                                <p className="text-[13px] font-medium text-apple-gray-300 uppercase tracking-wider mt-1">
                                                    {format(new Date(event.date), 'MMM')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-5 flex-1 flex flex-col">
                                        <h3 className="text-[17px] font-semibold text-apple-black mb-1.5 leading-snug group-hover:text-apple-blue transition-colors duration-300 line-clamp-2">
                                            {event.title}
                                        </h3>
                                        <p className="text-[13px] text-apple-gray-300 flex items-center gap-1.5 mt-auto pt-3">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <span className="truncate">{event.location}</span>
                                        </p>
                                        <div className="mt-4 pt-3.5 border-t border-apple-gray-100/60">
                                            <span className="text-[13px] font-medium text-apple-blue flex items-center gap-1 group-hover:gap-2 transition-all duration-300">
                                                Learn more
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                <div className="text-center mt-12">
                    <Link href="/events" className="text-apple-blue text-[15px] font-medium hover:underline">
                        View all events →
                    </Link>
                </div>
            </section>
        </div>
    );
}
