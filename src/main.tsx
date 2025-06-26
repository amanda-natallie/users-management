import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import './globals.css';
import App from './App.tsx';
import { ThemeInitializer } from '@/components/theme';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeInitializer />
      <App />
    </BrowserRouter>
  </StrictMode>,
);
