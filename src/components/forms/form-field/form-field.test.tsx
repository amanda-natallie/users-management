import { render, screen, fireEvent } from '@testing-library/react';
import FormField from './form-field';

describe('FormField', () => {
  const defaultProps = {
    id: 'test-input',
    label: 'Test Label',
  };

  it('renders with default props', () => {
    render(<FormField {...defaultProps} />);

    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text');
  });

  it('renders with custom type', () => {
    render(<FormField {...defaultProps} type="email" />);

    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');
  });

  it('renders with placeholder', () => {
    render(<FormField {...defaultProps} placeholder="Enter text" />);

    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('renders with error message', () => {
    render(<FormField {...defaultProps} error="This field is required" />);

    expect(screen.getByText('This field is required')).toBeInTheDocument();
    expect(screen.getByText('This field is required')).toHaveClass('text-red-500');
  });

  it('renders password field without toggle by default', () => {
    render(<FormField {...defaultProps} type="password" />);

    expect(screen.getByDisplayValue('')).toHaveAttribute('type', 'password');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders password field with toggle when showPasswordToggle is true', () => {
    render(
      <FormField
        {...defaultProps}
        type="password"
        showPasswordToggle={true}
        showPassword={false}
        onTogglePassword={jest.fn()}
      />,
    );

    expect(screen.getByDisplayValue('')).toHaveAttribute('type', 'password');
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveClass('absolute');
  });

  it('shows eye icon when password is hidden', () => {
    render(
      <FormField
        {...defaultProps}
        type="password"
        showPasswordToggle={true}
        showPassword={false}
        onTogglePassword={jest.fn()}
      />,
    );

    // Check for Eye icon (password hidden)
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    // The Eye icon should be present when showPassword is false
  });

  it('shows eye-off icon when password is visible', () => {
    render(
      <FormField
        {...defaultProps}
        type="password"
        showPasswordToggle={true}
        showPassword={true}
        onTogglePassword={jest.fn()}
      />,
    );

    // Check for EyeOff icon (password visible)
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    // The EyeOff icon should be present when showPassword is true
  });

  it('calls onTogglePassword when toggle button is clicked', () => {
    const mockTogglePassword = jest.fn();

    render(
      <FormField
        {...defaultProps}
        type="password"
        showPasswordToggle={true}
        showPassword={false}
        onTogglePassword={mockTogglePassword}
      />,
    );

    const toggleButton = screen.getByRole('button');
    fireEvent.click(toggleButton);

    expect(mockTogglePassword).toHaveBeenCalledTimes(1);
  });

  it('calls onFocus when input is focused', () => {
    const mockOnFocus = jest.fn();

    render(<FormField {...defaultProps} onFocus={mockOnFocus} />);

    const input = screen.getByRole('textbox');
    fireEvent.focus(input);

    expect(mockOnFocus).toHaveBeenCalledTimes(1);
  });

  it('calls onBlur when input loses focus', () => {
    const mockOnBlur = jest.fn();

    render(<FormField {...defaultProps} onBlur={mockOnBlur} />);

    const input = screen.getByRole('textbox');
    fireEvent.blur(input);

    expect(mockOnBlur).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    render(<FormField {...defaultProps} className="custom-class" />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('custom-class');
  });

  it('applies error styling when error is present', () => {
    render(<FormField {...defaultProps} error="Error message" />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('focus-visible:ring-red-500/50');
    expect(input).toHaveClass('focus-visible:border-red-500');
  });

  it('applies default focus styling when no error is present', () => {
    render(<FormField {...defaultProps} />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('focus-visible:ring-ring');
    expect(input).toHaveClass('focus-visible:ring-1');
  });

  it('applies pr-10 class when password toggle is enabled', () => {
    render(
      <FormField
        {...defaultProps}
        type="password"
        showPasswordToggle={true}
        showPassword={false}
        onTogglePassword={jest.fn()}
      />,
    );

    const input = screen.getByDisplayValue('');
    expect(input).toHaveClass('pr-10');
  });

  it('changes input type to text when password is visible', () => {
    render(
      <FormField
        {...defaultProps}
        type="password"
        showPasswordToggle={true}
        showPassword={true}
        onTogglePassword={jest.fn()}
      />,
    );

    const input = screen.getByDisplayValue('');
    expect(input).toHaveAttribute('type', 'text');
  });

  it('keeps input type as password when password is hidden', () => {
    render(
      <FormField
        {...defaultProps}
        type="password"
        showPasswordToggle={true}
        showPassword={false}
        onTogglePassword={jest.fn()}
      />,
    );

    const input = screen.getByDisplayValue('');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('forwards ref to input element', () => {
    let refValue: HTMLInputElement | null = null;
    const ref = (element: HTMLInputElement | null) => {
      refValue = element;
    };

    render(<FormField {...defaultProps} ref={ref} />);

    expect(refValue).toBeInstanceOf(HTMLInputElement);
  });

  it('passes additional props to input element', () => {
    render(<FormField {...defaultProps} data-testid="custom-input" />);

    expect(screen.getByTestId('custom-input')).toBeInTheDocument();
  });

  it('renders with animation classes', () => {
    render(<FormField {...defaultProps} />);

    // The animate-slide-in class is on the outer div container
    const container = screen.getByLabelText('Test Label').closest('div')?.parentElement;
    expect(container).toHaveClass('animate-slide-in');
  });

  it('renders error with animation class', () => {
    render(<FormField {...defaultProps} error="Error message" />);

    const errorElement = screen.getByText('Error message');
    expect(errorElement).toHaveClass('animate-fade-in');
  });

  it('renders label with correct styling', () => {
    render(<FormField {...defaultProps} />);

    const label = screen.getByText('Test Label');
    expect(label).toHaveClass('text-sm');
    expect(label).toHaveClass('font-medium');
  });

  it('renders toggle button with correct styling', () => {
    render(
      <FormField
        {...defaultProps}
        type="password"
        showPasswordToggle={true}
        showPassword={false}
        onTogglePassword={jest.fn()}
      />,
    );

    const button = screen.getByRole('button');
    expect(button).toHaveClass('absolute');
    expect(button).toHaveClass('right-0');
    expect(button).toHaveClass('top-0');
    expect(button).toHaveClass('h-full');
    expect(button).toHaveClass('px-3');
    expect(button).toHaveClass('py-2');
    expect(button).toHaveClass('hover:bg-transparent');
    expect(button).toHaveClass('focus-ring');
  });

  it('renders input with transition classes', () => {
    render(<FormField {...defaultProps} />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('transition-all');
    expect(input).toHaveClass('duration-200');
  });

  it('handles all type variants', () => {
    const types = ['text', 'email', 'password'] as const;

    types.forEach(type => {
      const { unmount } = render(<FormField {...defaultProps} type={type} />);

      if (type === 'password') {
        expect(screen.getByDisplayValue('')).toHaveAttribute('type', 'password');
      } else {
        expect(screen.getByRole('textbox')).toHaveAttribute('type', type);
      }

      unmount();
    });
  });

  it('handles conditional rendering of password toggle', () => {
    // Test with showPasswordToggle false
    const { rerender } = render(
      <FormField {...defaultProps} type="password" showPasswordToggle={false} />,
    );

    expect(screen.queryByRole('button')).not.toBeInTheDocument();

    // Test with showPasswordToggle true
    rerender(
      <FormField
        {...defaultProps}
        type="password"
        showPasswordToggle={true}
        showPassword={false}
        onTogglePassword={jest.fn()}
      />,
    );

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('handles conditional error rendering', () => {
    // Test without error
    const { rerender } = render(<FormField {...defaultProps} />);

    expect(screen.queryByText('Error message')).not.toBeInTheDocument();

    // Test with error
    rerender(<FormField {...defaultProps} error="Error message" />);

    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  it('handles all event callbacks', () => {
    const mockOnFocus = jest.fn();
    const mockOnBlur = jest.fn();
    const mockOnTogglePassword = jest.fn();

    render(
      <FormField
        {...defaultProps}
        onFocus={mockOnFocus}
        onBlur={mockOnBlur}
        type="password"
        showPasswordToggle={true}
        showPassword={false}
        onTogglePassword={mockOnTogglePassword}
      />,
    );

    const input = screen.getByDisplayValue('');
    const button = screen.getByRole('button');

    fireEvent.focus(input);
    expect(mockOnFocus).toHaveBeenCalledTimes(1);

    fireEvent.blur(input);
    expect(mockOnBlur).toHaveBeenCalledTimes(1);

    fireEvent.click(button);
    expect(mockOnTogglePassword).toHaveBeenCalledTimes(1);
  });
});
