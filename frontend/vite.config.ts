import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://apitest.skytrack.space',
        changeOrigin: true,
        secure: true,
        configure: (proxy) => {
          // Type assertion to access event emitter methods
          const proxyServer = proxy as any;
          proxyServer.on('error', (err: Error) => {
            console.log('proxy error', err);
          });
          proxyServer.on('proxyReq', (proxyReq: any, req: any) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxyServer.on('proxyRes', (proxyRes: any, req: any) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        },
      }
    }
  }
})
