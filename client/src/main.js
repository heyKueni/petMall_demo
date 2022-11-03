import { createSSRApp } from 'vue'
import App from './App.vue'
import uviewPlus from 'uview-plus'
import * as Pinia from 'pinia'
import uri from './config/interceptor/router'

export function createApp() {
  const app = createSSRApp(App)

  // 全局挂载uview-plus
  app.use(uviewPlus)

  // 全局挂载pinia
  app.use(Pinia.createPinia())

  // 全局挂载路由守卫
  app.config.globalProperties.$uri = uri

  return {
    app,
    Pinia,
  }
}
