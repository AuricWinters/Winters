import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3000,
    host: '0.0.0.0',
    allowedHosts: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8001',
        changeOrigin: true
      },
      '/ws': {
        target: 'ws://localhost:8001',
        ws: true,
        changeOrigin: true
      }
    }
  },
  build: {
    // 构建优化
    target: 'es2015',
    // 代码分割
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router'],
          'code-editor': ['@guolao/vue-monaco-editor', '@xterm/xterm', '@xterm/addon-fit'],
        }
      }
    },
    // 缓存
    cacheDir: path.resolve(__dirname, '.vite/cache')
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  // 优化依赖预构建
  optimizeDeps: {
    include: ['vue', 'vue-router']
  }
})