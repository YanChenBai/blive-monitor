import { createApp } from 'vue'
import pinia from '@renderer/stores'
import App from './App.vue'
import router from './router'
import '@renderer/assets/css/main.css'
import '@unocss/reset/normalize.css'
import 'uno.css'

const app = createApp(App)

app.use(pinia)
app.use(router)

app.mount('#app')
