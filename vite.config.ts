import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import type { UserConfigExport } from 'vite'

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory
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
            'api-key': env.VITE_DEV_TO_API_KEY,  // Use env object here
            'Accept': 'application/vnd.forem.api-v1+json'
          }
        }
      }
    }
  } as UserConfigExport
})
