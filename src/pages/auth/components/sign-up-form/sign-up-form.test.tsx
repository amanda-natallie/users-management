import { signUpSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { fireEvent, render, screen } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import SignUpForm from './sign-up-form';

const mockMutateAsync = jest.fn().mockResolvedValue({});
jest.mock('@/hooks', () => ({
  useRegister: () => ({ mutateAsync: mockMutateAsync, isPending: false }),
}));

jest.mock('react-hook-form', () => ({
  useForm: jest.fn(),
}));

jest.mock('@hookform/resolvers/zod', () => ({
  zodResolver: jest.fn(),
}));

jest.mock('@/schemas', () => ({
  signUpSchema: {},
}));

jest.mock('@/components/layout', () => ({
  AuthLayout: ({
    children,
    title,
    subtitle,
    switchText,
    switchButtonText,
    onSwitch,
    isFlipping,
  }: {
    children: React.ReactNode;
    title: string;
    subtitle: string;
    switchText: string;
    switchButtonText: string;
    onSwitch: () => void;
    isFlipping?: boolean;
  }) => (
    <div data-testid="auth-layout">
      <h1>{title}</h1>
      <p>{subtitle}</p>
      <p>{switchText}</p>
      <button data-testid="switch-button" onClick={onSwitch}>
        {switchButtonText}
      </button>
      <div data-testid="flipping-state">{isFlipping ? 'flipping' : 'not-flipping'}</div>
      {children}
    </div>
  ),
}));

jest.mock('@/components/forms', () => ({
  FormWrapper: ({
    children,
    onSubmit,
    submitText,
    isValid,
  }: {
    children: React.ReactNode;
    onSubmit: (e: React.FormEvent) => void;
    submitText: string;
    isValid: boolean;
  }) => (
    <form data-testid="form-wrapper" onSubmit={onSubmit}>
      {children}
      <button type="submit" data-testid="submit-text">
        {submitText}
      </button>
      <div data-testid="form-valid">{isValid ? 'valid' : 'invalid'}</div>
    </form>
  ),
  ControlledFormField: ({
    name,
    id,
    label,
    type,
    placeholder,
    error,
    showPasswordToggle,
    showPassword,
    onTogglePassword,
    onFocus,
    onBlur,
  }: {
    name: string;
    id: string;
    label: string;
    type?: string;
    placeholder?: string;
    error?: string;
    showPasswordToggle?: boolean;
    showPassword?: boolean;
    onTogglePassword?: () => void;
    onFocus?: () => void;
    onBlur?: () => void;
  }) => {
    const inputType = type === 'password' && showPassword ? 'text' : type;

    return (
      <div data-testid={`field-${name}`}>
        <label htmlFor={id}>{label}</label>
        <input
          data-testid={`input-${name}`}
          id={id}
          type={inputType}
          placeholder={placeholder}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        {error && <div data-testid={`error-${name}`}>{error}</div>}
        {showPasswordToggle && (
          <button data-testid={`toggle-password-${name}`} type="button" onClick={onTogglePassword}>
            {showPassword ? 'Hide' : 'Show'}
          </button>
        )}
      </div>
    );
  },
  PasswordStrength: ({ password, isVisible }: { password: string; isVisible: boolean }) => (
    <div data-testid="password-strength" data-visible={isVisible}>
      <div data-testid="password-value">{password}</div>
      <div data-testid="visibility-state">{isVisible ? 'visible' : 'hidden'}</div>
    </div>
  ),
}));

describe('SignUpForm', () => {
  const mockOnSwitchToSignIn = jest.fn();
  const mockHandleSubmit = jest.fn();
  const mockWatch = jest.fn();
  const mockControl = {};

  const defaultUseFormReturn = {
    control: mockControl,
    handleSubmit: mockHandleSubmit,
    watch: mockWatch,
    formState: {
      errors: {},
      isValid: false,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useForm as jest.Mock).mockReturnValue(defaultUseFormReturn);
    (zodResolver as jest.Mock).mockReturnValue(jest.fn());
    mockWatch.mockReturnValue('');
    mockHandleSubmit.mockImplementation(callback => (e: React.FormEvent) => {
      e.preventDefault();
      callback({
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      });
    });
  });

  describe('Component Rendering', () => {
    it('renders with default props', () => {
      render(<SignUpForm onSwitchToSignIn={mockOnSwitchToSignIn} />);

      expect(screen.getByTestId('auth-layout')).toBeInTheDocument();
      expect(screen.getByText('Create an account')).toBeInTheDocument();
      expect(screen.getByText('Enter your information to create your account')).toBeInTheDocument();
      expect(screen.getByText('Already have an account?')).toBeInTheDocument();
      expect(screen.getByText('Sign in')).toBeInTheDocument();
      expect(screen.getByTestId('flipping-state')).toHaveTextContent('not-flipping');
    });

    it('renders with isFlipping prop set to true', () => {
      render(<SignUpForm onSwitchToSignIn={mockOnSwitchToSignIn} isFlipping={true} />);

      expect(screen.getByTestId('flipping-state')).toHaveTextContent('flipping');
    });

    it('renders with isFlipping prop set to false explicitly', () => {
      render(<SignUpForm onSwitchToSignIn={mockOnSwitchToSignIn} isFlipping={false} />);

      expect(screen.getByTestId('flipping-state')).toHaveTextContent('not-flipping');
    });
  });

  describe('Form Fields', () => {
    it('renders email field with correct props', () => {
      render(<SignUpForm onSwitchToSignIn={mockOnSwitchToSignIn} />);

      const emailField = screen.getByTestId('field-email');
      expect(emailField).toBeInTheDocument();

      const emailInput = screen.getByTestId('input-email');
      expect(emailInput).toHaveAttribute('id', 'signup-email');
      expect(emailInput).toHaveAttribute('type', 'email');
      expect(emailInput).toHaveAttribute('placeholder', 'm@example.com');

      expect(screen.getByLabelText('Email')).toBeInTheDocument();
    });

    it('renders password field with correct props', () => {
      render(<SignUpForm onSwitchToSignIn={mockOnSwitchToSignIn} />);

      const passwordField = screen.getByTestId('field-password');
      expect(passwordField).toBeInTheDocument();

      const passwordInput = screen.getByTestId('input-password');
      expect(passwordInput).toHaveAttribute('id', 'signup-password');
      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(passwordInput).toHaveAttribute('placeholder', 'Create a password');

      expect(screen.getByLabelText('Password')).toBeInTheDocument();
      expect(screen.getByTestId('toggle-password-password')).toBeInTheDocument();
    });

    it('renders confirm password field with correct props', () => {
      render(<SignUpForm onSwitchToSignIn={mockOnSwitchToSignIn} />);

      const confirmPasswordField = screen.getByTestId('field-confirmPassword');
      expect(confirmPasswordField).toBeInTheDocument();

      const confirmPasswordInput = screen.getByTestId('input-confirmPassword');
      expect(confirmPasswordInput).toHaveAttribute('id', 'signup-confirm-password');
      expect(confirmPasswordInput).toHaveAttribute('type', 'password');
      expect(confirmPasswordInput).toHaveAttribute('placeholder', 'Confirm your password');

      expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
      expect(screen.getByTestId('toggle-password-confirmPassword')).toBeInTheDocument();
    });

    it('renders PasswordStrength component', () => {
      render(<SignUpForm onSwitchToSignIn={mockOnSwitchToSignIn} />);

      expect(screen.getByTestId('password-strength')).toBeInTheDocument();
      expect(screen.getByTestId('visibility-state')).toHaveTextContent('hidden');
    });
  });

  describe('Password Toggle Functionality', () => {
    it('toggles password visibility when password toggle button is clicked', () => {
      render(<SignUpForm onSwitchToSignIn={mockOnSwitchToSignIn} />);

      const passwordInput = screen.getByTestId('input-password');
      const toggleButton = screen.getByTestId('toggle-password-password');

      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(toggleButton).toHaveTextContent('Show');

      fireEvent.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'text');
      expect(toggleButton).toHaveTextContent('Hide');

      fireEvent.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(toggleButton).toHaveTextContent('Show');
    });

    it('toggles confirm password visibility when confirm password toggle button is clicked', () => {
      render(<SignUpForm onSwitchToSignIn={mockOnSwitchToSignIn} />);

      const confirmPasswordInput = screen.getByTestId('input-confirmPassword');
      const toggleButton = screen.getByTestId('toggle-password-confirmPassword');

      expect(confirmPasswordInput).toHaveAttribute('type', 'password');
      expect(toggleButton).toHaveTextContent('Show');

      fireEvent.click(toggleButton);
      expect(confirmPasswordInput).toHaveAttribute('type', 'text');
      expect(toggleButton).toHaveTextContent('Hide');

      fireEvent.click(toggleButton);
      expect(confirmPasswordInput).toHaveAttribute('type', 'password');
      expect(toggleButton).toHaveTextContent('Show');
    });

    it('handles multiple clicks on both password toggles independently', () => {
      render(<SignUpForm onSwitchToSignIn={mockOnSwitchToSignIn} />);

      const passwordInput = screen.getByTestId('input-password');
      const confirmPasswordInput = screen.getByTestId('input-confirmPassword');
      const passwordToggle = screen.getByTestId('toggle-password-password');
      const confirmPasswordToggle = screen.getByTestId('toggle-password-confirmPassword');

      fireEvent.click(passwordToggle);
      expect(passwordInput).toHaveAttribute('type', 'text');
      expect(confirmPasswordInput).toHaveAttribute('type', 'password');

      fireEvent.click(confirmPasswordToggle);
      expect(passwordInput).toHaveAttribute('type', 'text');
      expect(confirmPasswordInput).toHaveAttribute('type', 'text');

      fireEvent.click(passwordToggle);
      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(confirmPasswordInput).toHaveAttribute('type', 'text');
    });
  });

  describe('Password Focus and PasswordStrength Integration', () => {
    it('shows password strength when password field is focused', () => {
      render(<SignUpForm onSwitchToSignIn={mockOnSwitchToSignIn} />);

      const passwordInput = screen.getByTestId('input-password');
      const visibilityState = screen.getByTestId('visibility-state');

      expect(visibilityState).toHaveTextContent('hidden');

      fireEvent.focus(passwordInput);
      expect(visibilityState).toHaveTextContent('visible');

      fireEvent.blur(passwordInput);
      expect(visibilityState).toHaveTextContent('hidden');
    });

    it('handles multiple focus and blur events correctly', () => {
      render(<SignUpForm onSwitchToSignIn={mockOnSwitchToSignIn} />);

      const passwordInput = screen.getByTestId('input-password');
      const visibilityState = screen.getByTestId('visibility-state');

      fireEvent.focus(passwordInput);
      expect(visibilityState).toHaveTextContent('visible');

      fireEvent.blur(passwordInput);
      expect(visibilityState).toHaveTextContent('hidden');

      fireEvent.focus(passwordInput);
      expect(visibilityState).toHaveTextContent('visible');

      fireEvent.blur(passwordInput);
      expect(visibilityState).toHaveTextContent('hidden');
    });

    it('passes watched password value to PasswordStrength component', () => {
      const testPassword = 'testPassword123';
      mockWatch.mockReturnValue(testPassword);

      render(<SignUpForm onSwitchToSignIn={mockOnSwitchToSignIn} />);

      expect(screen.getByTestId('password-value')).toHaveTextContent(testPassword);
    });

    it('handles empty password value', () => {
      mockWatch.mockReturnValue('');

      render(<SignUpForm onSwitchToSignIn={mockOnSwitchToSignIn} />);

      expect(screen.getByTestId('password-value')).toHaveTextContent('');
    });

    it('handles different password values from watch', () => {
      const passwords = ['weak', 'medium123', 'StrongP@ssw0rd!'];

      passwords.forEach(password => {
        mockWatch.mockReturnValue(password);
        const { unmount } = render(<SignUpForm onSwitchToSignIn={mockOnSwitchToSignIn} />);
        expect(screen.getByTestId('password-value')).toHaveTextContent(password);
        unmount();
      });
    });
  });

  describe('Form Validation and State', () => {
    it('displays form as invalid when isValid is false', () => {
      (useForm as jest.Mock).mockReturnValue({
        ...defaultUseFormReturn,
        formState: { errors: {}, isValid: false },
      });

      render(<SignUpForm onSwitchToSignIn={mockOnSwitchToSignIn} />);

      expect(screen.getByTestId('form-valid')).toHaveTextContent('invalid');
    });

    it('displays form as valid when isValid is true', () => {
      (useForm as jest.Mock).mockReturnValue({
        ...defaultUseFormReturn,
        formState: { errors: {}, isValid: true },
      });

      render(<SignUpForm onSwitchToSignIn={mockOnSwitchToSignIn} />);

      expect(screen.getByTestId('form-valid')).toHaveTextContent('valid');
    });

    it('displays email error when present', () => {
      (useForm as jest.Mock).mockReturnValue({
        ...defaultUseFormReturn,
        formState: {
          errors: { email: { message: 'Email is required' } },
          isValid: false,
        },
      });

      render(<SignUpForm onSwitchToSignIn={mockOnSwitchToSignIn} />);

      expect(screen.getByTestId('error-email')).toHaveTextContent('Email is required');
    });

    it('displays password error when present', () => {
      (useForm as jest.Mock).mockReturnValue({
        ...defaultUseFormReturn,
        formState: {
          errors: { password: { message: 'Password is too short' } },
          isValid: false,
        },
      });

      render(<SignUpForm onSwitchToSignIn={mockOnSwitchToSignIn} />);

      expect(screen.getByTestId('error-password')).toHaveTextContent('Password is too short');
    });

    it('displays confirm password error when present', () => {
      (useForm as jest.Mock).mockReturnValue({
        ...defaultUseFormReturn,
        formState: {
          errors: { confirmPassword: { message: 'Passwords do not match' } },
          isValid: false,
        },
      });

      render(<SignUpForm onSwitchToSignIn={mockOnSwitchToSignIn} />);

      expect(screen.getByTestId('error-confirmPassword')).toHaveTextContent(
        'Passwords do not match',
      );
    });

    it('displays multiple errors simultaneously', () => {
      (useForm as jest.Mock).mockReturnValue({
        ...defaultUseFormReturn,
        formState: {
          errors: {
            email: { message: 'Invalid email format' },
            password: { message: 'Password is required' },
            confirmPassword: { message: 'Passwords do not match' },
          },
          isValid: false,
        },
      });

      render(<SignUpForm onSwitchToSignIn={mockOnSwitchToSignIn} />);

      expect(screen.getByTestId('error-email')).toHaveTextContent('Invalid email format');
      expect(screen.getByTestId('error-password')).toHaveTextContent('Password is required');
      expect(screen.getByTestId('error-confirmPassword')).toHaveTextContent(
        'Passwords do not match',
      );
    });
  });

  describe('Form Submission', () => {
    it('calls handleSubmit when form is submitted', () => {
      render(<SignUpForm onSwitchToSignIn={mockOnSwitchToSignIn} />);

      const form = screen.getByTestId('form-wrapper');
      fireEvent.submit(form);

      expect(mockHandleSubmit).toHaveBeenCalled();
    });

    it('logs form data when onSubmit is called', () => {
      render(<SignUpForm onSwitchToSignIn={mockOnSwitchToSignIn} />);

      const form = screen.getByTestId('form-wrapper');
      fireEvent.submit(form);

      expect(mockMutateAsync).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      });
    });

    it('handles different form data correctly', () => {
      const customFormData = {
        email: 'custom@test.com',
        password: 'custompass',
        confirmPassword: 'custompass',
      };
      mockHandleSubmit.mockImplementation(callback => (e: React.FormEvent) => {
        e.preventDefault();
        callback(customFormData);
      });

      render(<SignUpForm onSwitchToSignIn={mockOnSwitchToSignIn} />);

      const form = screen.getByTestId('form-wrapper');
      fireEvent.submit(form);

      expect(mockMutateAsync).toHaveBeenCalledWith(customFormData);
    });
  });

  describe('Switch to Sign In', () => {
    it('calls onSwitchToSignIn when switch button is clicked', () => {
      render(<SignUpForm onSwitchToSignIn={mockOnSwitchToSignIn} />);

      const switchButton = screen.getByTestId('switch-button');
      fireEvent.click(switchButton);

      expect(mockOnSwitchToSignIn).toHaveBeenCalledTimes(1);
    });

    it('calls onSwitchToSignIn multiple times when clicked multiple times', () => {
      render(<SignUpForm onSwitchToSignIn={mockOnSwitchToSignIn} />);

      const switchButton = screen.getByTestId('switch-button');
      fireEvent.click(switchButton);
      fireEvent.click(switchButton);
      fireEvent.click(switchButton);

      expect(mockOnSwitchToSignIn).toHaveBeenCalledTimes(3);
    });
  });

  describe('useForm Configuration and Watch Functionality', () => {
    it('configures useForm with correct parameters', () => {
      const mockZodResolver = jest.fn();
      (zodResolver as jest.Mock).mockReturnValue(mockZodResolver);

      render(<SignUpForm onSwitchToSignIn={mockOnSwitchToSignIn} />);

      expect(useForm).toHaveBeenCalledWith({
        resolver: mockZodResolver,
        mode: 'onChange',
        defaultValues: {
          email: '',
          password: '',
          confirmPassword: '',
        },
      });
    });

    it('uses zodResolver with signUpSchema', () => {
      render(<SignUpForm onSwitchToSignIn={mockOnSwitchToSignIn} />);

      expect(zodResolver).toHaveBeenCalledWith(signUpSchema);
    });

    it('calls watch with correct parameters', () => {
      render(<SignUpForm onSwitchToSignIn={mockOnSwitchToSignIn} />);

      expect(mockWatch).toHaveBeenCalledWith('password', '');
    });

    it('calls watch function during render', () => {
      mockWatch.mockReturnValue('watchedPassword');

      render(<SignUpForm onSwitchToSignIn={mockOnSwitchToSignIn} />);

      expect(mockWatch).toHaveBeenCalledWith('password', '');
      expect(screen.getByTestId('password-value')).toHaveTextContent('watchedPassword');
    });
  });

  describe('Component Props and Attributes', () => {
    it('passes correct props to FormWrapper', () => {
      render(<SignUpForm onSwitchToSignIn={mockOnSwitchToSignIn} />);

      expect(screen.getByTestId('submit-text')).toHaveTextContent('Create Account');
    });

    it('passes control object to form fields', () => {
      render(<SignUpForm onSwitchToSignIn={mockOnSwitchToSignIn} />);

      expect(screen.getByTestId('field-email')).toBeInTheDocument();
      expect(screen.getByTestId('field-password')).toBeInTheDocument();
      expect(screen.getByTestId('field-confirmPassword')).toBeInTheDocument();
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('handles undefined errors gracefully', () => {
      (useForm as jest.Mock).mockReturnValue({
        ...defaultUseFormReturn,
        formState: {
          errors: {
            email: undefined,
            password: undefined,
            confirmPassword: undefined,
          },
          isValid: true,
        },
      });

      render(<SignUpForm onSwitchToSignIn={mockOnSwitchToSignIn} />);

      expect(screen.queryByTestId('error-email')).not.toBeInTheDocument();
      expect(screen.queryByTestId('error-password')).not.toBeInTheDocument();
      expect(screen.queryByTestId('error-confirmPassword')).not.toBeInTheDocument();
    });

    it('handles empty errors object', () => {
      (useForm as jest.Mock).mockReturnValue({
        ...defaultUseFormReturn,
        formState: { errors: {}, isValid: true },
      });

      render(<SignUpForm onSwitchToSignIn={mockOnSwitchToSignIn} />);

      expect(screen.queryByTestId('error-email')).not.toBeInTheDocument();
      expect(screen.queryByTestId('error-password')).not.toBeInTheDocument();
      expect(screen.queryByTestId('error-confirmPassword')).not.toBeInTheDocument();
    });

    it('handles watch returning different values', () => {
      const testValues = ['', 'short', 'mediumLength', 'veryLongPasswordValue123!'];

      testValues.forEach(value => {
        mockWatch.mockReturnValue(value);
        const { unmount } = render(<SignUpForm onSwitchToSignIn={mockOnSwitchToSignIn} />);
        expect(screen.getByTestId('password-value')).toHaveTextContent(value);
        unmount();
      });
    });
  });

  describe('State Management', () => {
    it('manages password focus state independently of other interactions', () => {
      render(<SignUpForm onSwitchToSignIn={mockOnSwitchToSignIn} />);

      const passwordInput = screen.getByTestId('input-password');
      const confirmPasswordInput = screen.getByTestId('input-confirmPassword');
      const visibilityState = screen.getByTestId('visibility-state');

      fireEvent.focus(passwordInput);
      expect(visibilityState).toHaveTextContent('visible');

      fireEvent.focus(confirmPasswordInput);
      expect(visibilityState).toHaveTextContent('visible');

      fireEvent.blur(passwordInput);
      expect(visibilityState).toHaveTextContent('hidden');
    });

    it('maintains independent state for password and confirm password toggles', () => {
      render(<SignUpForm onSwitchToSignIn={mockOnSwitchToSignIn} />);

      const passwordToggle = screen.getByTestId('toggle-password-password');
      const confirmPasswordToggle = screen.getByTestId('toggle-password-confirmPassword');

      expect(passwordToggle).toHaveTextContent('Show');
      expect(confirmPasswordToggle).toHaveTextContent('Show');

      fireEvent.click(passwordToggle);
      expect(passwordToggle).toHaveTextContent('Hide');
      expect(confirmPasswordToggle).toHaveTextContent('Show');

      fireEvent.click(confirmPasswordToggle);
      expect(passwordToggle).toHaveTextContent('Hide');
      expect(confirmPasswordToggle).toHaveTextContent('Hide');
    });
  });
});
