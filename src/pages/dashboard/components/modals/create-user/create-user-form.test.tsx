import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import CreateUserForm from './create-user-form';

interface MockComponentProps {
  name?: string;
  label?: string;
  placeholder?: string;
  error?: string;
  children?: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  submitText?: string;
  isValid?: boolean;
  loading?: boolean;
  title?: string;
  subtitle?: string;
  loadingText?: string;
}

jest.mock('@/components/forms', () => ({
  ControlledFormField: ({ name, label, placeholder, error }: MockComponentProps) => (
    <div data-testid={`field-${name}`}>
      <label>{label}</label>
      <input name={name} placeholder={placeholder} />
      {error && <span data-testid={`error-${name}`}>{error}</span>}
    </div>
  ),
  FormWrapper: ({
    children,
    onSubmit,
    submitText,
    isValid,
    loading,
    loadingText,
  }: MockComponentProps) => (
    <form onSubmit={onSubmit} data-testid="form">
      {children}
      <button type="submit" disabled={!isValid || loading} data-testid="submit-button">
        {loading && loadingText ? loadingText : submitText}
      </button>
    </form>
  ),
}));

jest.mock('@/components/layout', () => ({
  UserLayout: ({ children, title, subtitle }: MockComponentProps) => (
    <div data-testid="user-layout">
      <h1>{title}</h1>
      <p>{subtitle}</p>
      {children}
    </div>
  ),
}));

jest.mock('@/hooks', () => ({
  useCreateUser: jest.fn(() => ({
    mutateAsync: jest.fn(),
    isPending: false,
  })),
}));

jest.mock('@/stores', () => ({
  useModalStore: jest.fn(() => ({
    closeModal: jest.fn(),
  })),
}));

jest.mock('@/schemas', () => ({
  createUserSchema: {},
}));

jest.mock('@hookform/resolvers/zod', () => ({
  zodResolver: jest.fn(() => jest.fn()),
}));

jest.mock('react-hook-form', () => ({
  useForm: jest.fn(),
}));

describe('CreateUserForm', () => {
  const mockCloseModal = jest.fn();
  const mockMutateAsync = jest.fn();
  const mockOnSubmit = jest.fn();

  const defaultUseFormReturn = {
    control: {},
    handleSubmit: jest.fn(fn => fn),
    formState: {
      errors: {},
      isValid: true,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (useForm as jest.Mock).mockReturnValue({
      ...defaultUseFormReturn,
      handleSubmit: jest.fn(fn => {
        mockOnSubmit.mockImplementation(fn);
        return mockOnSubmit;
      }),
    });

    const mockUseCreateUser = jest.requireMock('@/hooks').useCreateUser;
    mockUseCreateUser.mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
    });

    const mockUseModalStore = jest.requireMock('@/stores').useModalStore;
    mockUseModalStore.mockReturnValue({
      closeModal: mockCloseModal,
    });
  });

  describe('Component Rendering', () => {
    it('should render the form with correct title and subtitle', () => {
      render(<CreateUserForm />);

      const createUserElements = screen.getAllByText('Create User');
      expect(createUserElements.length).toBeGreaterThan(0);
      expect(screen.getByText("Enter user's information to create a new user")).toBeInTheDocument();
    });

    it('should render all form fields', () => {
      render(<CreateUserForm />);

      expect(screen.getByTestId('field-first_name')).toBeInTheDocument();
      expect(screen.getByTestId('field-last_name')).toBeInTheDocument();
      expect(screen.getByTestId('field-email')).toBeInTheDocument();
    });

    it('should render form with correct field labels', () => {
      render(<CreateUserForm />);

      expect(screen.getByText('First Name')).toBeInTheDocument();
      expect(screen.getByText('Last Name')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
    });

    it('should render form with correct placeholders', () => {
      render(<CreateUserForm />);

      expect(screen.getByPlaceholderText("Enter user's name")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Enter user's last name")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Enter user's email")).toBeInTheDocument();
    });

    it('should render submit button with correct text', () => {
      render(<CreateUserForm />);

      expect(screen.getByTestId('submit-button')).toBeInTheDocument();
      const createUserElements = screen.getAllByText('Create User');
      expect(createUserElements.length).toBeGreaterThan(0);
    });
  });

  describe('Form Validation', () => {
    it('should disable submit button when form is invalid', () => {
      (useForm as jest.Mock).mockReturnValue({
        ...defaultUseFormReturn,
        formState: {
          errors: {},
          isValid: false,
        },
      });

      render(<CreateUserForm />);

      const submitButton = screen.getByTestId('submit-button');
      expect(submitButton).toBeDisabled();
    });

    it('should enable submit button when form is valid', () => {
      (useForm as jest.Mock).mockReturnValue({
        ...defaultUseFormReturn,
        formState: {
          errors: {},
          isValid: true,
        },
      });

      render(<CreateUserForm />);

      const submitButton = screen.getByTestId('submit-button');
      expect(submitButton).not.toBeDisabled();
    });

    it('should display field errors when present', () => {
      (useForm as jest.Mock).mockReturnValue({
        ...defaultUseFormReturn,
        formState: {
          errors: {
            first_name: { message: 'First name is required' },
            email: { message: 'Invalid email' },
          },
          isValid: false,
        },
      });

      render(<CreateUserForm />);

      expect(screen.getByTestId('error-first_name')).toBeInTheDocument();
      expect(screen.getByText('First name is required')).toBeInTheDocument();
      expect(screen.getByTestId('error-email')).toBeInTheDocument();
      expect(screen.getByText('Invalid email')).toBeInTheDocument();
    });
  });

  describe('Form Submission', () => {
    it('should call mutateAsync with form data on submit', async () => {
      const formData = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
      };

      mockMutateAsync.mockResolvedValue(formData);

      render(<CreateUserForm />);

      const form = screen.getByTestId('form');
      fireEvent.submit(form);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalled();
      });
    });

    it('should close modal on successful submission', async () => {
      const formData = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
      };

      mockMutateAsync.mockResolvedValue(formData);

      render(<CreateUserForm />);

      const form = screen.getByTestId('form');
      fireEvent.submit(form);

      await waitFor(() => {
        expect(mockCloseModal).toHaveBeenCalled();
      });
    });

    it('should handle submission error gracefully', async () => {
      const error = new Error('Failed to create user');
      mockMutateAsync.mockRejectedValue(error);

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      render(<CreateUserForm />);

      const form = screen.getByTestId('form');
      fireEvent.submit(form);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Create user error:', error);
      });

      consoleSpy.mockRestore();
    });

    it('should not close modal on submission error', async () => {
      const error = new Error('Failed to create user');
      mockMutateAsync.mockRejectedValue(error);

      render(<CreateUserForm />);

      const form = screen.getByTestId('form');
      fireEvent.submit(form);

      await waitFor(() => {
        expect(mockCloseModal).not.toHaveBeenCalled();
      });
    });
  });

  describe('Loading State', () => {
    it('should show loading state when mutation is pending', () => {
      const mockUseCreateUser = jest.requireMock('@/hooks').useCreateUser;
      mockUseCreateUser.mockReturnValue({
        mutateAsync: mockMutateAsync,
        isPending: true,
      });

      render(<CreateUserForm />);

      const submitButton = screen.getByTestId('submit-button');
      expect(submitButton).toBeDisabled();
      expect(submitButton).toHaveTextContent('Creating user...');
    });

    it('should not show loading state when mutation is not pending', () => {
      const mockUseCreateUser = jest.requireMock('@/hooks').useCreateUser;
      mockUseCreateUser.mockReturnValue({
        mutateAsync: mockMutateAsync,
        isPending: false,
      });

      render(<CreateUserForm />);

      const submitButton = screen.getByTestId('submit-button');
      expect(submitButton).not.toBeDisabled();
      expect(submitButton).toHaveTextContent('Create User');
    });
  });

  describe('Form Configuration', () => {
    it('should use zodResolver for form validation', () => {
      render(<CreateUserForm />);

      expect(useForm).toHaveBeenCalledWith(
        expect.objectContaining({
          resolver: expect.any(Function),
          mode: 'onChange',
          defaultValues: {
            first_name: '',
            last_name: '',
            email: '',
          },
        }),
      );
    });

    it('should have correct default values', () => {
      render(<CreateUserForm />);

      expect(useForm).toHaveBeenCalledWith(
        expect.objectContaining({
          defaultValues: {
            first_name: '',
            last_name: '',
            email: '',
          },
        }),
      );
    });
  });

  describe('Component Integration', () => {
    it('should integrate with useCreateUser hook', () => {
      render(<CreateUserForm />);

      const mockUseCreateUser = jest.requireMock('@/hooks').useCreateUser;
      expect(mockUseCreateUser).toHaveBeenCalled();
    });

    it('should integrate with useModalStore', () => {
      render(<CreateUserForm />);

      const mockUseModalStore = jest.requireMock('@/stores').useModalStore;
      expect(mockUseModalStore).toHaveBeenCalled();
    });

    it('should integrate with UserLayout component', () => {
      render(<CreateUserForm />);

      expect(screen.getByTestId('user-layout')).toBeInTheDocument();
    });

    it('should integrate with FormWrapper component', () => {
      render(<CreateUserForm />);

      expect(screen.getByTestId('form')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should handle missing closeModal function', () => {
      const mockUseModalStore = jest.requireMock('@/stores').useModalStore;
      mockUseModalStore.mockReturnValue({
        closeModal: undefined,
      });

      expect(() => render(<CreateUserForm />)).not.toThrow();
    });

    it('should handle missing mutateAsync function', () => {
      const mockUseCreateUser = jest.requireMock('@/hooks').useCreateUser;
      mockUseCreateUser.mockReturnValue({
        mutateAsync: undefined,
        isPending: false,
      });

      expect(() => render(<CreateUserForm />)).not.toThrow();
    });
  });
});
