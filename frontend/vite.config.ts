import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Bind to all interfaces for VPS access
    port: 5173,
    // Proxy removed to ensure all network calls use explicit env-configured URLs
    // If you need a dev proxy later, add it here and prefer `VITE_API_URL` in code.
  }
})
