import { defineConfig, loadEnv, type ConfigEnv, type UserConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env': {}
    },
    server: {
      proxy: {
        '/dev-to-api': {
          target: 'https://dev.to',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/dev-to-api/, ''),
          headers: {
            'api-key': env.VITE_DEV_TO_API_KEY,
            'Accept': 'application/vnd.forem.api-v1+json'
          }
        }
      }
    }
  }
})
