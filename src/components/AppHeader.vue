<script setup lang="ts">
import { ref } from 'vue'
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

// 搜索框逻辑
const searchQuery = ref('')
const handleSearch = () => {
  if (!searchQuery.value.trim()) return

  console.log('正在搜索:', searchQuery.value)
  router.push({
    path: '/category/all',
    query: { q: searchQuery.value }
  })
  // 搜索后清空输入框
  searchQuery.value = ''
}

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
                    <!-- Search Bar (搜索框) -->
        <div class="flex-1 max-w-md mx-8 hidden md:block">
            <div class="relative group">
                <input 
                    v-model="searchQuery"
                    type="text" 
                    placeholder="搜一搜新鲜好物..." 
                    @keyup.enter="handleSearch"
                    class="w-full bg-gray-100 border-transparent focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 rounded-full py-2 pl-10 pr-4 transition-all outline-none text-sm"
                >
                <Search 
                    class="absolute left-3 top-2.5 w-4 h-4 text-gray-400 group-focus-within:text-emerald-500 transition-colors cursor-pointer" 
                    @click="handleSearch"
                />
            </div>
        </div>

            <!-- 购物车 -->
            <div class="relative cursor-pointer group" @click="router.push('/cart')">
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
                    <router-link to="/signin" class="text-gray-500 hover:text-gray-800">免费注册</router-link>
                    <!-- <a href="#" class="text-gray-500 hover:text-gray-800">免费注册</a> -->
                </template>
            </div>
        </div>
    </div>
  </header>
</template>
