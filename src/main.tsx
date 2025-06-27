import { ThemeInitializer } from '@/components/theme';
import { queryClient } from '@/services/';
import { QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from './App.tsx';
import './globals.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeInitializer />
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
