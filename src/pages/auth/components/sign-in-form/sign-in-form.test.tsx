import { signInSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { fireEvent, render, screen } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import SignInForm from './sign-in-form';

const mockMutateAsync = jest.fn().mockResolvedValue({});
jest.mock('@/hooks', () => ({
  useLogin: () => ({ mutateAsync: mockMutateAsync, isPending: false }),
}));

jest.mock('react-hook-form', () => ({
  useForm: jest.fn(),
}));

jest.mock('@hookform/resolvers/zod', () => ({
  zodResolver: jest.fn(),
}));

jest.mock('@/schemas', () => ({
  signInSchema: {},
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
  }) => {
    const inputType = type === 'password' && showPassword ? 'text' : type;

    return (
      <div data-testid={`field-${name}`}>
        <label htmlFor={id}>{label}</label>
        <input data-testid={`input-${name}`} id={id} type={inputType} placeholder={placeholder} />
        {error && <div data-testid={`error-${name}`}>{error}</div>}
        {showPasswordToggle && (
          <button data-testid={`toggle-password-${name}`} type="button" onClick={onTogglePassword}>
            {showPassword ? 'Hide' : 'Show'}
          </button>
        )}
      </div>
    );
  },
}));

const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});

describe('SignInForm', () => {
  const mockOnSwitchToSignUp = jest.fn();
  const mockHandleSubmit = jest.fn();
  const mockControl = {};

  const defaultUseFormReturn = {
    control: mockControl,
    handleSubmit: mockHandleSubmit,
    formState: {
      errors: {},
      isValid: false,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useForm as jest.Mock).mockReturnValue(defaultUseFormReturn);
    (zodResolver as jest.Mock).mockReturnValue(jest.fn());
    mockHandleSubmit.mockImplementation(callback => (e: { preventDefault: () => void }) => {
      e.preventDefault();
      callback({ email: 'test@example.com', password: 'password123' });
    });
    mockMutateAsync.mockClear();
  });

  afterEach(() => {
    mockConsoleLog.mockClear();
  });

  afterAll(() => {
    mockConsoleLog.mockRestore();
  });

  describe('Component Rendering', () => {
    it('renders with default props', () => {
      render(<SignInForm onSwitchToSignUp={mockOnSwitchToSignUp} />);

      expect(screen.getByTestId('auth-layout')).toBeInTheDocument();
      expect(screen.getByText('Welcome back')).toBeInTheDocument();
      expect(
        screen.getByText('Enter your credentials to sign in to your account'),
      ).toBeInTheDocument();
      expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
      expect(screen.getByText('Sign up')).toBeInTheDocument();
      expect(screen.getByTestId('flipping-state')).toHaveTextContent('not-flipping');
    });

    it('renders with isFlipping prop set to true', () => {
      render(<SignInForm onSwitchToSignUp={mockOnSwitchToSignUp} isFlipping={true} />);

      expect(screen.getByTestId('flipping-state')).toHaveTextContent('flipping');
    });

    it('renders with isFlipping prop set to false explicitly', () => {
      render(<SignInForm onSwitchToSignUp={mockOnSwitchToSignUp} isFlipping={false} />);

      expect(screen.getByTestId('flipping-state')).toHaveTextContent('not-flipping');
    });
  });

  describe('Form Fields', () => {
    it('renders email field with correct props', () => {
      render(<SignInForm onSwitchToSignUp={mockOnSwitchToSignUp} />);

      const emailField = screen.getByTestId('field-email');
      expect(emailField).toBeInTheDocument();

      const emailInput = screen.getByTestId('input-email');
      expect(emailInput).toHaveAttribute('id', 'signin-email');
      expect(emailInput).toHaveAttribute('type', 'email');
      expect(emailInput).toHaveAttribute('placeholder', 'm@example.com');

      expect(screen.getByLabelText('Email')).toBeInTheDocument();
    });

    it('renders password field with correct props', () => {
      render(<SignInForm onSwitchToSignUp={mockOnSwitchToSignUp} />);

      const passwordField = screen.getByTestId('field-password');
      expect(passwordField).toBeInTheDocument();

      const passwordInput = screen.getByTestId('input-password');
      expect(passwordInput).toHaveAttribute('id', 'signin-password');
      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(passwordInput).toHaveAttribute('placeholder', 'Enter your password');

      expect(screen.getByLabelText('Password')).toBeInTheDocument();
      expect(screen.getByTestId('toggle-password-password')).toBeInTheDocument();
    });
  });

  describe('Password Toggle Functionality', () => {
    it('toggles password visibility when toggle button is clicked', () => {
      render(<SignInForm onSwitchToSignUp={mockOnSwitchToSignUp} />);

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

    it('multiple clicks on password toggle work correctly', () => {
      render(<SignInForm onSwitchToSignUp={mockOnSwitchToSignUp} />);

      const passwordInput = screen.getByTestId('input-password');
      const toggleButton = screen.getByTestId('toggle-password-password');

      fireEvent.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'text');

      fireEvent.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'password');

      fireEvent.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'text');
    });
  });

  describe('Form Validation and State', () => {
    it('displays form as invalid when isValid is false', () => {
      (useForm as jest.Mock).mockReturnValue({
        ...defaultUseFormReturn,
        formState: { errors: {}, isValid: false },
      });

      render(<SignInForm onSwitchToSignUp={mockOnSwitchToSignUp} />);

      expect(screen.getByTestId('form-valid')).toHaveTextContent('invalid');
    });

    it('displays form as valid when isValid is true', () => {
      (useForm as jest.Mock).mockReturnValue({
        ...defaultUseFormReturn,
        formState: { errors: {}, isValid: true },
      });

      render(<SignInForm onSwitchToSignUp={mockOnSwitchToSignUp} />);

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

      render(<SignInForm onSwitchToSignUp={mockOnSwitchToSignUp} />);

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

      render(<SignInForm onSwitchToSignUp={mockOnSwitchToSignUp} />);

      expect(screen.getByTestId('error-password')).toHaveTextContent('Password is too short');
    });

    it('displays multiple errors simultaneously', () => {
      (useForm as jest.Mock).mockReturnValue({
        ...defaultUseFormReturn,
        formState: {
          errors: {
            email: { message: 'Invalid email format' },
            password: { message: 'Password is required' },
          },
          isValid: false,
        },
      });

      render(<SignInForm onSwitchToSignUp={mockOnSwitchToSignUp} />);

      expect(screen.getByTestId('error-email')).toHaveTextContent('Invalid email format');
      expect(screen.getByTestId('error-password')).toHaveTextContent('Password is required');
    });
  });

  describe('Form Submission', () => {
    it('calls handleSubmit when form is submitted', () => {
      render(<SignInForm onSwitchToSignUp={mockOnSwitchToSignUp} />);

      const form = screen.getByTestId('form-wrapper');
      fireEvent.submit(form);

      expect(mockHandleSubmit).toHaveBeenCalled();
    });

    it('calls loginMutation.mutateAsync with form data when submitted', async () => {
      render(<SignInForm onSwitchToSignUp={mockOnSwitchToSignUp} />);

      const form = screen.getByTestId('form-wrapper');
      fireEvent.submit(form);

      expect(mockMutateAsync).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('calls loginMutation.mutateAsync with custom data', async () => {
      const customFormData = { email: 'custom@test.com', password: 'custompass' };
      mockHandleSubmit.mockImplementation(callback => (e: React.FormEvent) => {
        e.preventDefault();
        callback(customFormData);
      });

      render(<SignInForm onSwitchToSignUp={mockOnSwitchToSignUp} />);

      const form = screen.getByTestId('form-wrapper');
      fireEvent.submit(form);

      expect(mockMutateAsync).toHaveBeenCalledWith(customFormData);
    });
  });

  describe('Switch to Sign Up', () => {
    it('calls onSwitchToSignUp when switch button is clicked', () => {
      render(<SignInForm onSwitchToSignUp={mockOnSwitchToSignUp} />);

      const switchButton = screen.getByTestId('switch-button');
      fireEvent.click(switchButton);

      expect(mockOnSwitchToSignUp).toHaveBeenCalledTimes(1);
    });

    it('calls onSwitchToSignUp multiple times when clicked multiple times', () => {
      render(<SignInForm onSwitchToSignUp={mockOnSwitchToSignUp} />);

      const switchButton = screen.getByTestId('switch-button');
      fireEvent.click(switchButton);
      fireEvent.click(switchButton);
      fireEvent.click(switchButton);

      expect(mockOnSwitchToSignUp).toHaveBeenCalledTimes(3);
    });
  });

  describe('useForm Configuration', () => {
    it('configures useForm with correct parameters', () => {
      const mockZodResolver = jest.fn();
      (zodResolver as jest.Mock).mockReturnValue(mockZodResolver);

      render(<SignInForm onSwitchToSignUp={mockOnSwitchToSignUp} />);

      expect(useForm).toHaveBeenCalledWith({
        resolver: mockZodResolver,
        mode: 'onChange',
        defaultValues: {
          email: '',
          password: '',
        },
      });
    });

    it('uses zodResolver with signInSchema', () => {
      render(<SignInForm onSwitchToSignUp={mockOnSwitchToSignUp} />);

      expect(zodResolver).toHaveBeenCalledWith(signInSchema);
    });
  });

  describe('Component Props and Attributes', () => {
    it('passes correct props to FormWrapper', () => {
      render(<SignInForm onSwitchToSignUp={mockOnSwitchToSignUp} />);

      expect(screen.getByTestId('submit-text')).toHaveTextContent('Sign In');
    });

    it('passes control object to form fields', () => {
      render(<SignInForm onSwitchToSignUp={mockOnSwitchToSignUp} />);

      expect(screen.getByTestId('field-email')).toBeInTheDocument();
      expect(screen.getByTestId('field-password')).toBeInTheDocument();
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('handles undefined errors gracefully', () => {
      (useForm as jest.Mock).mockReturnValue({
        ...defaultUseFormReturn,
        formState: {
          errors: { email: undefined, password: undefined },
          isValid: true,
        },
      });

      render(<SignInForm onSwitchToSignUp={mockOnSwitchToSignUp} />);

      expect(screen.queryByTestId('error-email')).not.toBeInTheDocument();
      expect(screen.queryByTestId('error-password')).not.toBeInTheDocument();
    });

    it('handles empty errors object', () => {
      (useForm as jest.Mock).mockReturnValue({
        ...defaultUseFormReturn,
        formState: { errors: {}, isValid: true },
      });

      render(<SignInForm onSwitchToSignUp={mockOnSwitchToSignUp} />);

      expect(screen.queryByTestId('error-email')).not.toBeInTheDocument();
      expect(screen.queryByTestId('error-password')).not.toBeInTheDocument();
    });
  });
});
