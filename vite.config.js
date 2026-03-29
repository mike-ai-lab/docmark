import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  server: {
    proxy: {
      // Proxy /api requests to the PDF server on port 3000
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      },
      // Proxy PDF generation endpoints to the PDF server
      '/generate-pdf': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      },
      '/health': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      }
    }
  }
});
