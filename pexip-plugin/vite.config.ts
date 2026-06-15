import { defineConfig } from 'vite'

// The plugin is served as a regular web page that Web App 3 loads in an iframe.
// During development: npm run dev → http://localhost:5000
//   → enter this URL as the plugin URL in Web App 3's admin settings.
// For production: npm run build → serve the dist/ folder from any web server.

export default defineConfig({
  server: {
    port: 5000,
    open: false,
    // Allow requests from the Web App 3 origin during local development
    cors: true,
    // WA3 may load the plugin page over HTTPS; use a self-signed cert for dev
    https: false,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: { plugin: './index.html' },
    },
  },
})
