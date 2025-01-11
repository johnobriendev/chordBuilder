import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          pdf: ['html2canvas', 'jspdf']
        }
      }
    },
    commonjsOptions: {
      transformMixedEsModules: true
    }
  }
});
