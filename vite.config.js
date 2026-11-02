import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// API отдаётся по http, поэтому в dev ходим через прокси Vite
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://api.favorit-parts.ru',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/hs/hsprice'),
      },
    },
  },
});
