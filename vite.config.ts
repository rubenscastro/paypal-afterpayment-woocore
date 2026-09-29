import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { port: 5179, host: true },
  // Both `@wordpress/ui` and `@wordpress/components` depend on `@emotion/react`
  // and `react`. Without dedupe, Vite's pre-bundling can ship two copies,
  // causing "Invalid hook call" + "@emotion/react loaded multiple times".
  resolve: {
    dedupe: ['react', 'react-dom', '@emotion/react', '@emotion/styled'],
  },
  optimizeDeps: {
    include: [
      '@wordpress/components',
      '@wordpress/ui',
      '@wordpress/icons',
      '@wordpress/i18n',
    ],
  },
});
