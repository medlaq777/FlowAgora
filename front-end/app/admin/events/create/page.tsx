'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { eventsService } from '@/services/events.service';
import { useToast } from '@/context/ToastContext';
import Link from 'next/link';

export default function CreateEventPage() {
    const router = useRouter();
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        capacity: 100,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Combine date and time
            const dateTime = new Date(`${form.date}T${form.time}`);

            await eventsService.create({
                title: form.title,
                description: form.description,
                date: dateTime.toISOString(),
                location: form.location,
                capacity: Number(form.capacity),
            });

            toast.success('Event created successfully');
            router.push('/admin');
        } catch (error: unknown) {
            console.error(error);
            const message = error instanceof Error ? error.message : 'Failed to create event';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-6 py-12 animate-fade-in-up">
            <Link href="/admin" className="text-[13px] font-medium text-apple-gray-400 hover:text-apple-black mb-6 inline-flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Dashboard
            </Link>

            <div className="mb-8">
                <h1 className="text-[32px] font-bold text-apple-black tracking-[-0.03em] mb-2">Create New Event</h1>
                <p className="text-apple-gray-400">Fill in the details to publish a new event.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="apple-card p-6 space-y-6">
                    <div>
                        <label className="apple-label">Event Title</label>
                        <input
                            type="text"
                            required
                            className="apple-input"
                            placeholder="e.g. Summer Music Festival"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="apple-label">Description</label>
                        <textarea
                            required
                            rows={4}
                            className="apple-input resize-none"
                            placeholder="Describe the event..."
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="apple-label">Date</label>
                            <input
                                type="date"
                                required
                                className="apple-input"
                                value={form.date}
                                onChange={(e) => setForm({ ...form, date: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="apple-label">Time</label>
                            <input
                                type="time"
                                required
                                className="apple-input"
                                value={form.time}
                                onChange={(e) => setForm({ ...form, time: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="apple-label">Location</label>
                            <input
                                type="text"
                                required
                                className="apple-input"
                                placeholder="e.g. Central Park, NY"
                                value={form.location}
                                onChange={(e) => setForm({ ...form, location: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="apple-label">Capacity</label>
                            <input
                                type="number"
                                required
                                min="1"
                                className="apple-input"
                                value={form.capacity}
                                onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3">
                    <Link href="/admin" className="btn-secondary">
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`btn-primary ${loading ? 'opacity-70' : ''}`}
                    >
                        {loading ? 'Creating...' : 'Create Event'}
                    </button>
                </div>
            </form>
        </div>
    );
}
