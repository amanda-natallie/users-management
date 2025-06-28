import useToast from '@/hooks/use-toast/use-toast';
import { renderHook } from '@testing-library/react';
import { useNavigate } from 'react-router';
import { useLogin, useLogout, useRegister } from './use-auth';

// Mock dependencies
jest.mock('@/services', () => ({
  AuthService: {
    register: jest.fn(),
    login: jest.fn(),
    setToken: jest.fn(),
    removeToken: jest.fn(),
  },
}));

jest.mock('react-router', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('@/hooks/use-toast/use-toast', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('@tanstack/react-query', () => ({
  useMutation: jest.fn(() => ({
    mutate: jest.fn(),
    mutateAsync: jest.fn(),
    isLoading: false,
    isError: false,
    error: null,
    data: null,
  })),
}));

describe('use-auth hooks', () => {
  const mockNavigate = jest.fn();
  const mockToast = {
    promise: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useToast as jest.Mock).mockReturnValue(mockToast);
  });

  describe('useRegister', () => {
    it('should return mutation object', () => {
      const { result } = renderHook(() => useRegister());
      expect(result.current).toBeDefined();
      expect(result.current).toHaveProperty('mutate');
      expect(result.current).toHaveProperty('mutateAsync');
    });

    it('should use toast hook', () => {
      renderHook(() => useRegister());
      expect(useToast).toHaveBeenCalled();
    });

    it('should use navigate hook', () => {
      renderHook(() => useRegister());
      expect(useNavigate).toHaveBeenCalled();
    });
  });

  describe('useLogin', () => {
    it('should return mutation object', () => {
      const { result } = renderHook(() => useLogin());
      expect(result.current).toBeDefined();
      expect(result.current).toHaveProperty('mutate');
      expect(result.current).toHaveProperty('mutateAsync');
    });

    it('should use toast hook', () => {
      renderHook(() => useLogin());
      expect(useToast).toHaveBeenCalled();
    });

    it('should use navigate hook', () => {
      renderHook(() => useLogin());
      expect(useNavigate).toHaveBeenCalled();
    });
  });

  describe('useLogout', () => {
    it('should return mutation object', () => {
      const { result } = renderHook(() => useLogout());
      expect(result.current).toBeDefined();
      expect(result.current).toHaveProperty('mutate');
      expect(result.current).toHaveProperty('mutateAsync');
    });

    it('should use toast hook', () => {
      renderHook(() => useLogout());
      expect(useToast).toHaveBeenCalled();
    });
  });

  describe('Hook Integration', () => {
    it('should export all hooks', () => {
      expect(useRegister).toBeDefined();
      expect(useLogin).toBeDefined();
      expect(useLogout).toBeDefined();
    });
  });
});
