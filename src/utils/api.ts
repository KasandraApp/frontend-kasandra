export const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://backend-kasandra.vercel.app/api/v1';

interface ApiFetchOptions extends RequestInit {
  redirectOnUnauthorized?: boolean;
}

function resolveAuthToken() {
  if (typeof window === 'undefined') {
    return null;
  }

  const storedToken = localStorage.getItem('kasandra:token');
  if (storedToken) {
    return storedToken;
  }

  const params = new URLSearchParams(window.location.search);
  const tokenFromUrl = params.get('token');
  if (tokenFromUrl) {
    localStorage.setItem('kasandra:token', tokenFromUrl);
    const cleanUrl = `${window.location.pathname}${window.location.hash}`;
    window.history.replaceState({}, document.title, cleanUrl);
    return tokenFromUrl;
  }

  return null;
}

export async function apiFetch<T>(endpoint: string, options?: ApiFetchOptions): Promise<T> {
  const token = resolveAuthToken();
  const headers = new Headers(options?.headers);
  const redirectOnUnauthorized = options?.redirectOnUnauthorized ?? true;

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  if (!headers.has('Content-Type') && options?.body && typeof options.body === 'string') {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem('kasandra:token');
    if (redirectOnUnauthorized && !window.location.pathname.startsWith('/oauth/google/setup')) {
      window.location.href = '/';
    }
    throw new Error('Unauthorized – redirecting to login');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || `API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
