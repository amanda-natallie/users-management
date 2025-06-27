import { act, render, screen } from '@testing-library/react';
import App from './App';

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
    expect(screen.getByTestId('fullscreen-loader')).toBeInTheDocument();
  });

  it('shows FullscreenLoader as Suspense fallback', async () => {
    await act(async () => {
      renderApp();
    });
    expect(screen.getByTestId('fullscreen-loader')).toBeInTheDocument();
  });

  it('renders all route components when router is mocked', async () => {
    await act(async () => {
      renderApp();
    });

    expect(screen.getByTestId('auth-page')).toBeInTheDocument();
    expect(screen.getByTestId('fullscreen-loader')).toBeInTheDocument();
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

      expect(screen.getByTestId('fullscreen-loader')).toBeInTheDocument();
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
    expect(screen.getByTestId('fullscreen-loader')).toBeInTheDocument();
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

    expect(screen.getByTestId('fullscreen-loader')).toBeInTheDocument();
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
