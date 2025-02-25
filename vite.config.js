import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss()
  ],
  server: {
    proxy: {
      // Proxy for user-related API
      "/user": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
      },
      // Proxy for service-related API
      "/service": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
      },
      "/booking": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
