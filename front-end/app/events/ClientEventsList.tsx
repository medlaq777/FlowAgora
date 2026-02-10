'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Event as EventModel } from '@/services/events.service';
import EmptyState from '@/components/ui/EmptyState';

interface ClientEventsListProps {
    initialEvents: EventModel[];
}

export default function ClientEventsList({ initialEvents }: ClientEventsListProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'date' | 'title' | 'capacity'>('date');

    // Filter and sort events
    const filteredAndSortedEvents = useMemo(() => {
        let filtered = initialEvents;

        // Apply search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (event) =>
                    event.title.toLowerCase().includes(query) ||
                    event.description.toLowerCase().includes(query) ||
                    event.location.toLowerCase().includes(query)
            );
        }

        // Apply sorting
        const sorted = [...filtered].sort((a, b) => {
            switch (sortBy) {
                case 'date':
                    return new Date(a.date).getTime() - new Date(b.date).getTime();
                case 'title':
                    return a.title.localeCompare(b.title);
                case 'capacity':
                    return b.capacity - a.capacity;
                default:
                    return 0;
            }
        });

        return sorted;
    }, [initialEvents, searchQuery, sortBy]);

    return (
        <>
            {/* Search and Filter Bar */}
            <div className="mb-8 space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search Input */}
                    <div className="flex-1 relative">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-apple-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="search"
                            placeholder="Search events by title, description, or location..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-apple-gray-200 text-[15px] outline-none transition-all duration-200 focus:border-apple-blue focus:ring-4 focus:ring-apple-blue/10 placeholder:text-apple-gray-300"
                            aria-label="Search events"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute inset-y-0 right-4 flex items-center text-apple-gray-400 hover:text-apple-black transition-colors"
                                aria-label="Clear search"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* Sort Dropdown */}
                    <div className="flex items-center gap-2">
                        <label htmlFor="sort-select" className="text-[13px] font-medium text-apple-gray-400 whitespace-nowrap">
                            Sort by:
                        </label>
                        <select
                            id="sort-select"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as 'date' | 'title' | 'capacity')}
                            className="px-4 py-3 rounded-xl border border-apple-gray-200 text-[15px] outline-none transition-all duration-200 focus:border-apple-blue focus:ring-4 focus:ring-apple-blue/10 bg-white"
                            aria-label="Sort events"
                        >
                            <option value="date">Date</option>
                            <option value="title">Title</option>
                            <option value="capacity">Capacity</option>
                        </select>
                    </div>
                </div>

                {/* Results Count */}
                {searchQuery && (
                    <p className="text-[13px] text-apple-gray-400">
                        Found {filteredAndSortedEvents.length} {filteredAndSortedEvents.length === 1 ? 'event' : 'events'}
                    </p>
                )}
            </div>

            {/* Events Grid */}
            {filteredAndSortedEvents.length === 0 ? (
                searchQuery ? (
                    <EmptyState
                        icon="search"
                        title="No events found"
                        description={`We couldn't find any events matching "${searchQuery}". Try adjusting your search.`}
                        action={{
                            label: 'Clear Search',
                            onClick: () => setSearchQuery(''),
                        }}
                    />
                ) : (
                    <EmptyState
                        icon="calendar"
                        title="No events available"
                        description="Check back later for new experiences."
                    />
                )
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredAndSortedEvents.map((event) => (
                        <Link key={event._id} href={`/events/${event._id}`} className="group">
                            <article className="apple-card h-full flex flex-col overflow-hidden">
                                <div className="relative h-35 bg-apple-gray-50 flex items-center justify-center">
                                    <div className="text-center">
                                        <p className="text-[40px] font-semibold text-apple-black/80 leading-none">
                                            {format(new Date(event.date), 'dd')}
                                        </p>
                                        <p className="text-[13px] font-medium text-apple-gray-300 uppercase tracking-wider mt-1">
                                            {format(new Date(event.date), 'MMM yyyy')}
                                        </p>
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

                                        {/* Capacity indicator */}
                                        <div className="flex items-center gap-2 text-[13px] text-apple-gray-400">
                                            <svg className="w-3.5 h-3.5 text-apple-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                            <span>
                                                {event.reservedCount || 0} / {event.capacity} spots
                                            </span>
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
        </>
    );
}
