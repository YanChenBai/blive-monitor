import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin, swcPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin(), swcPlugin()],
    build: {
      rollupOptions: {
        output: {
          format: 'es'
        }
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin(), swcPlugin()],
    build: {
      rollupOptions: {
        input: {
          blive: 'src/preload/blive.ts'
        },
        output: {
          format: 'es'
        }
      }
    }
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [vue()]
  }
})
