import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    tanstackStart({
      spa: {
        enabled: true,
        prerender: {
          enabled: false,
        },
      },
    }),
    viteReact(),
  ],
  server: {
    port: 3000,
    cors: true,
  },
  build: {
    outDir: 'dist',
  },
})
