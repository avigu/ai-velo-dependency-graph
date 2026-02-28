import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '.ngrok-free.app',
      '.ngrok-free.dev',
    ],
  },
  preview: {
    host: true,
  },
  // Serve index.html for all routes (SPA fallback)
  appType: 'spa',
});
