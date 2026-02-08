'use client';

import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { format } from 'date-fns';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await api.get<User[]>('/users');
      setUsers(data);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">User Management</h1>
      
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Joined</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {users.map((user) => (
              <tr key={user._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                   {/* Fallback for missing createdAt if backend doesn't return it yet */}
                   {user.createdAt ? format(new Date(user.createdAt), 'PP') : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
