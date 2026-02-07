'use client';

import { useState } from 'react';

export default function ClientExample() {
  const [count, setCount] = useState(0);

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h3 className="font-bold text-lg mb-2">Client Component (CSR)</h3>
      <p className="mb-4">This component runs on the client. Count: {count}</p>
      <button
        onClick={() => setCount(count + 1)}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Increment
      </button>
    </div>
  );
}
