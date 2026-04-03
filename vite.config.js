import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  server: {
    port: 8765,
    strictPort: true,
    proxy: {
      // Proxy /api requests to the PDF server on port 8766
      '/api': {
        target: 'http://localhost:8766',
        changeOrigin: true,
        secure: false
      }
    }
  }
});
