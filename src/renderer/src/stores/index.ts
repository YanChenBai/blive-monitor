import { createPinia } from 'pinia'

import persistedstate from 'pinia-plugin-persistedstate'
const pinia = createPinia().use(persistedstate)
export default pinia
