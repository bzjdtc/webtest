<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'
import { useCartStore } from '@/stores/cart'
import { ShoppingCart, LogOut} from 'lucide-vue-next'
import { useRouter } from 'vue-router'

import logoImg from '@/assets/ui/logo.png' 

const userStore = useUserStore()
const cartStore = useCartStore()
const router = useRouter()

const { userInfo } = storeToRefs(userStore)

const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}
</script>

<template>
  <header class="sticky top-0 z-50 bg-white/95 backdrop-blur shadow-sm border-b border-gray-100">
    <div class="container mx-auto px-4 max-w-7xl py-4 flex items-center justify-between">
        <!-- Logo -->
        <router-link to="/" class="flex items-center space-x-2">
            <img :src="logoImg" alt="Logo" class="w-90 h-90 object-contain" />
        </router-link>

        <!-- Nav -->
        <nav class="hidden md:flex space-x-8">
            <router-link to="/" class="text-base font-medium hover:text-emerald-500" active-class="text-emerald-500">首页</router-link>
            <router-link to="/category/fresh" class="text-base font-medium hover:text-emerald-500" active-class="text-emerald-500">生鲜</router-link>
            <router-link to="/category/food" class="text-base font-medium hover:text-emerald-500" active-class="text-emerald-500">美食</router-link>
        </nav>

        <!-- User Actions -->
        <div class="flex items-center gap-6">
            <!-- 搜索框 (省略...) -->

            <!-- 购物车 -->
            <div class="relative cursor-pointer group">
                <ShoppingCart class="w-6 h-6 text-gray-600 hover:text-emerald-500" />
                <span v-if="cartStore.totalCount > 0" class="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    {{ cartStore.totalCount }}
                </span>
            </div>

            <!-- 用户信息/登录 -->
            <div class="flex items-center gap-3 text-sm">
                <template v-if="userInfo">
                    <div class="flex items-center gap-2 text-gray-600 hover:text-emerald-500 cursor-pointer">
                        <img :src="userInfo.avatar" class="w-8 h-8 rounded-full border border-gray-200">
                        <span>{{ userInfo.account }}</span>
                    </div>
                    <button @click="handleLogout" class="text-gray-400 hover:text-gray-600 flex items-center gap-1">
                        <LogOut class="w-4 h-4" /> 退出
                    </button>
                </template>
                <template v-else>
                    <router-link to="/login" class="text-emerald-500 font-medium hover:underline">请先登录</router-link>
                    <span class="text-gray-300">|</span>
                    <a href="#" class="text-gray-500 hover:text-gray-800">免费注册</a>
                </template>
            </div>
        </div>
    </div>
  </header>
</template>
