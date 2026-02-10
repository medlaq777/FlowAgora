const API_URL = typeof window === 'undefined' 
  ? (process.env.API_URL_INTERNAL || 'http://localhost:3001') 
  : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'); 

export interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
  responseType?: 'json' | 'blob' | 'text';
}

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = 'ApiError';
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

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);

    if (!response.ok) {
        let errorMessage = response.statusText;
        let errorData = null;
        try {
            errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
        } catch {
        }
        throw new ApiError(errorMessage, response.status, errorData);
    }

    if (response.status === 204) {
      return {} as T;
    }

    const responseType = options.responseType || 'json';

    if (responseType === 'blob') {
        return (await response.blob()) as unknown as T;
    }

    if (responseType === 'text') {
        return (await response.text()) as unknown as T;
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
        throw error;
    }
    throw new ApiError(error instanceof Error ? error.message : 'Network error', 0);
  }
}

export const api = {
  get: <T>(endpoint: string, options?: FetchOptions) => request<T>(endpoint, { ...options, method: 'GET' }),
  post: <T, B = unknown>(endpoint: string, body: B, options?: FetchOptions) => request<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
  put: <T, B = unknown>(endpoint: string, body: B, options?: FetchOptions) => request<T>(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  patch: <T, B = unknown>(endpoint: string, body: B, options?: FetchOptions) => request<T>(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(endpoint: string, options?: FetchOptions) => request<T>(endpoint, { ...options, method: 'DELETE' }),
};
