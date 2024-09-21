import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',  // Explicitly set output directory
    sourcemap: false,
  },
  server: {
    sourcemap: false, // Disable source maps during dev server
  },
})
