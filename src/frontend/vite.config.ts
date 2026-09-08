import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname,
    },
  },
  server: {
    port: 5173,
    // The API's CORS policy allowlists exactly this origin. Without strictPort, an occupied
    // 5173 sends Vite to 5174 and every request fails preflight, which surfaces as a
    // "cannot reach the API" error pointing at the wrong process.
    strictPort: true,
  },
})
