import { render, screen } from '@testing-library/react';
import DashboardPage from './dashboard';

describe('DashboardPage', () => {
  it('renders dashboard title', () => {
    render(<DashboardPage />);
    expect(screen.getByText('DashboardPage')).toBeInTheDocument();
  });

  it('has correct styling classes', () => {
    render(<DashboardPage />);
    const title = screen.getByText('DashboardPage');
    expect(title).toHaveClass('text-3xl', 'font-bold', 'underline');
  });
});
