import './globals.css';
import { Inter } from 'next/font/google';
import { ToastProvider } from '@/context/ToastContext';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import NetworkErrorHandler from '@/components/ui/NetworkErrorHandler';

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
                <a href="#main-content" className="skip-link">
                    Skip to main content
                </a>
                <ToastProvider>
                    <AuthProvider>
                        <NetworkErrorHandler />
                        <Navbar />
                        <main id="main-content" className="pt-16 min-h-screen">
                            {children}
                        </main>
                    </AuthProvider>
                </ToastProvider>
            </body>
        </html>
    );
}
