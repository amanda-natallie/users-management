import { render, screen } from '@testing-library/react';
import DashboardPage from './dashboard';

// Mock dependencies
jest.mock('@/hooks/use-users/use-users', () => ({
  useUsers: jest.fn(() => ({
    query: {
      data: {
        users: [],
        total: 0,
        page: 1,
        limit: 10,
      },
      isFetching: false,
      isLoading: false,
    },
    handlePageChange: jest.fn(),
  })),
}));

jest.mock('@/stores', () => ({
  useModalStore: jest.fn(() => ({
    openModal: jest.fn(),
    setModalData: jest.fn(),
  })),
}));

jest.mock('@/components/layout', () => ({
  MainLayout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="main-layout">{children}</div>
  ),
  Container: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="container">{children}</div>
  ),
}));

jest.mock('@/components/theme', () => ({
  ThemeToggle: () => <div data-testid="theme-toggle">Theme Toggle</div>,
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => (
    <button {...props}>{children}</button>
  ),
}));

jest.mock('@/components/ui/card', () => ({
  Card: ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => (
    <div {...props}>{children}</div>
  ),
  CardContent: ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => (
    <div {...props}>{children}</div>
  ),
}));

jest.mock('./components/users-table/users-table', () => ({
  __esModule: true,
  default: () => <div data-testid="users-table">Users Table</div>,
}));

describe('DashboardPage', () => {
  it('renders dashboard title', () => {
    render(<DashboardPage />);
    expect(screen.getByText('User Backoffice')).toBeInTheDocument();
  });

  it('renders welcome message', () => {
    render(<DashboardPage />);
    expect(screen.getByText('Welcome, user!')).toBeInTheDocument();
  });

  it('renders description text', () => {
    render(<DashboardPage />);
    expect(
      screen.getByText('View, create, update and delete your users from here.'),
    ).toBeInTheDocument();
  });

  it('renders create user button', () => {
    render(<DashboardPage />);
    expect(screen.getByText('Create User')).toBeInTheDocument();
  });

  it('renders users table', () => {
    render(<DashboardPage />);
    expect(screen.getByTestId('users-table')).toBeInTheDocument();
  });

  it('renders theme toggle', () => {
    render(<DashboardPage />);
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
  });

  it('renders main layout', () => {
    render(<DashboardPage />);
    expect(screen.getByTestId('main-layout')).toBeInTheDocument();
  });

  it('renders containers', () => {
    render(<DashboardPage />);
    expect(screen.getAllByTestId('container')).toHaveLength(2);
  });
});
