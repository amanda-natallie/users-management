import { AuthService } from '@/services';

export const authUtils = {
  isAuthenticated: (): boolean => {
    return AuthService.isAuthenticated();
  },

  getToken: (): string | null => {
    return AuthService.getToken();
  },

  setToken: (token: string): void => {
    AuthService.setToken(token);
  },

  logout: (): void => {
    AuthService.removeToken();
  },

  getAuthHeader: (): { Authorization: string } | Record<string, never> => {
    const token = AuthService.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
};
