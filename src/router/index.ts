import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '@/views/Layout/index.vue'
import Login from '@/views/Login/index.vue'
import Music from '@/views/Music/MusicPlayer.vue'


const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Layout,
      children: [
        { path: '', name: 'Home', component: () => import('@/views/Home/index.vue') },
        { path: 'category/:id', name: 'Category', component: () => import('@/views/Category/index.vue') }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/music',
      name: 'Music',
      component: Music
    }
  ],
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router