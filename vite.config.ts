import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    // One page, one chunk. There are no routes to split on, and splitting a
    // single document into vendor/app just buys an extra round trip. Current
    // output is ~520 kB raw / ~160 kB gzipped, mostly React + Motion.
    chunkSizeWarningLimit: 700,
  },
  server: { port: 5173 },
})
