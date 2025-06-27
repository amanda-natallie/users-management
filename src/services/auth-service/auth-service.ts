import api from '@/services/api/api';
import { AxiosError } from 'axios';
import { LoginPayload, LoginResponse, RegisterPayload, RegisterResponse } from './types';

const AuthService = {
  async register(payload: RegisterPayload): Promise<RegisterResponse> {
    try {
      const response = await api.post<RegisterResponse>('/register', payload);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data) {
        throw new Error(error.response.data.error || 'Registration failed');
      }
      throw error;
    }
  },
  async login(payload: LoginPayload): Promise<LoginResponse> {
    try {
      const response = await api.post<LoginResponse>('/login', payload);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data) {
        throw new Error(error.response.data.error || 'Login failed');
      }
      throw error;
    }
  },
  setToken(token: string): void {
    localStorage.setItem('auth_token', token);
  },
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  },
  removeToken(): void {
    localStorage.removeItem('auth_token');
  },
  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};

export default AuthService;
