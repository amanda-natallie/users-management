import { authUtils } from './auth';

jest.mock('@/services', () => ({
  AuthService: {
    isAuthenticated: jest.fn(),
    getToken: jest.fn(),
    setToken: jest.fn(),
    removeToken: jest.fn(),
  },
}));

describe('authUtils', () => {
  const mockAuthService = {
    isAuthenticated: jest.fn(),
    getToken: jest.fn(),
    setToken: jest.fn(),
    removeToken: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    const AuthService = jest.requireMock('@/services').AuthService;
    Object.assign(AuthService, mockAuthService);
  });

  describe('isAuthenticated', () => {
    it('should return true when AuthService.isAuthenticated returns true', () => {
      mockAuthService.isAuthenticated.mockReturnValue(true);

      const result = authUtils.isAuthenticated();

      expect(mockAuthService.isAuthenticated).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should return false when AuthService.isAuthenticated returns false', () => {
      mockAuthService.isAuthenticated.mockReturnValue(false);

      const result = authUtils.isAuthenticated();

      expect(mockAuthService.isAuthenticated).toHaveBeenCalled();
      expect(result).toBe(false);
    });

    it('should handle AuthService.isAuthenticated throwing error', () => {
      mockAuthService.isAuthenticated.mockImplementation(() => {
        throw new Error('Auth service error');
      });

      expect(() => authUtils.isAuthenticated()).toThrow('Auth service error');
    });
  });

  describe('getToken', () => {
    it('should retrieve token from AuthService', () => {
      const token = 'test-token';
      mockAuthService.getToken.mockReturnValue(token);

      const result = authUtils.getToken();

      expect(mockAuthService.getToken).toHaveBeenCalled();
      expect(result).toBe(token);
    });

    it('should return null when AuthService.getToken returns null', () => {
      mockAuthService.getToken.mockReturnValue(null);

      const result = authUtils.getToken();

      expect(mockAuthService.getToken).toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should handle AuthService.getToken throwing error', () => {
      mockAuthService.getToken.mockImplementation(() => {
        throw new Error('Auth service error');
      });

      expect(() => authUtils.getToken()).toThrow('Auth service error');
    });
  });

  describe('setToken', () => {
    it('should store token via AuthService', () => {
      const token = 'test-token';

      authUtils.setToken(token);

      expect(mockAuthService.setToken).toHaveBeenCalledWith(token);
    });

    it('should handle empty token', () => {
      const token = '';

      authUtils.setToken(token);

      expect(mockAuthService.setToken).toHaveBeenCalledWith(token);
    });

    it('should handle AuthService.setToken throwing error', () => {
      mockAuthService.setToken.mockImplementation(() => {
        throw new Error('Auth service error');
      });

      const token = 'test-token';

      expect(() => authUtils.setToken(token)).toThrow('Auth service error');
    });
  });

  describe('logout', () => {
    it('should call AuthService.removeToken', () => {
      authUtils.logout();

      expect(mockAuthService.removeToken).toHaveBeenCalled();
    });

    it('should handle AuthService.removeToken throwing error', () => {
      mockAuthService.removeToken.mockImplementation(() => {
        throw new Error('Auth service error');
      });

      expect(() => authUtils.logout()).toThrow('Auth service error');
    });
  });

  describe('getAuthHeader', () => {
    it('should return Authorization header when token exists', () => {
      const token = 'test-token';
      mockAuthService.getToken.mockReturnValue(token);

      const result = authUtils.getAuthHeader();

      expect(mockAuthService.getToken).toHaveBeenCalled();
      expect(result).toEqual({ Authorization: 'Bearer test-token' });
    });

    it('should return empty object when no token exists', () => {
      mockAuthService.getToken.mockReturnValue(null);

      const result = authUtils.getAuthHeader();

      expect(mockAuthService.getToken).toHaveBeenCalled();
      expect(result).toEqual({});
    });

    it('should return empty object when token is empty string', () => {
      mockAuthService.getToken.mockReturnValue('');

      const result = authUtils.getAuthHeader();

      expect(mockAuthService.getToken).toHaveBeenCalled();
      expect(result).toEqual({});
    });

    it('should handle AuthService.getToken throwing error', () => {
      mockAuthService.getToken.mockImplementation(() => {
        throw new Error('Auth service error');
      });

      expect(() => authUtils.getAuthHeader()).toThrow('Auth service error');
    });
  });

  describe('Utils Integration', () => {
    it('should export all methods', () => {
      expect(authUtils.isAuthenticated).toBeDefined();
      expect(authUtils.getToken).toBeDefined();
      expect(authUtils.setToken).toBeDefined();
      expect(authUtils.logout).toBeDefined();
      expect(authUtils.getAuthHeader).toBeDefined();
    });

    it('should have correct method types', () => {
      expect(typeof authUtils.isAuthenticated).toBe('function');
      expect(typeof authUtils.getToken).toBe('function');
      expect(typeof authUtils.setToken).toBe('function');
      expect(typeof authUtils.logout).toBe('function');
      expect(typeof authUtils.getAuthHeader).toBe('function');
    });
  });

  describe('Edge Cases', () => {
    it('should handle AuthService methods being undefined', () => {
      const AuthService = jest.requireMock('@/services').AuthService;
      AuthService.isAuthenticated = undefined;

      expect(() => authUtils.isAuthenticated()).toThrow();
    });

    it('should handle AuthService methods being null', () => {
      const AuthService = jest.requireMock('@/services').AuthService;
      AuthService.isAuthenticated = null;

      expect(() => authUtils.isAuthenticated()).toThrow();
    });
  });
});
