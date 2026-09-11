import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  root: 'client',
  plugins: [vue()],
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    // Em dev (npm run dev) o Vite repassa as chamadas da API para o Express
    proxy: {
      '/api': 'http://localhost:3000',
      '/health': 'http://localhost:3000',
    },
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.spec.js'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{js,vue}'],
      exclude: ['src/main.js', 'src/**/*.spec.js'],
      reportsDirectory: '../coverage-web',
      reporter: ['text', 'text-summary', 'lcov'],
      thresholds: {
        branches: 70,
        functions: 80,
        lines: 80,
        statements: 80,
      },
    },
  },
});
