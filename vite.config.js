import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 5173,
    host: true, // listen on 0.0.0.0 so Render can reach it
  },
})

