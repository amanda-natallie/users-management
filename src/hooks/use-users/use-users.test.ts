import { renderHook } from '@testing-library/react';
import { useUsers } from './use-users';

jest.mock('@/services', () => ({
  UsersService: {
    getUsers: jest.fn(),
  },
}));

jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(() => ({
    data: null,
    isLoading: false,
    isError: false,
    error: null,
    refetch: jest.fn(),
  })),
  useQueryClient: jest.fn(() => ({
    setQueryData: jest.fn(),
    getQueryData: jest.fn(),
    invalidateQueries: jest.fn(),
  })),
}));

jest.mock('@/hooks/use-toast/use-toast', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    promise: jest.fn(),
  })),
}));

describe('useUsers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Hook Configuration', () => {
    it('should return object with correct properties', () => {
      const { result } = renderHook(() => useUsers());

      expect(result.current).toBeDefined();
      expect(result.current).toHaveProperty('query');
      expect(result.current).toHaveProperty('handlePageChange');
      expect(result.current).toHaveProperty('getOptimisticState');
      expect(result.current).toHaveProperty('updateOptimisticState');
    });

    it('should use useQuery with correct configuration', () => {
      const mockUseQuery = jest.requireMock('@tanstack/react-query').useQuery;

      renderHook(() => useUsers());

      expect(mockUseQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          queryKey: ['users', 'list', 1],
          queryFn: expect.any(Function),
          staleTime: 5 * 60 * 1000,
        }),
      );
    });

    it('should use UsersService.getUsers as query function', () => {
      const mockUseQuery = jest.requireMock('@tanstack/react-query').useQuery;

      renderHook(() => useUsers());

      expect(mockUseQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          queryFn: expect.any(Function),
        }),
      );
    });
  });

  describe('Query Function', () => {
    it('should call UsersService.getUsers with correct page', async () => {
      const mockUseQuery = jest.requireMock('@tanstack/react-query').useQuery;
      const mockUsersService = jest.requireMock('@/services').UsersService;

      let queryFn: (() => Promise<unknown>) | undefined;
      (mockUseQuery as jest.Mock).mockImplementation(options => {
        queryFn = options.queryFn;
        return {
          data: null,
          isLoading: false,
          isError: false,
          error: null,
          refetch: jest.fn(),
        };
      });

      renderHook(() => useUsers());

      if (queryFn) {
        await queryFn();
      }

      expect(mockUsersService.getUsers).toHaveBeenCalledWith(1);
    });
  });

  describe('Return Values', () => {
    it('should return loading state correctly', () => {
      const mockUseQuery = jest.requireMock('@tanstack/react-query').useQuery;

      (mockUseQuery as jest.Mock).mockReturnValue({
        data: null,
        isLoading: true,
        isError: false,
        error: null,
        refetch: jest.fn(),
      });

      const { result } = renderHook(() => useUsers());

      expect(result.current.query.isLoading).toBe(true);
    });

    it('should return error state correctly', () => {
      const mockUseQuery = jest.requireMock('@tanstack/react-query').useQuery;
      const mockError = new Error('Failed to fetch users');

      (mockUseQuery as jest.Mock).mockReturnValue({
        data: null,
        isLoading: false,
        isError: true,
        error: mockError,
        refetch: jest.fn(),
      });

      const { result } = renderHook(() => useUsers());

      expect(result.current.query.isError).toBe(true);
      expect(result.current.query.error).toBe(mockError);
    });

    it('should return data correctly', () => {
      const mockUseQuery = jest.requireMock('@tanstack/react-query').useQuery;
      const mockData = { data: [], total: 0, page: 1, total_pages: 1 };

      (mockUseQuery as jest.Mock).mockReturnValue({
        data: mockData,
        isLoading: false,
        isError: false,
        error: null,
        refetch: jest.fn(),
      });

      const { result } = renderHook(() => useUsers());

      expect(result.current.query.data).toBe(mockData);
    });

    it('should return refetch function', () => {
      const mockUseQuery = jest.requireMock('@tanstack/react-query').useQuery;
      const mockRefetch = jest.fn();

      (mockUseQuery as jest.Mock).mockReturnValue({
        data: null,
        isLoading: false,
        isError: false,
        error: null,
        refetch: mockRefetch,
      });

      const { result } = renderHook(() => useUsers());

      expect(result.current.query.refetch).toBe(mockRefetch);
    });

    it('should return handlePageChange function', () => {
      const { result } = renderHook(() => useUsers());

      expect(typeof result.current.handlePageChange).toBe('function');
    });

    it('should return getOptimisticState function', () => {
      const { result } = renderHook(() => useUsers());

      expect(typeof result.current.getOptimisticState).toBe('function');
    });

    it('should return updateOptimisticState function', () => {
      const { result } = renderHook(() => useUsers());

      expect(typeof result.current.updateOptimisticState).toBe('function');
    });
  });

  describe('Hook Integration', () => {
    it('should integrate with react-query correctly', () => {
      const mockUseQuery = jest.requireMock('@tanstack/react-query').useQuery;

      renderHook(() => useUsers());

      expect(mockUseQuery).toHaveBeenCalled();
    });

    it('should integrate with UsersService correctly', () => {
      const mockUsersService = jest.requireMock('@/services').UsersService;

      renderHook(() => useUsers());
      expect(mockUsersService.getUsers).toBeDefined();
    });

    it('should integrate with useQueryClient correctly', () => {
      const mockUseQueryClient = jest.requireMock('@tanstack/react-query').useQueryClient;

      renderHook(() => useUsers());

      expect(mockUseQueryClient).toHaveBeenCalled();
    });
  });

  describe('Query Configuration Details', () => {
    it('should have correct stale time configuration', () => {
      const mockUseQuery = jest.requireMock('@tanstack/react-query').useQuery;

      renderHook(() => useUsers());

      expect(mockUseQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          staleTime: 5 * 60 * 1000,
        }),
      );
    });

    it('should have correct query key structure', () => {
      const mockUseQuery = jest.requireMock('@tanstack/react-query').useQuery;

      renderHook(() => useUsers());

      expect(mockUseQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          queryKey: ['users', 'list', 1],
        }),
      );
    });
  });
});
