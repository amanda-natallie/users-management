import '@testing-library/jest-dom';
import { env } from './__mocks__/env';
import React from 'react';

// Mock do ResizeObserver que não está disponível no jsdom
Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  value: jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  })),
});

// Mock do matchMedia que não está disponível no jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock do IntersectionObserver
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  })),
});

// Mock do window.scrollTo
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

// Mock do react-router para evitar dependências de TextEncoder e hooks
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
