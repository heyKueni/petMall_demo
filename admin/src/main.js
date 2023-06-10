import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './assets/main.css'
import axios from 'axios'

const app = createApp(App)

const request = axios.create({
  baseURL: '/api/arlanzon/userA',
  timeout: 10000,
})

app.config.globalProperties.$axios = request

app.use(ElementPlus)
app.use(createPinia())
app.use(router)

app.mount('#app')
