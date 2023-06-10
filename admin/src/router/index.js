import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      children: [
        {
          path: '/com',
          name: 'com',
          component: () => import('../views/Com.vue'),
        },
        {
          path: '/post',
          name: 'post',
          component: () => import('../views/Post.vue'),
        },
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue'),
    },
  ],
})

router.beforeEach((to, from, next) => {
  if (to.path == '/login' || sessionStorage.getItem('admin_token')) {
    next()
  } else {
    next('/login')
  }
})

export default router
