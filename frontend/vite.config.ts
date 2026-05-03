import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://victoria-baby-essentials-production.up.railway.app',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'https://victoria-baby-essentials-production.up.railway.app',
        changeOrigin: true,
      },
    },
  },
})
