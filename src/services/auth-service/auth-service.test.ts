import api from '@/services/api/api';
import { AxiosError } from 'axios';
import AuthService from './auth-service';

// Mock the API module
jest.mock('@/services/api/api', () => ({
  post: jest.fn(),
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should successfully register a user', async () => {
      const payload = { email: 'test@test.com', password: 'password123' };
      const mockResponse = { data: { token: 'test-token', user: { id: 1 } } };

      (api.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await AuthService.register(payload);

      expect(api.post).toHaveBeenCalledWith('/register', payload);
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle registration error with response data', async () => {
      const payload = { email: 'test@test.com', password: 'password123' };
      const mockError = new AxiosError('Email already exists', '400', undefined, undefined, {
        status: 400,
        data: { error: 'Email already exists' },
      } as AxiosError['response']);

      (api.post as jest.Mock).mockRejectedValue(mockError);

      await expect(AuthService.register(payload)).rejects.toThrow('Email already exists');
    });

    it('should handle registration error without response data', async () => {
      const payload = { email: 'test@test.com', password: 'password123' };
      const mockError = new AxiosError('Registration failed', '400', undefined, undefined, {
        status: 400,
        data: {},
      } as AxiosError['response']);

      (api.post as jest.Mock).mockRejectedValue(mockError);

      await expect(AuthService.register(payload)).rejects.toThrow('Registration failed');
    });

    it('should handle non-AxiosError', async () => {
      const payload = { email: 'test@test.com', password: 'password123' };
      const mockError = new Error('Network error');

      (api.post as jest.Mock).mockRejectedValue(mockError);

      await expect(AuthService.register(payload)).rejects.toThrow('Network error');
    });

    it('should handle error with response but no data', async () => {
      const payload = { email: 'test@test.com', password: 'password123' };
      const mockError = new AxiosError('Registration failed', '400', undefined, undefined, {
        status: 400,
      } as AxiosError['response']);

      (api.post as jest.Mock).mockRejectedValue(mockError);

      await expect(AuthService.register(payload)).rejects.toThrow('Registration failed');
    });

    it('should handle error with response.data as string', async () => {
      const payload = { email: 'test@test.com', password: 'password123' };
      const mockError = new AxiosError('Simple error message', '400', undefined, undefined, {
        status: 400,
        data: { error: 'Simple error message' },
      } as AxiosError['response']);

      (api.post as jest.Mock).mockRejectedValue(mockError);

      await expect(AuthService.register(payload)).rejects.toThrow('Simple error message');
    });

    it('should handle error with response.data as number', async () => {
      const payload = { email: 'test@test.com', password: 'password123' };
      const mockError = new AxiosError('500', '500', undefined, undefined, {
        status: 500,
        data: { error: '500' },
      } as AxiosError['response']);

      (api.post as jest.Mock).mockRejectedValue(mockError);

      await expect(AuthService.register(payload)).rejects.toThrow('500');
    });
  });

  describe('login', () => {
    it('should successfully login a user', async () => {
      const payload = { email: 'test@test.com', password: 'password123' };
      const mockResponse = { data: { token: 'test-token', user: { id: 1 } } };

      (api.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await AuthService.login(payload);

      expect(api.post).toHaveBeenCalledWith('/login', payload);
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle login error with response data', async () => {
      const payload = { email: 'test@test.com', password: 'password123' };
      const mockError = new AxiosError('Invalid credentials', '401', undefined, undefined, {
        status: 401,
        data: { error: 'Invalid credentials' },
      } as AxiosError['response']);

      (api.post as jest.Mock).mockRejectedValue(mockError);

      await expect(AuthService.login(payload)).rejects.toThrow('Invalid credentials');
    });

    it('should handle login error without response data', async () => {
      const payload = { email: 'test@test.com', password: 'password123' };
      const mockError = new AxiosError('Login failed', '401', undefined, undefined, {
        status: 401,
        data: {},
      } as AxiosError['response']);

      (api.post as jest.Mock).mockRejectedValue(mockError);

      await expect(AuthService.login(payload)).rejects.toThrow('Login failed');
    });

    it('should handle non-AxiosError', async () => {
      const payload = { email: 'test@test.com', password: 'password123' };
      const mockError = new Error('Network error');

      (api.post as jest.Mock).mockRejectedValue(mockError);

      await expect(AuthService.login(payload)).rejects.toThrow('Network error');
    });

    it('should handle error with response but no data', async () => {
      const payload = { email: 'test@test.com', password: 'password123' };
      const mockError = new AxiosError('Login failed', '401', undefined, undefined, {
        status: 401,
      } as AxiosError['response']);

      (api.post as jest.Mock).mockRejectedValue(mockError);

      await expect(AuthService.login(payload)).rejects.toThrow('Login failed');
    });
  });

  describe('setToken', () => {
    it('should store token in localStorage', () => {
      const token = 'test-token';

      AuthService.setToken(token);

      expect(localStorageMock.setItem).toHaveBeenCalledWith('auth_token', token);
    });

    it('should handle empty token', () => {
      const token = '';

      AuthService.setToken(token);

      expect(localStorageMock.setItem).toHaveBeenCalledWith('auth_token', token);
    });

    it('should handle localStorage.setItem throwing error', () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });

      const token = 'test-token';

      expect(() => AuthService.setToken(token)).toThrow('localStorage error');
    });
  });

  describe('getToken', () => {
    it('should retrieve token from localStorage', () => {
      const token = 'test-token';
      localStorageMock.getItem.mockReturnValue(token);

      const result = AuthService.getToken();

      expect(localStorageMock.getItem).toHaveBeenCalledWith('auth_token');
      expect(result).toBe(token);
    });

    it('should return null when no token exists', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const result = AuthService.getToken();

      expect(localStorageMock.getItem).toHaveBeenCalledWith('auth_token');
      expect(result).toBeNull();
    });

    it('should handle localStorage.getItem throwing error', () => {
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });

      expect(() => AuthService.getToken()).toThrow('localStorage error');
    });
  });

  describe('removeToken', () => {
    it('should remove token from localStorage', () => {
      AuthService.removeToken();

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('auth_token');
    });

    it('should handle localStorage.removeItem throwing error', () => {
      localStorageMock.removeItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });

      expect(() => AuthService.removeToken()).toThrow('localStorage error');
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when token exists', () => {
      localStorageMock.getItem.mockReturnValue('test-token');

      const result = AuthService.isAuthenticated();

      expect(localStorageMock.getItem).toHaveBeenCalledWith('auth_token');
      expect(result).toBe(true);
    });

    it('should return false when no token exists', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const result = AuthService.isAuthenticated();

      expect(localStorageMock.getItem).toHaveBeenCalledWith('auth_token');
      expect(result).toBe(false);
    });

    it('should return false when token is empty string', () => {
      localStorageMock.getItem.mockReturnValue('');

      const result = AuthService.isAuthenticated();

      expect(localStorageMock.getItem).toHaveBeenCalledWith('auth_token');
      expect(result).toBe(false);
    });

    it('should handle localStorage.getItem throwing error', () => {
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });

      expect(() => AuthService.isAuthenticated()).toThrow('localStorage error');
    });
  });

  describe('Service Integration', () => {
    it('should export all methods', () => {
      expect(AuthService.register).toBeDefined();
      expect(AuthService.login).toBeDefined();
      expect(AuthService.setToken).toBeDefined();
      expect(AuthService.getToken).toBeDefined();
      expect(AuthService.removeToken).toBeDefined();
      expect(AuthService.isAuthenticated).toBeDefined();
    });

    it('should have correct method types', () => {
      expect(typeof AuthService.register).toBe('function');
      expect(typeof AuthService.login).toBe('function');
      expect(typeof AuthService.setToken).toBe('function');
      expect(typeof AuthService.getToken).toBe('function');
      expect(typeof AuthService.removeToken).toBe('function');
      expect(typeof AuthService.isAuthenticated).toBe('function');
    });
  });

  describe('Error Handling Edge Cases', () => {
    it('should handle API response with unexpected structure', async () => {
      const payload = { email: 'test@test.com', password: 'password123' };
      const mockResponse = { data: null };

      (api.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await AuthService.register(payload);

      expect(result).toBeNull();
    });

    it('should handle error with response.data as string', async () => {
      const payload = { email: 'test@test.com', password: 'password123' };
      const mockError = new AxiosError('Simple error message', '400', undefined, undefined, {
        status: 400,
        data: { error: 'Simple error message' },
      } as AxiosError['response']);

      (api.post as jest.Mock).mockRejectedValue(mockError);

      await expect(AuthService.register(payload)).rejects.toThrow('Simple error message');
    });

    it('should handle error with response.data as number', async () => {
      const payload = { email: 'test@test.com', password: 'password123' };
      const mockError = new AxiosError('500', '500', undefined, undefined, {
        status: 500,
        data: { error: '500' },
      } as AxiosError['response']);

      (api.post as jest.Mock).mockRejectedValue(mockError);

      await expect(AuthService.register(payload)).rejects.toThrow('500');
    });
  });
});
