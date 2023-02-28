import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import variables from './src/assets/css/variables'
import vueJSX from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJSX(), // 支持jsx语法
  ],
  resolve: {
    // 导入别名
    alias: {
      '@': resolve(__dirname, 'src'),
      "/images": "src/assets/images",
    }
  },
  server: {
    open: true,
    host: '0.0.0.0',
    cors: true,
    // port: 3000,
    // proxy: {
    //   "/api": {
    //     target: 'http://pcapi-xiaotuxian-front-devtest.itheima.net/',
    //     changeOrigin: true,
    //     // rewrite: (path) => path.replace(/^\/api/, ""),
    //   }
    // },
  },
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          // reference:  Avoid repeated references
          // hack: `true; @import (reference) "${resolve('src/design/config.less')}";`,
          ...variables,
        },
        javascriptEnabled: true,
      },
    },
  }
})