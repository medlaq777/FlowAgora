import { eventsService, Event as EventModel } from '@/services/events.service';
import ClientEventsList from './ClientEventsList';
import { CardGridSkeleton } from '@/components/ui/LoadingSkeleton';
import { Suspense } from 'react';

// Ensure fresh data is fetched on every request
export const dynamic = 'force-dynamic';

async function EventsContent() {
    let events: EventModel[] = [];
    let error = null;

    try {
        events = await eventsService.findAllPublished();
    } catch (err) {
        console.error('Failed to fetch events', err);
        error = err;
    }

    if (error) {
        return (
            <div className="max-w-245 mx-auto px-6 py-16">
                <div className="text-center mb-14">
                    <h1 className="text-[40px] md:text-[48px] font-semibold text-apple-black tracking-[-0.03em] mb-3">
                        Explore Events
                    </h1>
                    <p className="text-[17px] text-apple-gray-300 max-w-md mx-auto">
                        Discover upcoming experiences crafted just for you.
                    </p>
                </div>

                <div className="apple-card p-20 text-center">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-red-50 flex items-center justify-center">
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <p className="text-apple-gray-400 text-lg font-medium mb-2">Failed to load events</p>
                    <p className="text-apple-gray-300 text-sm">Please try again later or contact support if the problem persists.</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="btn-primary mt-6 inline-flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-245 mx-auto px-6 py-16">
            <div className="text-center mb-14">
                <h1 className="text-[40px] md:text-[48px] font-semibold text-apple-black tracking-[-0.03em] mb-3">
                    Explore Events
                </h1>
                <p className="text-[17px] text-apple-gray-300 max-w-md mx-auto">
                    Discover upcoming experiences crafted just for you.
                </p>
            </div>

            <ClientEventsList initialEvents={events} />
        </div>
    );
}

export default function EventsPage() {
    return (
        <Suspense fallback={
            <div className="max-w-245 mx-auto px-6 py-16">
                <div className="text-center mb-14">
                    <h1 className="text-[40px] md:text-[48px] font-semibold text-apple-black tracking-[-0.03em] mb-3">
                        Explore Events
                    </h1>
                    <p className="text-[17px] text-apple-gray-300 max-w-md mx-auto">
                        Discover upcoming experiences crafted just for you.
                    </p>
                </div>
                <CardGridSkeleton count={6} />
            </div>
        }>
            <EventsContent />
        </Suspense>
    );
}
