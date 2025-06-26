import { render, screen } from '@testing-library/react';
import AuthenticationPage from './auth';

describe('AuthenticationPage', () => {
  it('renders authentication title', () => {
    render(<AuthenticationPage />);
    expect(screen.getByText('AuthenticationPage')).toBeInTheDocument();
  });

  it('has correct styling classes', () => {
    render(<AuthenticationPage />);
    const title = screen.getByText('AuthenticationPage');
    expect(title).toHaveClass('text-3xl', 'font-bold', 'underline');
  });
});
