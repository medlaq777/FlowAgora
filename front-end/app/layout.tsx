import './globals.css';
import { Inter } from 'next/font/google';
import { ToastProvider } from '@/context/ToastContext';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'FlowAgora',
    description: 'Experience events like never before.',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <ToastProvider>
                    <AuthProvider>
                        <Navbar />
                        <main className="pt-16 min-h-screen">
                            {children}
                        </main>
                    </AuthProvider>
                </ToastProvider>
            </body>
        </html>
    );
}
