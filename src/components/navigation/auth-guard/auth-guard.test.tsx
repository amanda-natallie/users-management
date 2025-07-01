import { render, screen } from '@testing-library/react';
import { useNavigate } from 'react-router';
import AuthGuard from './auth-guard';

jest.mock('react-router', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('@/utils/auth', () => ({
  authUtils: {
    isAuthenticated: jest.fn(),
  },
}));

jest.mock('@/components/layout', () => ({
  FullscreenLoader: ({ message }: { message: string }) => (
    <div data-testid="fullscreen-loader">{message}</div>
  ),
}));

describe('AuthGuard', () => {
  const mockNavigate = jest.fn();
  const mockAuthUtils = {
    isAuthenticated: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

    const authModule = jest.requireMock('@/utils/auth');
    authModule.authUtils.isAuthenticated = mockAuthUtils.isAuthenticated;
  });

  describe('Authentication Check', () => {
    it('should render children when user is authenticated', () => {
      mockAuthUtils.isAuthenticated.mockReturnValue(true);

      render(
        <AuthGuard>
          <div data-testid="protected-content">Protected Content</div>
        </AuthGuard>,
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
      expect(screen.getByTestId('auth-guard')).toBeInTheDocument();
    });

    it('should show loading screen when user is not authenticated', () => {
      mockAuthUtils.isAuthenticated.mockReturnValue(false);

      render(
        <AuthGuard>
          <div data-testid="protected-content">Protected Content</div>
        </AuthGuard>,
      );

      expect(screen.getByTestId('fullscreen-loader')).toBeInTheDocument();
      expect(screen.getByText('Checking authentication...')).toBeInTheDocument();
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });

    it('should navigate to auth page when user is not authenticated', () => {
      mockAuthUtils.isAuthenticated.mockReturnValue(false);

      render(
        <AuthGuard>
          <div data-testid="protected-content">Protected Content</div>
        </AuthGuard>,
      );

      expect(mockNavigate).toHaveBeenCalledWith('/auth', { replace: true });
    });

    it('should not navigate when user is authenticated', () => {
      mockAuthUtils.isAuthenticated.mockReturnValue(true);

      render(
        <AuthGuard>
          <div data-testid="protected-content">Protected Content</div>
        </AuthGuard>,
      );

      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe('Component Structure', () => {
    it('should render auth-guard wrapper with children', () => {
      mockAuthUtils.isAuthenticated.mockReturnValue(true);

      render(
        <AuthGuard>
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
        </AuthGuard>,
      );

      expect(screen.getByTestId('auth-guard')).toBeInTheDocument();
      expect(screen.getByTestId('child-1')).toBeInTheDocument();
      expect(screen.getByTestId('child-2')).toBeInTheDocument();
    });

    it('should handle empty children', () => {
      mockAuthUtils.isAuthenticated.mockReturnValue(true);

      render(<AuthGuard>{null}</AuthGuard>);

      expect(screen.getByTestId('auth-guard')).toBeInTheDocument();
    });

    it('should handle string children', () => {
      mockAuthUtils.isAuthenticated.mockReturnValue(true);

      render(<AuthGuard>String Child</AuthGuard>);

      expect(screen.getByTestId('auth-guard')).toBeInTheDocument();
      expect(screen.getByText('String Child')).toBeInTheDocument();
    });
  });

  describe('Navigation Behavior', () => {
    it('should call navigate with correct parameters', () => {
      mockAuthUtils.isAuthenticated.mockReturnValue(false);

      render(<AuthGuard>Content</AuthGuard>);

      expect(mockNavigate).toHaveBeenCalledWith('/auth', { replace: true });
      expect(mockNavigate).toHaveBeenCalledTimes(1);
    });

    it('should not call navigate multiple times for same state', () => {
      mockAuthUtils.isAuthenticated.mockReturnValue(false);

      const { rerender } = render(<AuthGuard>Content</AuthGuard>);

      rerender(<AuthGuard>Content</AuthGuard>);

      expect(mockNavigate).toHaveBeenCalledTimes(1);
    });
  });

  describe('Loading State', () => {
    it('should show correct loading message', () => {
      mockAuthUtils.isAuthenticated.mockReturnValue(false);

      render(<AuthGuard>Content</AuthGuard>);

      expect(screen.getByText('Checking authentication...')).toBeInTheDocument();
    });

    it('should render FullscreenLoader component', () => {
      mockAuthUtils.isAuthenticated.mockReturnValue(false);

      render(<AuthGuard>Content</AuthGuard>);

      expect(screen.getByTestId('fullscreen-loader')).toBeInTheDocument();
    });
  });

  describe('Authentication State Changes', () => {
    it('should handle authentication state change from false to true', () => {
      mockAuthUtils.isAuthenticated.mockReturnValue(false);
      const { rerender } = render(<AuthGuard>Content</AuthGuard>);

      expect(screen.getByTestId('fullscreen-loader')).toBeInTheDocument();

      mockAuthUtils.isAuthenticated.mockReturnValue(true);
      rerender(<AuthGuard>Content</AuthGuard>);

      expect(screen.getByTestId('auth-guard')).toBeInTheDocument();
      expect(screen.queryByTestId('fullscreen-loader')).not.toBeInTheDocument();
    });

    it('should handle authentication state change from true to false', () => {
      mockAuthUtils.isAuthenticated.mockReturnValue(true);
      const { rerender } = render(<AuthGuard>Content</AuthGuard>);

      expect(screen.getByTestId('auth-guard')).toBeInTheDocument();

      mockAuthUtils.isAuthenticated.mockReturnValue(false);
      rerender(<AuthGuard>Content</AuthGuard>);

      expect(screen.getByTestId('fullscreen-loader')).toBeInTheDocument();
      expect(screen.queryByTestId('auth-guard')).not.toBeInTheDocument();
    });
  });

  describe('Component Integration', () => {
    it('should integrate with auth utils correctly', () => {
      mockAuthUtils.isAuthenticated.mockReturnValue(true);

      render(<AuthGuard>Content</AuthGuard>);

      expect(mockAuthUtils.isAuthenticated).toHaveBeenCalled();
    });

    it('should integrate with react-router correctly', () => {
      mockAuthUtils.isAuthenticated.mockReturnValue(false);

      render(<AuthGuard>Content</AuthGuard>);

      expect(useNavigate).toHaveBeenCalled();
    });

    it('should integrate with layout components correctly', () => {
      mockAuthUtils.isAuthenticated.mockReturnValue(false);

      render(<AuthGuard>Content</AuthGuard>);

      expect(screen.getByTestId('fullscreen-loader')).toBeInTheDocument();
    });
  });
});
