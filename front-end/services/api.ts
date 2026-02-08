import { getToken } from '@/context/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(errorData.message || 'Something went wrong', response.status);
  }

  // Handle empty responses (e.g. 204 No Content)
  if (response.status === 204) {
      return {} as T;
  }

  return response.json();
}

export const api = {
  get: <T>(endpoint: string, options?: FetchOptions) => request<T>(endpoint, { ...options, method: 'GET' }),
  post: <T>(endpoint: string, body: any, options?: FetchOptions) => request<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
  put: <T>(endpoint: string, body: any, options?: FetchOptions) => request<T>(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  patch: <T>(endpoint: string, body: any, options?: FetchOptions) => request<T>(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(endpoint: string, options?: FetchOptions) => request<T>(endpoint, { ...options, method: 'DELETE' }),
};
