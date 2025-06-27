import { getApiConfig } from '@/utils/env';
import { QueryClient } from '@tanstack/react-query';
import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';

const api: AxiosInstance = axios.create(getApiConfig());

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const isAuthEndpoint = config.url?.includes('/register') || config.url?.includes('/login');

    if (!isAuthEndpoint) {
      const token = localStorage.getItem('auth_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');

      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export default api;
