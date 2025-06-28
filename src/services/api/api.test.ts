import { getApiConfig } from '@/utils/env';
import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';

// Mock dependencies
jest.mock('@/utils/env');
jest.mock('@tanstack/react-query');
jest.mock('axios');

const mockGetApiConfig = getApiConfig as jest.MockedFunction<typeof getApiConfig>;
const mockAxiosCreate = axios.create as jest.MockedFunction<typeof axios.create>;

describe('API Service', () => {
  let mockAxiosInstance: Partial<AxiosInstance>;
  let mockRequestInterceptor: {
    successFn: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig;
    errorFn: (error: unknown) => Promise<never>;
  };
  let mockResponseInterceptor: {
    successFn: (response: AxiosResponse) => AxiosResponse;
    errorFn: (error: unknown) => Promise<never>;
  };

  beforeEach(async () => {
    // Reset all mocks
    jest.clearAllMocks();

    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(),
        removeItem: jest.fn(),
      },
      writable: true,
    });

    // Setup axios mock
    mockAxiosInstance = {
      interceptors: {
        request: {
          use: jest.fn(),
          eject: jest.fn(),
          clear: jest.fn(),
        },
        response: {
          use: jest.fn(),
          eject: jest.fn(),
          clear: jest.fn(),
        },
      },
    };

    mockAxiosCreate.mockReturnValue(mockAxiosInstance as AxiosInstance);
    mockGetApiConfig.mockReturnValue({
      baseURL: 'http://localhost:3000',
      headers: {
        'x-api-key': 'test-api-key',
        'Content-Type': 'application/json',
      },
    });

    // Capture interceptor functions
    (mockAxiosInstance.interceptors!.request.use as jest.Mock).mockImplementation(
      (
        successFn: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig,
        errorFn: (error: unknown) => Promise<never>,
      ) => {
        mockRequestInterceptor = { successFn, errorFn };
      },
    );

    (mockAxiosInstance.interceptors!.response.use as jest.Mock).mockImplementation(
      (
        successFn: (response: AxiosResponse) => AxiosResponse,
        errorFn: (error: unknown) => Promise<never>,
      ) => {
        mockResponseInterceptor = { successFn, errorFn };
      },
    );

    // Import the module after mocking
    await import('./api');
  });

  describe('Axios Instance Creation', () => {
    it('should create axios instance with correct config', () => {
      expect(mockGetApiConfig).toHaveBeenCalledTimes(1);
      expect(mockAxiosCreate).toHaveBeenCalledWith({
        baseURL: 'http://localhost:3000',
        headers: {
          'x-api-key': 'test-api-key',
          'Content-Type': 'application/json',
        },
      });
    });
  });

  describe('Request Interceptor', () => {
    it('should add authorization header for non-auth endpoints when token exists', () => {
      const mockConfig: InternalAxiosRequestConfig = {
        url: '/api/users',
        headers: {},
      } as InternalAxiosRequestConfig;
      const mockToken = 'test-token';

      (window.localStorage.getItem as jest.Mock).mockReturnValue(mockToken);

      const result = mockRequestInterceptor.successFn(mockConfig);

      expect(window.localStorage.getItem).toHaveBeenCalledWith('auth_token');
      expect(result.headers!.Authorization).toBe(`Bearer ${mockToken}`);
      expect(result).toBe(mockConfig);
    });

    it('should not add authorization header for auth endpoints', () => {
      const mockConfig: InternalAxiosRequestConfig = {
        url: '/login',
        headers: {},
      } as InternalAxiosRequestConfig;

      const result = mockRequestInterceptor.successFn(mockConfig);

      expect(window.localStorage.getItem).not.toHaveBeenCalled();
      expect(result.headers!.Authorization).toBeUndefined();
      expect(result).toBe(mockConfig);
    });

    it('should not add authorization header for register endpoint', () => {
      const mockConfig: InternalAxiosRequestConfig = {
        url: '/register',
        headers: {},
      } as InternalAxiosRequestConfig;

      const result = mockRequestInterceptor.successFn(mockConfig);

      expect(window.localStorage.getItem).not.toHaveBeenCalled();
      expect(result.headers!.Authorization).toBeUndefined();
      expect(result).toBe(mockConfig);
    });

    it('should not add authorization header when no token exists', () => {
      const mockConfig: InternalAxiosRequestConfig = {
        url: '/api/users',
        headers: {},
      } as InternalAxiosRequestConfig;

      (window.localStorage.getItem as jest.Mock).mockReturnValue(null);

      const result = mockRequestInterceptor.successFn(mockConfig);

      expect(window.localStorage.getItem).toHaveBeenCalledWith('auth_token');
      expect(result.headers!.Authorization).toBeUndefined();
      expect(result).toBe(mockConfig);
    });

    it('should not add authorization header when config.headers is undefined', () => {
      const mockConfig = {
        url: '/api/users',
        headers: undefined,
      } as unknown as InternalAxiosRequestConfig;
      const mockToken = 'test-token';

      (window.localStorage.getItem as jest.Mock).mockReturnValue(mockToken);

      const result = mockRequestInterceptor.successFn(mockConfig);

      expect(window.localStorage.getItem).toHaveBeenCalledWith('auth_token');
      expect(result).toBe(mockConfig);
    });

    it('should handle request interceptor error', async () => {
      const mockError = new Error('Request error');

      const result = mockRequestInterceptor.errorFn(mockError);

      await expect(result).rejects.toThrow('Request error');
    });
  });

  describe('Response Interceptor', () => {
    it('should return response unchanged on success', () => {
      const mockResponse: AxiosResponse = {
        data: 'test data',
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as InternalAxiosRequestConfig,
      };

      const result = mockResponseInterceptor.successFn(mockResponse);

      expect(result).toBe(mockResponse);
    });

    it('should handle 401 error by removing token', () => {
      const mockError = {
        response: {
          status: 401,
        },
      };

      const result = mockResponseInterceptor.errorFn(mockError);

      expect(window.localStorage.removeItem).toHaveBeenCalledWith('auth_token');
      expect(result).rejects.toBe(mockError);
    });

    it('should not handle non-401 errors', () => {
      const mockError = {
        response: {
          status: 500,
        },
      };

      const result = mockResponseInterceptor.errorFn(mockError);

      expect(window.localStorage.removeItem).not.toHaveBeenCalled();
      expect(result).rejects.toBe(mockError);
    });

    it('should handle error without response property', () => {
      const mockError = new Error('Network error');

      const result = mockResponseInterceptor.errorFn(mockError);

      expect(window.localStorage.removeItem).not.toHaveBeenCalled();
      expect(result).rejects.toBe(mockError);
    });

    it('should handle error with response but no status', () => {
      const mockError = {
        response: {},
      };

      const result = mockResponseInterceptor.errorFn(mockError);

      expect(window.localStorage.removeItem).not.toHaveBeenCalled();
      expect(result).rejects.toBe(mockError);
    });
  });
});
