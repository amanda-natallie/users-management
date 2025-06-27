import '@testing-library/jest-dom';
import React from 'react';
import { env } from './__mocks__/env';

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  value: jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  })),
});

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  })),
});

Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: jest.fn(),
});

jest.mock('@/utils/env', () => ({
  getApiConfig: jest.fn().mockReturnValue({
    baseURL: env.API_URL,
    headers: {
      'x-api-key': env.API_KEY,
      'Content-Type': 'application/json',
    },
  }),
  logEnvConfig: jest.fn(),
  validateEnv: jest.fn(),
  env,
}));

jest.mock('react-router', () => ({
  Routes: ({ children }: { children: React.ReactNode }) =>
    React.createElement('div', { 'data-testid': 'routes' }, children),
  Route: ({ element }: { element: React.ReactNode }) =>
    React.createElement('div', { 'data-testid': 'route' }, element),
  useNavigate: () => jest.fn(),
  useLocation: () => ({ pathname: '/' }),
  useParams: () => ({}),
  useMatch: () => ({}),
}));

jest.mock('@tanstack/react-query', () => ({
  ...jest.requireActual('@tanstack/react-query'),
  QueryClient: jest.fn().mockImplementation(() => ({
    invalidateQueries: jest.fn(),
    setQueryData: jest.fn(),
    getQueryData: jest.fn(),
    clear: jest.fn(),
  })),
  useQuery: jest.fn(),
  useMutation: jest.fn(() => ({
    mutate: jest.fn(),
    mutateAsync: jest.fn(),
    isLoading: false,
    isError: false,
    error: null,
    data: null,
  })),
  useQueryClient: jest.fn(() => ({
    invalidateQueries: jest.fn(),
    setQueryData: jest.fn(),
    getQueryData: jest.fn(),
  })),
}));
