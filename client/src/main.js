import { createSSRApp } from 'vue'
import App from './App.vue'
import uviewPlus from 'uview-plus'
import * as Pinia from 'pinia'
import uri from './config/interceptor/router'
import req from './config/interceptor/request'

export function createApp() {
  const app = createSSRApp(App)

  // 全局挂载uview-plus
  app.use(uviewPlus)

  // 全局挂载pinia
  app.use(Pinia.createPinia())

  // 全局挂载“路由守卫”
  app.config.globalProperties.$uri = uri

  // 全局挂载请求方法
  app.config.globalProperties.$req = req

  return {
    app,
    Pinia,
  }
}
