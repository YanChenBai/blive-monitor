import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin, swcPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin(), swcPlugin()],
    build: {
      rollupOptions: {
        output: {
          format: 'es'
        }
      }
    },
    resolve: {
      alias: {
        '@main': resolve('src/main'),
        '@preload': resolve('src/preload'),
        '@type': resolve('src/types')
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin(), swcPlugin()],
    build: {
      rollupOptions: {
        input: {
          blive: 'src/preload/blive.ts',
          main: 'src/preload/main.ts',
          biliHome: 'src/preload/biliHome.ts'
        },
        output: {
          format: 'es'
        }
      }
    },
    resolve: {
      alias: {
        '@main': resolve('src/main'),
        '@preload': resolve('src/preload'),
        '@type': resolve('src/types')
      }
    }
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        '@type': resolve('src/types')
      }
    },
    plugins: [
      vue(),
      UnoCSS({
        configFile: './uno.config.{js,ts,mjs,mts}'
      }),
      AutoImport({
        dts: true,
        imports: [
          'vue',
          {
            'naive-ui': ['useDialog', 'useMessage', 'useNotification', 'useLoadingBar']
          }
        ]
      }),
      Components({
        resolvers: [NaiveUiResolver()]
      })
    ],
    esbuild: {
      drop: ['console', 'debugger']
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            pinyin: ['pinyin-pro'],
            ui: ['naive-ui']
          }
        }
      }
    }
  }
})
