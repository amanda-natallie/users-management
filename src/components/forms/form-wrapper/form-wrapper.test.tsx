import { render, screen, fireEvent } from '@testing-library/react';
import FormWrapper from './form-wrapper';

describe('FormWrapper', () => {
  const defaultProps = {
    onSubmit: jest.fn(),
    children: <div data-testid="form-children">Form content</div>,
    submitText: 'Submit Form',
    isValid: true,
  };

  describe('Rendering', () => {
    it('renders form with children and submit button', () => {
      render(<FormWrapper {...defaultProps} />);

      expect(screen.getByTestId('form-wrapper')).toBeInTheDocument();
      expect(screen.getByTestId('form-children')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Submit Form' })).toBeInTheDocument();
    });

    it('renders submit button with correct text', () => {
      render(<FormWrapper {...defaultProps} submitText="Custom Submit" />);

      expect(screen.getByRole('button', { name: 'Custom Submit' })).toBeInTheDocument();
    });

    it('renders children correctly', () => {
      const customChildren = <input data-testid="custom-input" type="text" />;
      render(<FormWrapper {...defaultProps} children={customChildren} />);

      expect(screen.getByTestId('custom-input')).toBeInTheDocument();
    });
    it('renders multiple children correctly', () => {
      const multipleChildren = (
        <>
          <input data-testid="input-1" type="text" />
          <input data-testid="input-2" type="email" />
          <textarea data-testid="textarea" />
        </>
      );
      render(<FormWrapper {...defaultProps} children={multipleChildren} />);

      expect(screen.getByTestId('input-1')).toBeInTheDocument();
      expect(screen.getByTestId('input-2')).toBeInTheDocument();
      expect(screen.getByTestId('textarea')).toBeInTheDocument();
    });
  });

  describe('Behavior', () => {
    it('disables submit button when isValid is false', () => {
      render(<FormWrapper {...defaultProps} isValid={false} />);

      const submitButton = screen.getByRole('button', { name: 'Submit Form' });
      expect(submitButton).toBeDisabled();
    });

    it('enables submit button when isValid is true', () => {
      render(<FormWrapper {...defaultProps} isValid={true} />);

      const submitButton = screen.getByRole('button', { name: 'Submit Form' });
      expect(submitButton).not.toBeDisabled();
    });
    it('sets button type to submit', () => {
      render(<FormWrapper {...defaultProps} />);

      const submitButton = screen.getByRole('button', { name: 'Submit Form' });
      expect(submitButton).toHaveAttribute('type', 'submit');
    });

    it('handles form submission with event object', () => {
      const mockOnSubmit = jest.fn();
      render(<FormWrapper {...defaultProps} onSubmit={mockOnSubmit} />);

      const form = screen.getByTestId('form-wrapper');
      const submitEvent = new Event('submit', { bubbles: true });
      fireEvent(form, submitEvent);

      expect(mockOnSubmit).toHaveBeenCalledWith(expect.any(Object));
    });

    it('handles empty children', () => {
      render(<FormWrapper {...defaultProps} children={null} />);

      const form = screen.getByTestId('form-wrapper');
      expect(form).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Submit Form' })).toBeInTheDocument();
    });

    it('handles empty submit text', () => {
      render(<FormWrapper {...defaultProps} submitText="" />);

      const submitButton = screen.getByRole('button');
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveTextContent('');
    });

    it('calls onSubmit when form is submitted', () => {
      const mockOnSubmit = jest.fn();
      render(<FormWrapper {...defaultProps} onSubmit={mockOnSubmit} />);

      const form = screen.getByTestId('form-wrapper');
      fireEvent.submit(form);

      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });
  });
  describe('Styling', () => {
    it('applies correct CSS classes to form', () => {
      render(<FormWrapper {...defaultProps} />);

      const form = screen.getByTestId('form-wrapper');
      expect(form).toHaveClass('space-y-4');
    });

    it('applies correct CSS classes to submit button', () => {
      render(<FormWrapper {...defaultProps} />);

      const submitButton = screen.getByRole('button', { name: 'Submit Form' });
      expect(submitButton).toHaveClass(
        'w-full',
        'btn-purple',
        'transition-all',
        'duration-200',
        'hover:scale-[1.02]',
        'active:scale-[0.98]',
        'mt-4',
      );
    });
  });
});
