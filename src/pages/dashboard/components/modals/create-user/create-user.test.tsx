import { render, screen } from '@testing-library/react';
import CreateUserView from './create-user';

jest.mock('./create-user-form', () => ({
  __esModule: true,
  default: () => <div data-testid="create-user-form">Create User Form</div>,
}));

describe('CreateUserView', () => {
  it('should render the CreateUserForm component', () => {
    render(<CreateUserView />);

    expect(screen.getByTestId('create-user-form')).toBeInTheDocument();
  });

  it('should render with correct content', () => {
    render(<CreateUserView />);

    expect(screen.getByText('Create User Form')).toBeInTheDocument();
  });

  it('should have proper component structure', () => {
    const { container } = render(<CreateUserView />);

    expect(container.firstChild).toBeInTheDocument();
    expect(container.firstChild).toHaveAttribute('data-testid', 'create-user-form');
  });

  it('should export component as default', () => {
    expect(CreateUserView).toBeDefined();
    expect(typeof CreateUserView).toBe('function');
  });

  it('should render without props', () => {
    expect(() => render(<CreateUserView />)).not.toThrow();
  });

  it('should render consistently across multiple renders', () => {
    const { rerender } = render(<CreateUserView />);

    expect(screen.getByTestId('create-user-form')).toBeInTheDocument();

    rerender(<CreateUserView />);

    expect(screen.getByTestId('create-user-form')).toBeInTheDocument();
  });
});
