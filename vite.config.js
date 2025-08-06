import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/medirelay-prototype/', // GitHub 레포지토리 이름
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false
  }
})

