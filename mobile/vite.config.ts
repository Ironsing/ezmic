import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  root: './src',
  build: {
    outDir: '../dist',
    minify: false,
    emptyOutDir: true,
  },
  plugins: [svelte(), tailwindcss(),],
  server: {
    host: '0.0.0.0', // Exposes Vite on your local network
    port: 5175,
  },
});
