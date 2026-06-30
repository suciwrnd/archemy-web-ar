import { defineConfig } from 'vite'

export default defineConfig({
  base: './', // Mengubah ke relative path agar tidak blank di GitHub Pages
  build: {
    outDir: 'docs',
    emptyOutDir: true
  }
})