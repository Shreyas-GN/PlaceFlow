import axios from 'axios';
import { toast } from 'sonner';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
});

// Attach token to every request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const adminStorage = localStorage.getItem('admin-auth-storage');
    if (adminStorage) {
      try {
        const { state } = JSON.parse(adminStorage);
        if (state.token) {
          config.headers.Authorization = `Bearer ${state.token}`;
          return config;
        }
      } catch (e) {}
    }

    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      try {
        const { state } = JSON.parse(authStorage);
        if (state.token) {
          config.headers.Authorization = `Bearer ${state.token}`;
        }
      } catch (e) {}
    }
  }
  return config;
});

// 401 → redirect; network failures and 5xx → surface a fallback toast
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== 'undefined') {
      if (error.response?.status === 401) {
        const url = error.config?.url || '';
        const isAdminRoute = url.startsWith('/admin') || url.startsWith('/companies/') || url.startsWith('/applications/all');
        try {
          localStorage.removeItem('admin-auth-storage');
          localStorage.removeItem('auth-storage');
        } catch (e) {}
        window.location.href = isAdminRoute ? '/admin/login' : '/login';
      } else if (!error.response || error.response.status >= 500) {
        toast.error('Something went wrong — please try again');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
