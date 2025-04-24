import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/guides': 'http://localhost:5001',
      '/api': 'http://localhost:5001',
      '/tourtypes': 'http://localhost:5001',
    },
  },
})
