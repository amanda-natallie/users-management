import { render, screen, fireEvent } from '@testing-library/react';
import { useNavigate } from 'react-router';
import NotFound from './not-found';
import ROUTES from '@/constants/routes';

jest.mock('react-router', () => ({
  useNavigate: jest.fn(),
}));

describe('NotFound Component', () => {
  let mockNavigate: jest.Mock;

  beforeEach(() => {
    mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<NotFound />);
    expect(screen.getByTestId('card')).toBeInTheDocument();
  });

  it('renders all UI elements correctly', () => {
    render(<NotFound />);

    // Check main container
    const container = screen.getByTestId('card').parentElement;
    expect(container).toHaveClass(
      'min-h-screen',
      'flex',
      'items-center',
      'justify-center',
      'bg-background',
    );

    // Check card structure
    expect(screen.getByTestId('card')).toHaveClass('w-full', 'max-w-md');
    expect(screen.getByTestId('card-header')).toHaveClass('text-center');
    expect(screen.getByTestId('card-content')).toHaveClass('text-center', 'space-y-4');
  });

  it('renders AlertTriangle icon with correct props', () => {
    render(<NotFound />);

    const icon = screen.getByTestId('alert-triangle-icon');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('h-8', 'w-8', 'text-destructive');
  });

  it('renders icon container with correct styling', () => {
    render(<NotFound />);

    const iconContainer = screen.getByTestId('alert-triangle-icon').parentElement;
    expect(iconContainer).toHaveClass(
      'mx-auto',
      'mb-4',
      'flex',
      'h-16',
      'w-16',
      'items-center',
      'justify-center',
      'rounded-full',
      'bg-destructive/10',
    );
  });

  it('displays correct title text', () => {
    render(<NotFound />);

    const title = screen.getByTestId('card-title');
    expect(title).toHaveTextContent('Page Not Found');
    expect(title).toHaveClass('text-2xl', 'font-bold');
  });

  it('displays correct error message', () => {
    render(<NotFound />);

    const message = screen.getByText("Sorry, the page you are looking for doesn't exist.");
    expect(message).toBeInTheDocument();
    expect(message).toHaveClass('text-muted-foreground');
  });

  it('renders button with correct text and styling', () => {
    render(<NotFound />);

    const button = screen.getByTestId('button');
    expect(button).toHaveTextContent('Go to Dashboard');
    expect(button).toHaveClass('w-full');
  });

  it('calls useNavigate hook', () => {
    render(<NotFound />);

    expect(useNavigate as jest.Mock).toHaveBeenCalledTimes(1);
  });

  it('navigates to home route when button is clicked', () => {
    render(<NotFound />);

    const button = screen.getByTestId('button');
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.HOME);
  });

  it('navigates to correct route value', () => {
    render(<NotFound />);

    const button = screen.getByTestId('button');
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.HOME);
  });

  it('handleGoToDashboard function is called on button click', () => {
    render(<NotFound />);

    const button = screen.getByTestId('button');

    // Click multiple times to ensure function works consistently
    fireEvent.click(button);
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledTimes(2);
    expect(mockNavigate).toHaveBeenNthCalledWith(1, ROUTES.HOME);
    expect(mockNavigate).toHaveBeenNthCalledWith(2, ROUTES.HOME);
  });

  it('component structure matches expected hierarchy', () => {
    render(<NotFound />);

    // Check the complete component structure
    const card = screen.getByTestId('card');
    const header = screen.getByTestId('card-header');
    const content = screen.getByTestId('card-content');
    const title = screen.getByTestId('card-title');
    const button = screen.getByTestId('button');
    const icon = screen.getByTestId('alert-triangle-icon');

    expect(card).toContainElement(header);
    expect(card).toContainElement(content);
    expect(header).toContainElement(title);
    expect(header).toContainElement(icon);
    expect(content).toContainElement(button);
  });

  it('exports default correctly', () => {
    expect(NotFound).toBeDefined();
    expect(typeof NotFound).toBe('function');
  });
});
