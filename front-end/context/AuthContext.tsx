'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  email: string;
  role: string;
  sub: string; // userId from JWT
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Initialize from localStorage
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      // In a real app, we'd verify the token or decode it here.
      // For now, we'll assume it's valid if present and maybe decode payload if needed
      // Simple decode for demo purposes (BE CAREFUL IN PRODUCTION)
      try {
        const payload = JSON.parse(atob(storedToken.split('.')[1]));
        setUser({ email: payload.email, role: payload.role, sub: payload.sub });
      } catch (e) {
        console.error('Invalid token format', e);
        localStorage.removeItem('token');
        setToken(null);
      }
    }
    setIsLoading(false);
  }, []);

  const login = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    try {
      const payload = JSON.parse(atob(newToken.split('.')[1]));
      setUser({ email: payload.email, role: payload.role, sub: payload.sub });
      router.push('/'); // Redirect to home or protected route
    } catch (e) {
      console.error('Login failed: invalid token', e);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
