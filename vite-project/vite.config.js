import { defineConfig } from 'vite';

// Vite config tuned for this project
export default defineConfig({
  root: '.',
  publicDir: 'public',
  resolve: {
    // Use a simple alias so imports like `@/main.js` map to `/src/main.js`
    alias: {
      '@': '/src'
    }
  },
  server: {
    port: 5173,
    open: false,
    // Keep the HMR overlay enabled by default; set to false to hide overlay
    hmr: {
      overlay: true
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  },
  optimizeDeps: {
    include: ['three']
  }
});
