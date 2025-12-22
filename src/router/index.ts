import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '@/views/Layout/index.vue'
import Login from '@/views/Login/index.vue'
import Music from '@/views/Music/MusicPlayer.vue'
import Cart from '@/views/Cart/index.vue'
import Signin from '@/views/Signin/index.vue'

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
    },
    {
      path: '/cart',
      name: 'Cart',
      component: Cart
    },
    { path: '/signin',
      name: 'Signin',
      component: Signin  
    }
  ],
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router