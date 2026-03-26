import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      external: [
        'firebase-admin',
        'firebase-admin/app',
        'firebase-admin/firestore',
        'pdf-parse',
        'formidable',
        'jsonwebtoken',
        'google-auth-library'
      ]
    }
  }
})
