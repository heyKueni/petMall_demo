import path from 'path'
import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

// https://vitejs.dev/config/
export default defineConfig({
  alias: {
    '@': path.resolve(__dirname, 'src'),
  },
  css: {
    // CSS 预处理器
    preprocessorOptions: {
      scss: {
        additionalData: '@import "src/uni.scss";',
      },
    },
  },
  plugins: [uni()],
})
