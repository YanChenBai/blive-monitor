import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import '@/assets/main.css'
import 'uno.css'
const app = createApp(App)

app.use(createPinia())

function main() {
  window.onload = async () => {
    const scriptVue = document.createElement('script')
    scriptVue.src = 'https://cdn.jsdelivr.net/npm/vue@3.4.5/dist/vue.global.js'

    const plugin = document.createElement('div')
    plugin.id = '#plugin'

    scriptVue.onload = () => {
      app.mount('#plugin')
    }

    document.body.appendChild(plugin)
    document.body.appendChild(scriptVue)
  }
}

main()
