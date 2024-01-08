import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
// @ts-ignore
import { cdn } from 'vite-plugin-cdn2'
import path from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    UnoCSS({
      configFile: './uno.config.{js,ts,mjs,mts}'
    }),
    AutoImport({
      imports: [
        'vue',
        {
          'naive-ui': ['useDialog', 'useMessage', 'useNotification', 'useLoadingBar']
        }
      ]
    }),
    Components({
      resolvers: [NaiveUiResolver()]
    }),
    // cssInjectedByJsPlugin(),
    cdn({ modules: ['vue', 'naive-ui'] })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(path.resolve(__dirname, 'src'))
    }
  },
  build: {
    rollupOptions: {
      output: {
        // manualChunks: {
        //   ui: ['naive-ui']
        // }
      }
    }
  }
})
