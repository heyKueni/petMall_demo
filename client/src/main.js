import { createSSRApp } from 'vue'
import App from './App.vue'
import uviewPlus from 'uview-plus'
import * as Pinia from 'pinia'

export function createApp() {
  const app = createSSRApp(App)
  app.use(uviewPlus)
  app.use(Pinia.createPinia())
  return {
    app,
    Pinia,
  }
}
