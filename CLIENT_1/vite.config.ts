import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Importante para que acepte conexiones externas/de red
    port: 5174, // Define explícitamente el puerto que usarás con Cloudflared
    strictPort: true,
    watch: {
      usePolling: true,
    },
    allowedHosts: [
      '.trycloudflare.com' // Permite cualquier subdominio de Cloudflare Tunnel
    ],
  },
})