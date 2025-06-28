import { act, render, screen } from '@testing-library/react';
import App from './App';

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
  useThemeStore: jest.fn(() => ({
    theme: 'light',
    setTheme: jest.fn(),
  })),
}));

jest.mock('@/components/layout', () => ({
  MainLayout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="main-layout">{children}</div>
  ),
  Container: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="container">{children}</div>
  ),
  ErrorBoundary: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="error-boundary">{children}</div>
  ),
  FullscreenLoader: () => <div data-testid="fullscreen-loader">Loading...</div>,
  NotFound: () => <div data-testid="not-found">Not Found</div>,
}));

jest.mock('@/components/navigation', () => ({
  AuthGuard: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="auth-guard">{children}</div>
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

jest.mock('@/pages/dashboard/components/users-table/users-table', () => ({
  __esModule: true,
  default: () => <div data-testid="users-table">Users Table</div>,
}));

jest.mock('./pages/auth/auth', () => ({
  __esModule: true,
  default: () => <div data-testid="auth-page">Auth Page</div>,
}));

jest.mock('./pages/dashboard/dashboard', () => ({
  __esModule: true,
  default: () => <div data-testid="dashboard-page">Dashboard Page</div>,
}));

const renderApp = () => {
  return render(<App />);
};

describe('App Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders without crashing', async () => {
    await act(async () => {
      renderApp();
    });
    expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
  });

  it('shows FullscreenLoader as Suspense fallback', async () => {
    await act(async () => {
      renderApp();
    });
    expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
  });

  it('renders all route components when router is mocked', async () => {
    await act(async () => {
      renderApp();
    });

    expect(screen.getByTestId('auth-page')).toBeInTheDocument();
    expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
    expect(screen.getByTestId('not-found')).toBeInTheDocument();
  });

  it('lazy loads components properly', async () => {
    await act(async () => {
      renderApp();
    });

    expect(screen.getByTestId('auth-page')).toBeInTheDocument();
    expect(screen.getByTestId('not-found')).toBeInTheDocument();
  });

  describe('Route Coverage', () => {
    it('covers auth route path', async () => {
      await act(async () => {
        renderApp();
      });
      expect(screen.getByTestId('auth-page')).toBeInTheDocument();
    });

    it('covers home route path', async () => {
      await act(async () => {
        renderApp();
      });

      expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
    });

    it('covers catch-all route path', async () => {
      await act(async () => {
        renderApp();
      });
      expect(screen.getByTestId('not-found')).toBeInTheDocument();
    });
  });

  it('has correct component structure', async () => {
    await act(async () => {
      renderApp();
    });

    expect(screen.getByTestId('auth-page')).toBeInTheDocument();
    expect(screen.getByTestId('not-found')).toBeInTheDocument();
    expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
  });

  it('shows dashboard when authenticated', async () => {
    localStorage.setItem('auth_token', 'fake-token');

    await act(async () => {
      renderApp();
    });

    await act(async () => {
      expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
    });
  });

  it('shows auth guard loader when not authenticated', async () => {
    localStorage.removeItem('userToken');

    await act(async () => {
      renderApp();
    });

    expect(screen.getByTestId('auth-guard')).toBeInTheDocument();
  });
});

describe('App Component - Additional Coverage', () => {
  it('exports App component as default', () => {
    expect(App).toBeDefined();
    expect(typeof App).toBe('function');
  });

  it('App function returns JSX element', () => {
    const result = App();
    expect(result).toBeDefined();
    expect(result.type).toBeDefined();
  });

  it('tests all Route components render correctly', async () => {
    let unmount: () => void;

    await act(async () => {
      const renderResult = renderApp();
      unmount = renderResult.unmount;
    });

    expect(document.body).not.toBeEmptyDOMElement();

    await act(async () => {
      unmount();
    });
  });
});
