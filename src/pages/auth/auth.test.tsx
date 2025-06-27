import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import AuthPage from './auth';
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
    it('renders SignInForm by default', () => {
      render(<AuthPage />);

      expect(screen.getByTestId('sign-in-form')).toBeInTheDocument();
      expect(screen.queryByTestId('sign-up-form')).not.toBeInTheDocument();
      expect(screen.getByText('Sign In Form')).toBeInTheDocument();
    });

    it('renders within MainLayout', () => {
      render(<AuthPage />);

      expect(screen.getByTestId('main-layout')).toBeInTheDocument();
      expect(screen.getByTestId('sign-in-form')).toBeInTheDocument();
    });

    it('initializes with correct default state', () => {
      render(<AuthPage />);

      expect(screen.getByTestId('signin-flipping-state')).toHaveTextContent('not-flipping');
    });
  });

  describe('Form Switching Functionality', () => {
    it('switches from SignInForm to SignUpForm when switch button is clicked', async () => {
      render(<AuthPage />);

      expect(screen.getByTestId('sign-in-form')).toBeInTheDocument();
      expect(screen.queryByTestId('sign-up-form')).not.toBeInTheDocument();

      await act(async () => {
        const switchButton = screen.getByTestId('switch-to-signup');
        fireEvent.click(switchButton);
      });

      await waitFor(() => {
        expect(screen.getByTestId('sign-up-form')).toBeInTheDocument();
        expect(screen.queryByTestId('sign-in-form')).not.toBeInTheDocument();
        expect(screen.getByText('Sign Up Form')).toBeInTheDocument();
      });
    });

    it('switches from SignUpForm to SignInForm when switch button is clicked', async () => {
      render(<AuthPage />);

      await act(async () => {
        const switchToSignUpButton = screen.getByTestId('switch-to-signup');
        fireEvent.click(switchToSignUpButton);
      });

      await waitFor(() => {
        expect(screen.getByTestId('sign-up-form')).toBeInTheDocument();
      });

      await act(async () => {
        const switchToSignInButton = screen.getByTestId('switch-to-signin');
        fireEvent.click(switchToSignInButton);
      });

      await waitFor(() => {
        expect(screen.getByTestId('sign-in-form')).toBeInTheDocument();
        expect(screen.queryByTestId('sign-up-form')).not.toBeInTheDocument();
      });
    });
  });

  describe('Flipping Animation State', () => {
    it('sets flipping state to true when switching forms', async () => {
      render(<AuthPage />);

      expect(screen.getByTestId('signin-flipping-state')).toHaveTextContent('not-flipping');

      await act(async () => {
        const switchButton = screen.getByTestId('switch-to-signup');
        fireEvent.click(switchButton);
      });

      await waitFor(() => {
        expect(screen.getByTestId('signin-flipping-state')).toHaveTextContent('flipping');
      });
    });

    it('resets flipping state to false after timeout', async () => {
      render(<AuthPage />);

      const switchButton = screen.getByTestId('switch-to-signup');
      await act(async () => {
        fireEvent.click(switchButton);
      });

      await waitFor(() => {
        expect(screen.getByTestId('signup-flipping-state')).toHaveTextContent('flipping');
      });

      await act(async () => {
        jest.advanceTimersByTime(150);
      });

      await waitFor(() => {
        expect(screen.getByTestId('signup-flipping-state')).toHaveTextContent('not-flipping');
      });
    });

    it('handles multiple rapid switches correctly', async () => {
      render(<AuthPage />);

      const switchToSignUpButton = screen.getByTestId('switch-to-signup');
      await act(async () => {
        fireEvent.click(switchToSignUpButton);
      });

      await waitFor(() => {
        expect(screen.getByTestId('signup-flipping-state')).toHaveTextContent('flipping');
      });

      await act(async () => {
        jest.advanceTimersByTime(150);
      });

      await waitFor(() => {
        expect(screen.getByTestId('signup-flipping-state')).toHaveTextContent('not-flipping');
      });

      const switchToSignInButton = screen.getByTestId('switch-to-signin');
      await act(async () => {
        fireEvent.click(switchToSignInButton);
      });

      await waitFor(() => {
        expect(screen.getByTestId('signin-flipping-state')).toHaveTextContent('flipping');
      });

      await act(async () => {
        jest.advanceTimersByTime(150);
      });

      await waitFor(() => {
        expect(screen.getByTestId('signin-flipping-state')).toHaveTextContent('not-flipping');
      });
    });
  });

  describe('State Management', () => {
    it('updates isSignIn state correctly', async () => {
      render(<AuthPage />);

      expect(screen.getByTestId('sign-in-form')).toBeInTheDocument();

      const switchToSignUpButton = screen.getByTestId('switch-to-signup');
      await act(async () => {
        fireEvent.click(switchToSignUpButton);
      });

      await act(async () => {
        jest.advanceTimersByTime(150);
      });

      await waitFor(() => {
        expect(screen.getByTestId('sign-up-form')).toBeInTheDocument();
        expect(screen.queryByTestId('sign-in-form')).not.toBeInTheDocument();
      });
    });

    it('manages isFlipping state correctly', async () => {
      render(<AuthPage />);

      expect(screen.getByTestId('signin-flipping-state')).toHaveTextContent('not-flipping');

      const switchButton = screen.getByTestId('switch-to-signup');
      await act(async () => {
        fireEvent.click(switchButton);
      });

      await waitFor(() => {
        expect(screen.getByTestId('signup-flipping-state')).toHaveTextContent('flipping');
      });

      await act(async () => {
        jest.advanceTimersByTime(150);
      });

      await waitFor(() => {
        expect(screen.getByTestId('signup-flipping-state')).toHaveTextContent('not-flipping');
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles rapid consecutive clicks without breaking', async () => {
      render(<AuthPage />);

      const switchToSignUpButton = screen.getByTestId('switch-to-signup');

      await act(async () => {
        fireEvent.click(switchToSignUpButton);
        fireEvent.click(switchToSignUpButton);
        fireEvent.click(switchToSignUpButton);
      });

      await waitFor(() => {
        expect(screen.getByTestId('signup-flipping-state')).toHaveTextContent('flipping');
      });

      await act(async () => {
        jest.advanceTimersByTime(150);
      });

      await waitFor(() => {
        expect(screen.getByTestId('sign-up-form')).toBeInTheDocument();
      });
    });

    it('maintains correct state after animation completes', async () => {
      render(<AuthPage />);

      const switchToSignUpButton = screen.getByTestId('switch-to-signup');
      await act(async () => {
        fireEvent.click(switchToSignUpButton);
      });

      await act(async () => {
        jest.advanceTimersByTime(150);
      });

      await waitFor(() => {
        expect(screen.getByTestId('sign-up-form')).toBeInTheDocument();
        expect(screen.getByTestId('signup-flipping-state')).toHaveTextContent('not-flipping');
      });

      const switchToSignInButton = screen.getByTestId('switch-to-signin');
      await act(async () => {
        fireEvent.click(switchToSignInButton);
      });

      await waitFor(() => {
        expect(screen.getByTestId('signin-flipping-state')).toHaveTextContent('flipping');
      });
    });
  });
});
