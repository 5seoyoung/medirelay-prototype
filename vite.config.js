import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 개발 환경에서는 '/', 프로덕션에서는 '/medirelay-prototype/'
  base: process.env.NODE_ENV === 'production' ? '/medirelay-prototype/' : '/',
  build: {
    outDir: 'dist'
  }
}
)