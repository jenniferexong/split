import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigpaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    strictPort: true,
    port: 3000,
  },
  plugins: [
    react(),
    tsconfigpaths(),
    svgr(),
    VitePWA({ registerType: 'autoUpdate' }),
  ],
});
