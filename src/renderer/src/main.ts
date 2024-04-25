import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from '@renderer/stores'
import '@renderer/assets/css/main.css'
import 'uno.css'
import '@unocss/reset/normalize.css'

const app = createApp(App)

app.use(pinia)
app.use(router)

app.mount('#app')
