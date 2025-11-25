import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import router from './router'
import App from './App.vue'
import './styles/main.css'

const app = createApp(App)
const pinia = createPinia()

// 注册 Pinia 插件
pinia.use(piniaPluginPersistedstate) 

app.use(pinia)
app.use(router)
app.mount('#app')
