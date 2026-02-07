import { use } from 'react';

export default function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Event Details</h1>
      <p className="text-gray-600">Viewing event with ID: <span className="font-mono font-bold text-black">{id}</span></p>
      
      <div className="mt-8 p-4 bg-gray-50 rounded">
        <p className="text-sm text-gray-500">
          This page demonstrates dynamic routing in Next.js 15+. 
          The ID is captured from the URL.
        </p>
      </div>
    </div>
  );
}
