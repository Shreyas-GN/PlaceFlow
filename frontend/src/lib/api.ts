import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor: attach student OR admin token (admin takes priority)
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const isAdminRoute = config.url?.startsWith('/admin');
    
    if (isAdminRoute) {
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
    }

    // Default to student token for all other routes
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

export default api;
