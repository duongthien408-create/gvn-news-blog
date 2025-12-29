import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/gauth': {
        target: 'https://api-gauth.uat.gearvn.xyz',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/gauth/, ''),
        secure: false,
      },
    },
  },
})
