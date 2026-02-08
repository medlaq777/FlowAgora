'use client';

import { useEffect, useState, use } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Event, EventStatus } from '@/types/event';

export default function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { token } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<Event>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (token && id) {
      fetch(`http://localhost:3000/events/${id}`)
        .then(res => res.json())
        .then(data => {
            const date = new Date(data.date);
            const formattedDate = date.toISOString().slice(0, 16);
            setFormData({ ...data, date: formattedDate });
            setLoading(false);
        })
        .catch(err => {
            console.error(err);
            setLoading(false);
        });
    }
  }, [token, id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`http://localhost:3000/events/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            title: formData.title,
            description: formData.description,
            date: formData.date,
            location: formData.location,
            capacity: formData.capacity,
        }),
      });

      if (!res.ok) throw new Error('Failed to update event');
      if (formData.status) {
          await fetch(`http://localhost:3000/events/${id}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status: formData.status })
          });
      }

      router.push('/admin/events');
    } catch (err) {
      console.error(err);
      alert('Error updating event');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Edit Event</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
          <input
            type="text"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 p-2"
            value={formData.title || ''}
            onChange={e => setFormData({...formData, title: e.target.value})}
          />
        </div>

        <div>
           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
           <select
             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 p-2"
             value={formData.status}
             onChange={e => setFormData({...formData, status: e.target.value as EventStatus})}
           >
             <option value={EventStatus.DRAFT}>Draft</option>
             <option value={EventStatus.PUBLISHED}>Published</option>
             <option value={EventStatus.CANCELED}>Canceled</option>
           </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
          <textarea
            required
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 p-2"
            value={formData.description || ''}
            onChange={e => setFormData({...formData, description: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date & Time</label>
            <input
              type="datetime-local"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 p-2"
              value={formData.date || ''}
              onChange={e => setFormData({...formData, date: e.target.value})}
            />
          </div>
           <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 p-2"
              value={formData.location || ''}
              onChange={e => setFormData({...formData, location: e.target.value})}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Capacity</label>
          <input
            type="number"
            required
            min="1"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 p-2"
            value={formData.capacity || 0}
            onChange={e => setFormData({...formData, capacity: parseInt(e.target.value)})}
          />
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
