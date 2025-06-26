import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import EnvironmentPlugin from 'vite-plugin-environment';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    EnvironmentPlugin('all'), // This transforms import.meta.env to process.env
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
