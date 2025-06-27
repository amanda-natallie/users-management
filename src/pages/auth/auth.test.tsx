import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import AuthPage from './auth';

// Mock the dependencies
jest.mock('./components', () => ({
  SignInForm: ({
    onSwitchToSignUp,
    isFlipping,
  }: {
    onSwitchToSignUp: () => void;
    isFlipping?: boolean;
  }) => (
    <div data-testid="sign-in-form">
      <h2>Sign In Form</h2>
      <button data-testid="switch-to-signup" onClick={onSwitchToSignUp}>
        Switch to Sign Up
      </button>
      <div data-testid="signin-flipping-state">{isFlipping ? 'flipping' : 'not-flipping'}</div>
    </div>
  ),
  SignUpForm: ({
    onSwitchToSignIn,
    isFlipping,
  }: {
    onSwitchToSignIn: () => void;
    isFlipping?: boolean;
  }) => (
    <div data-testid="sign-up-form">
      <h2>Sign Up Form</h2>
      <button data-testid="switch-to-signin" onClick={onSwitchToSignIn}>
        Switch to Sign In
      </button>
      <div data-testid="signup-flipping-state">{isFlipping ? 'flipping' : 'not-flipping'}</div>
    </div>
  ),
}));

jest.mock('@/components/layout', () => ({
  MainLayout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="main-layout">{children}</div>
  ),
}));

describe('AuthPage', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('Initial Rendering', () => {
    it('renders SignUpForm by default', () => {
      render(<AuthPage />);

      expect(screen.getByTestId('sign-up-form')).toBeInTheDocument();
      expect(screen.queryByTestId('sign-in-form')).not.toBeInTheDocument();
      expect(screen.getByText('Sign Up Form')).toBeInTheDocument();
    });

    it('renders within MainLayout', () => {
      render(<AuthPage />);

      expect(screen.getByTestId('main-layout')).toBeInTheDocument();
      expect(screen.getByTestId('sign-up-form')).toBeInTheDocument();
    });

    it('initializes with correct default state', () => {
      render(<AuthPage />);

      // Should show SignUpForm initially
      expect(screen.getByTestId('signup-flipping-state')).toHaveTextContent('not-flipping');
    });
  });

  describe('Form Switching Functionality', () => {
    it('switches from SignUpForm to SignInForm when switch button is clicked', async () => {
      render(<AuthPage />);

      // Initially shows SignUpForm
      expect(screen.getByTestId('sign-up-form')).toBeInTheDocument();
      expect(screen.queryByTestId('sign-in-form')).not.toBeInTheDocument();

      // Click switch button
      await act(async () => {
        const switchButton = screen.getByTestId('switch-to-signin');
        fireEvent.click(switchButton);
      });

      // Should show SignInForm after switch
      await waitFor(() => {
        expect(screen.getByTestId('sign-in-form')).toBeInTheDocument();
        expect(screen.queryByTestId('sign-up-form')).not.toBeInTheDocument();
        expect(screen.getByText('Sign In Form')).toBeInTheDocument();
      });
    });

    it('switches from SignInForm to SignUpForm when switch button is clicked', async () => {
      render(<AuthPage />);

      // First switch to SignInForm
      await act(async () => {
        const switchToSignInButton = screen.getByTestId('switch-to-signin');
        fireEvent.click(switchToSignInButton);
      });

      // Should show SignInForm
      await waitFor(() => {
        expect(screen.getByTestId('sign-in-form')).toBeInTheDocument();
      });

      // Now switch back to SignUpForm
      await act(async () => {
        const switchToSignUpButton = screen.getByTestId('switch-to-signup');
        fireEvent.click(switchToSignUpButton);
      });

      // Should show SignUpForm again
      await waitFor(() => {
        expect(screen.getByTestId('sign-up-form')).toBeInTheDocument();
        expect(screen.queryByTestId('sign-in-form')).not.toBeInTheDocument();
      });
    });
  });

  describe('Flipping Animation State', () => {
    it('sets flipping state to true when switching forms', async () => {
      render(<AuthPage />);

      // Initially not flipping
      expect(screen.getByTestId('signup-flipping-state')).toHaveTextContent('not-flipping');

      // Click switch button
      await act(async () => {
        const switchButton = screen.getByTestId('switch-to-signin');
        fireEvent.click(switchButton);
      });

      // Should be flipping immediately after click
      await waitFor(() => {
        expect(screen.getByTestId('signin-flipping-state')).toHaveTextContent('flipping');
      });
    });

    it('resets flipping state to false after timeout', async () => {
      render(<AuthPage />);

      // Click switch button
      const switchButton = screen.getByTestId('switch-to-signin');
      await act(async () => {
        fireEvent.click(switchButton);
      });

      // Should be flipping
      await waitFor(() => {
        expect(screen.getByTestId('signin-flipping-state')).toHaveTextContent('flipping');
      });

      // Fast-forward time by 150ms
      await act(async () => {
        jest.advanceTimersByTime(150);
      });

      // Should not be flipping anymore
      await waitFor(() => {
        expect(screen.getByTestId('signin-flipping-state')).toHaveTextContent('not-flipping');
      });
    });

    it('handles multiple rapid switches correctly', async () => {
      render(<AuthPage />);

      // First switch
      const switchToSignInButton = screen.getByTestId('switch-to-signin');
      await act(async () => {
        fireEvent.click(switchToSignInButton);
      });

      // Should be flipping
      await waitFor(() => {
        expect(screen.getByTestId('signin-flipping-state')).toHaveTextContent('flipping');
      });

      // Fast-forward time to complete first switch
      await act(async () => {
        jest.advanceTimersByTime(150);
      });

      // Should not be flipping
      await waitFor(() => {
        expect(screen.getByTestId('signin-flipping-state')).toHaveTextContent('not-flipping');
      });

      // Second switch
      const switchToSignUpButton = screen.getByTestId('switch-to-signup');
      await act(async () => {
        fireEvent.click(switchToSignUpButton);
      });

      // Should be flipping again
      await waitFor(() => {
        expect(screen.getByTestId('signup-flipping-state')).toHaveTextContent('flipping');
      });

      // Fast-forward time to complete second switch
      await act(async () => {
        jest.advanceTimersByTime(150);
      });

      // Should not be flipping anymore
      await waitFor(() => {
        expect(screen.getByTestId('signup-flipping-state')).toHaveTextContent('not-flipping');
      });
    });
  });

  describe('State Management', () => {
    it('updates isSignUp state correctly', async () => {
      render(<AuthPage />);

      // Initially should be SignUpForm
      expect(screen.getByTestId('sign-up-form')).toBeInTheDocument();

      // Switch to SignInForm
      const switchToSignInButton = screen.getByTestId('switch-to-signin');
      await act(async () => {
        fireEvent.click(switchToSignInButton);
      });

      // Complete the animation
      await act(async () => {
        jest.advanceTimersByTime(150);
      });

      // Should now show SignInForm
      await waitFor(() => {
        expect(screen.getByTestId('sign-in-form')).toBeInTheDocument();
        expect(screen.queryByTestId('sign-up-form')).not.toBeInTheDocument();
      });
    });

    it('manages isFlipping state correctly', async () => {
      render(<AuthPage />);

      // Initially not flipping
      expect(screen.getByTestId('signup-flipping-state')).toHaveTextContent('not-flipping');

      // Start flip
      const switchButton = screen.getByTestId('switch-to-signin');
      await act(async () => {
        fireEvent.click(switchButton);
      });

      // Should be flipping
      await waitFor(() => {
        expect(screen.getByTestId('signin-flipping-state')).toHaveTextContent('flipping');
      });

      // Complete flip
      await act(async () => {
        jest.advanceTimersByTime(150);
      });

      // Should not be flipping
      await waitFor(() => {
        expect(screen.getByTestId('signin-flipping-state')).toHaveTextContent('not-flipping');
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles rapid consecutive clicks without breaking', async () => {
      render(<AuthPage />);

      const switchToSignInButton = screen.getByTestId('switch-to-signin');

      // Multiple rapid clicks
      await act(async () => {
        fireEvent.click(switchToSignInButton);
        fireEvent.click(switchToSignInButton);
        fireEvent.click(switchToSignInButton);
      });

      // Should still be flipping
      await waitFor(() => {
        expect(screen.getByTestId('signin-flipping-state')).toHaveTextContent('flipping');
      });

      // Complete the animation
      await act(async () => {
        jest.advanceTimersByTime(150);
      });

      // Should show SignInForm
      await waitFor(() => {
        expect(screen.getByTestId('sign-in-form')).toBeInTheDocument();
      });
    });

    it('maintains correct state after animation completes', async () => {
      render(<AuthPage />);

      // Switch to SignInForm
      const switchToSignInButton = screen.getByTestId('switch-to-signin');
      await act(async () => {
        fireEvent.click(switchToSignInButton);
      });

      // Complete animation
      await act(async () => {
        jest.advanceTimersByTime(150);
      });

      // Should be in SignInForm state
      await waitFor(() => {
        expect(screen.getByTestId('sign-in-form')).toBeInTheDocument();
        expect(screen.getByTestId('signin-flipping-state')).toHaveTextContent('not-flipping');
      });

      // Should be able to switch back
      const switchToSignUpButton = screen.getByTestId('switch-to-signup');
      await act(async () => {
        fireEvent.click(switchToSignUpButton);
      });

      // Should start flipping again
      await waitFor(() => {
        expect(screen.getByTestId('signup-flipping-state')).toHaveTextContent('flipping');
      });
    });
  });
});
