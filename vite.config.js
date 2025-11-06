import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ["f7c3af57078a.ngrok-free.app", ".ngrok-free.app"],
    host: true,
  },
});
