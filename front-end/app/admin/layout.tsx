'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/login');
      } else if (user.role !== 'ADMIN') {
        router.push('/'); // Redirect non-admins to home
      } else {
        setIsAuthorized(true);
      }
    }
  }, [user, isLoading, router]);

  if (isLoading || !isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const navItems = [
    { name: 'Dashboard', href: '/admin' },
    { name: 'Events', href: '/admin/events' },
    // { name: 'Reservations', href: '/admin/reservations' }, // Future
  ];

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-md hidden md:block">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Admin Panel</h2>
        </div>
        <nav className="mt-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 transition-colors
                ${pathname === item.href ? 'bg-blue-50 dark:bg-gray-700 text-blue-600 border-r-4 border-blue-600' : ''}
              `}
            >
              {item.name}
            </Link>
          ))}
          <Link
             href="/"
             className="block px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 transition-colors mt-8 border-t"
          >
            Exit Admin
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header (optional, simplified) */}
        <header className="md:hidden bg-white dark:bg-gray-800 shadow p-4 flex justify-between items-center">
             <span className="font-bold">Admin Panel</span>
             <Link href="/" className="text-sm text-blue-600">Exit</Link>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
