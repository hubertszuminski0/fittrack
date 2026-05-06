import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  base: './',
  plugins: [vue()],
  build: {
    minify: false
  },
  optimizeDeps: {
    noDiscovery: true
  },
  test: {
    globals: true,
    environment: 'node'
  }
});
