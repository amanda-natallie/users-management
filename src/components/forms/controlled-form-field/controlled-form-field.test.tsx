import { render, screen, fireEvent } from '@testing-library/react';
import { FieldValues, useForm } from 'react-hook-form';
import ControlledFormField, { ControlledFormFieldProps } from './controlled-form-field';

jest.mock('../form-field/form-field', () => {
  return function MockFormField(props: ControlledFormFieldProps<FieldValues>) {
    const { id, label, showPasswordToggle, onTogglePassword, showPassword, error, ...rest } = props;
    return (
      <div data-testid="form-field">
        <label htmlFor={id}>{label}</label>
        <input {...{ id, label, ...rest }} data-testid="form-input" />
        {showPasswordToggle && (
          <button type="button" onClick={onTogglePassword} data-testid="password-toggle">
            {showPassword ? 'Hide' : 'Show'}
          </button>
        )}
        {error && <span data-testid="error-message">{error}</span>}
      </div>
    );
  };
});

describe('ControlledFormField', () => {
  const defaultProps = {
    name: 'testField' as const,
    id: 'test-input',
    label: 'Test Label',
  };

  it('renders with basic props', () => {
    const TestComponent = () => {
      const { control } = useForm();
      return <ControlledFormField {...defaultProps} control={control} />;
    };

    render(<TestComponent />);

    expect(screen.getByTestId('form-field')).toBeInTheDocument();
    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByTestId('form-input')).toBeInTheDocument();
  });

  it('renders with email type', () => {
    const TestComponent = () => {
      const { control } = useForm();
      return <ControlledFormField {...defaultProps} type="email" control={control} />;
    };

    render(<TestComponent />);

    expect(screen.getByTestId('form-input')).toHaveAttribute('type', 'email');
  });

  it('renders with password type', () => {
    const TestComponent = () => {
      const { control } = useForm();
      return <ControlledFormField {...defaultProps} type="password" control={control} />;
    };

    render(<TestComponent />);

    expect(screen.getByTestId('form-input')).toHaveAttribute('type', 'password');
  });

  it('renders with text type (default)', () => {
    const TestComponent = () => {
      const { control } = useForm();
      return <ControlledFormField {...defaultProps} type="text" control={control} />;
    };

    render(<TestComponent />);

    expect(screen.getByTestId('form-input')).toHaveAttribute('type', 'text');
  });

  it('renders with placeholder', () => {
    const TestComponent = () => {
      const { control } = useForm();
      return <ControlledFormField {...defaultProps} placeholder="Enter text" control={control} />;
    };

    render(<TestComponent />);

    expect(screen.getByTestId('form-input')).toHaveAttribute('placeholder', 'Enter text');
  });

  it('renders with error message', () => {
    const TestComponent = () => {
      const { control } = useForm();
      return (
        <ControlledFormField {...defaultProps} error="This field is required" control={control} />
      );
    };

    render(<TestComponent />);

    expect(screen.getByTestId('error-message')).toBeInTheDocument();
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('renders with password toggle functionality', () => {
    const TestComponent = () => {
      const { control } = useForm();
      return (
        <ControlledFormField
          {...defaultProps}
          type="password"
          showPasswordToggle={true}
          showPassword={false}
          onTogglePassword={jest.fn()}
          control={control}
        />
      );
    };

    render(<TestComponent />);

    expect(screen.getByTestId('password-toggle')).toBeInTheDocument();
    expect(screen.getByText('Show')).toBeInTheDocument();
  });

  it('renders password toggle with show password state', () => {
    const TestComponent = () => {
      const { control } = useForm();
      return (
        <ControlledFormField
          {...defaultProps}
          type="password"
          showPasswordToggle={true}
          showPassword={true}
          onTogglePassword={jest.fn()}
          control={control}
        />
      );
    };

    render(<TestComponent />);

    expect(screen.getByTestId('password-toggle')).toBeInTheDocument();
    expect(screen.getByText('Hide')).toBeInTheDocument();
  });

  it('calls onTogglePassword when password toggle is clicked', () => {
    const mockTogglePassword = jest.fn();

    const TestComponent = () => {
      const { control } = useForm();
      return (
        <ControlledFormField
          {...defaultProps}
          type="password"
          showPasswordToggle={true}
          showPassword={false}
          onTogglePassword={mockTogglePassword}
          control={control}
        />
      );
    };

    render(<TestComponent />);

    const toggleButton = screen.getByTestId('password-toggle');
    fireEvent.click(toggleButton);

    expect(mockTogglePassword).toHaveBeenCalledTimes(1);
  });

  it('calls onFocus when input is focused', () => {
    const mockOnFocus = jest.fn();

    const TestComponent = () => {
      const { control } = useForm();
      return <ControlledFormField {...defaultProps} onFocus={mockOnFocus} control={control} />;
    };

    render(<TestComponent />);

    const input = screen.getByTestId('form-input');
    fireEvent.focus(input);

    expect(mockOnFocus).toHaveBeenCalledTimes(1);
  });

  it('calls onBlur when input loses focus', () => {
    const mockOnBlur = jest.fn();

    const TestComponent = () => {
      const { control } = useForm();
      return <ControlledFormField {...defaultProps} onBlur={mockOnBlur} control={control} />;
    };

    render(<TestComponent />);

    const input = screen.getByTestId('form-input');
    fireEvent.blur(input);

    expect(mockOnBlur).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    const TestComponent = () => {
      const { control } = useForm();
      return <ControlledFormField {...defaultProps} className="custom-class" control={control} />;
    };

    render(<TestComponent />);

    const input = screen.getByTestId('form-input');
    expect(input).toHaveClass('custom-class');
  });

  it('passes all form field props to FormField component', () => {
    const allProps = {
      ...defaultProps,
      type: 'email' as const,
      placeholder: 'Enter email',
      error: 'Invalid email',
      showPasswordToggle: true,
      showPassword: false,
      onTogglePassword: jest.fn(),
      onFocus: jest.fn(),
      onBlur: jest.fn(),
      className: 'test-class',
    };

    const TestComponent = () => {
      const { control } = useForm();
      return <ControlledFormField {...allProps} control={control} />;
    };

    render(<TestComponent />);

    expect(screen.getByTestId('form-input')).toHaveAttribute('type', 'email');
    expect(screen.getByTestId('form-input')).toHaveAttribute('placeholder', 'Enter email');
    expect(screen.getByTestId('form-input')).toHaveClass('test-class');
    expect(screen.getByTestId('error-message')).toBeInTheDocument();
    expect(screen.getByTestId('password-toggle')).toBeInTheDocument();
  });

  it('renders without password toggle when showPasswordToggle is false', () => {
    const TestComponent = () => {
      const { control } = useForm();
      return (
        <ControlledFormField
          {...defaultProps}
          type="password"
          showPasswordToggle={false}
          control={control}
        />
      );
    };

    render(<TestComponent />);

    expect(screen.queryByTestId('password-toggle')).not.toBeInTheDocument();
  });

  it('renders without error message when error is not provided', () => {
    const TestComponent = () => {
      const { control } = useForm();
      return <ControlledFormField {...defaultProps} control={control} />;
    };

    render(<TestComponent />);

    expect(screen.queryByTestId('error-message')).not.toBeInTheDocument();
  });

  it('handles undefined optional props gracefully', () => {
    const TestComponent = () => {
      const { control } = useForm();
      return (
        <ControlledFormField
          {...defaultProps}
          type={undefined}
          placeholder={undefined}
          error={undefined}
          showPasswordToggle={undefined}
          showPassword={undefined}
          onTogglePassword={undefined}
          onFocus={undefined}
          onBlur={undefined}
          className={undefined}
          control={control}
        />
      );
    };

    render(<TestComponent />);

    expect(screen.getByTestId('form-field')).toBeInTheDocument();
    expect(screen.getByTestId('form-input')).toBeInTheDocument();
  });

  it('works with different field names', () => {
    const TestComponent = () => {
      const { control } = useForm();
      return <ControlledFormField {...defaultProps} name="differentField" control={control} />;
    };

    render(<TestComponent />);

    expect(screen.getByTestId('form-field')).toBeInTheDocument();
  });

  it('integrates with react-hook-form Controller', () => {
    const TestForm = () => {
      const { control } = useForm({
        defaultValues: {
          testField: 'initial value',
        },
      });

      return <ControlledFormField {...defaultProps} control={control} />;
    };

    render(<TestForm />);

    expect(screen.getByTestId('form-field')).toBeInTheDocument();
    expect(screen.getByTestId('form-input')).toBeInTheDocument();
  });
});
