import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

import path from 'path';
// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: +process.env.PORT! || 4338,
    host: true,
  },
  preview: {
    port: +process.env.PORT! || 80,
    host: true,
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    extensions: ['.ts', '.tsx', '.mjs', '.js', '.mts', '.jsx', '.json'],
  },
  json: {
    stringify: true,
  },
  build: {
    rollupOptions: {
      output: {},
    },
    chunkSizeWarningLimit: 1000,
  },
});
