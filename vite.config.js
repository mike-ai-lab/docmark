import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      // Proxy /api requests to the PDF server on port 3000
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      }
    }
  }
});
