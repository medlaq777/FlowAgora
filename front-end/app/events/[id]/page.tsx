import Link from "next/link";
import { format } from 'date-fns';
import { eventsService } from '@/services/events.service';
import ReserveButton from "@/components/ReserveButton";
import { notFound } from "next/navigation";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    let event = null;

    try {
        event = await eventsService.findOne(id);
    } catch {
        // If error (e.g. 404), trigger notFound
        notFound();
    }

    if (!event) {
        notFound();
    }

    const reservedCount = event.reservedCount || 0;
    const remainingSpots = event.capacity - reservedCount;
    const isFull = remainingSpots <= 0;
    const isPublished = event.status === 'PUBLISHED';
    const canReserve = isPublished && !isFull;
    const occupancy = Math.round((reservedCount / event.capacity) * 100);

    return (
        <div>
            <div className="max-w-170 mx-auto px-6 py-12">
                {/* Breadcrumb */}
                <Link href="/events" className="inline-flex items-center gap-1.5 text-sm text-apple-blue hover:underline mb-8 group">
                    <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Events
                </Link>

                <article className="animate-fade-in-up">
                    {/* Status */}
                    <div className="flex items-center gap-3 mb-5">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full
              ${event.status === 'PUBLISHED' ? 'bg-emerald-50 text-emerald-600' : 'bg-apple-gray-50 text-apple-gray-400'}
            `}>
                            {event.status === 'PUBLISHED' ? 'Open for Registration' : event.status}
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-[32px] md:text-[40px] font-semibold text-apple-black tracking-[-0.03em] leading-[1.1] mb-6">
                        {event.title}
                    </h1>

                    {/* Meta cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-10">
                        <div className="apple-card p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-apple-gray-50 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-apple-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-[13px] text-apple-gray-300">Date</p>
                                    <p className="text-[15px] font-medium text-apple-black">{format(new Date(event.date), 'MMM dd, yyyy')}</p>
                                    <p className="text-[13px] text-apple-gray-300">{format(new Date(event.date), 'h:mm a')}</p>
                                </div>
                            </div>
                        </div>

                        <div className="apple-card p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-apple-gray-50 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-apple-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-[13px] text-apple-gray-300">Location</p>
                                    <p className="text-[15px] font-medium text-apple-black">{event.location}</p>
                                </div>
                            </div>
                        </div>

                        <div className="apple-card p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-apple-gray-50 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-apple-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-[13px] text-apple-gray-300">Availability</p>
                                    <p className="text-[15px] font-medium text-apple-black">
                                        {remainingSpots} <span className="text-apple-gray-300 font-normal">/ {event.capacity}</span>
                                    </p>
                                    {/* Progress bar */}
                                    <div className="w-full bg-apple-gray-100 h-1 rounded-full mt-1.5">
                                        <div
                                            className={`h-full rounded-full transition-all duration-500 ${isFull ? 'bg-apple-red' : occupancy > 80 ? 'bg-apple-orange' : 'bg-apple-green'}`}
                                            style={{ width: `${occupancy}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <section className="mb-10">
                        <h2 className="text-[13px] font-semibold text-apple-gray-300 uppercase tracking-wider mb-3">About this event</h2>
                        <div className="text-[17px] text-apple-gray-500 leading-[1.65]">
                            <p className="whitespace-pre-wrap">{event.description}</p>
                        </div>
                    </section>

                    {/* Action bar */}
                    <div className="apple-card p-5 flex items-center justify-between">
                        <div>
                            {isFull ? (
                                <span className="text-apple-red text-sm font-medium">This event is fully booked</span>
                            ) : (
                                <span className="text-[15px] text-apple-gray-400">
                                    {remainingSpots} spot{remainingSpots !== 1 ? 's' : ''} remaining
                                </span>
                            )}
                        </div>

                        <ReserveButton
                            eventId={event._id}
                            isFull={isFull}
                            canReserve={canReserve}
                        />
                    </div>
                </article>
            </div>
        </div>
    );
}
