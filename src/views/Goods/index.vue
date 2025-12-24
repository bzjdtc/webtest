<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { ref, watch, onMounted } from 'vue'
import { useCartStore } from '@/stores/cart'
import { ShoppingCart, Truck, ShieldCheck, Clock } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()

const info = ref({
  id: '',
  name: '',
  price: '0.00',
  desc: '',
  mainImage: '',
  images: [] as string[]
})

// 模拟获取商品详情
const loadData = () => {
  const id = route.params.id as string
  // 基于 ID 生成一些随机差异，模拟不同商品
  const isFresh = id.includes('fresh') || parseInt(id) % 2 === 0
  
  info.value = {
    id,
    name: isFresh ? `精选冷链鲜果大礼包 ${id}` : `进口零食美味组合 ${id}`,
    price: (Math.floor(Math.random() * 200) + 50).toFixed(2),
    desc: isFresh ? '产地直供，全程冷链，保证新鲜口感。' : '全球甄选，美味直达，休闲时刻伴侣。',
    mainImage: isFresh 
      ? 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=80'
      : 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=200&q=80',
      'https://images.unsplash.com/photo-1528821128474-27f963b062bf?auto=format&fit=crop&w=200&q=80',
      'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=200&q=80',
      'https://images.unsplash.com/photo-1528821128474-27f963b062bf?auto=format&fit=crop&w=200&q=80'
    ]
  }
}

onMounted(loadData)
watch(() => route.params.id, loadData)

// 加入购物车
const addToCart = (isBuyNow = false) => {
  cartStore.addCart({
    id: info.value.id,
    name: info.value.name,
    price: info.value.price,
    image: info.value.mainImage
  })
  
  if (isBuyNow) {
    // 立即购买：先加购，然后跳转购物车（或者直接去结算页，这里简化为去购物车选中）
    router.push('/cart')
  } else {
    alert('加入购物车成功')
  }
}
</script>

<template>
  <div class="container mx-auto px-4 max-w-7xl py-10">
    <!-- 面包屑 -->
    <div class="flex items-center text-sm text-gray-500 mb-8">
      <router-link to="/" class="hover:text-emerald-500">首页</router-link>
      <span class="mx-2">/</span>
      <span class="text-gray-900">{{ info.name }}</span>
    </div>

    <div class="bg-white rounded-xl p-8 flex flex-col md:flex-row gap-12 shadow-sm">
      <!-- 图片区 -->
      <div class="w-full md:w-1/2">
        <div class="aspect-square bg-gray-50 rounded-lg overflow-hidden mb-4 border border-gray-100">
          <img :src="info.mainImage" class="w-full h-full object-cover">
        </div>
        <div class="grid grid-cols-4 gap-4">
          <img v-for="(img, i) in info.images" :key="i" :src="img" 
               class="w-full aspect-square object-cover rounded cursor-pointer border-2 border-transparent hover:border-emerald-500 transition">
        </div>
      </div>
      
      <!-- 信息区 -->
      <div class="w-full md:w-1/2 flex flex-col">
        <h1 class="text-3xl font-bold text-gray-800 mb-4">{{ info.name }}</h1>
        <p class="text-gray-500 mb-6 leading-relaxed">{{ info.desc }}</p>
        
        <div class="bg-emerald-50/50 p-6 rounded-lg mb-8">
            <p class="text-sm text-gray-500 mb-1">销售价</p>
            <p class="text-4xl text-red-500 font-bold">¥{{ info.price }}</p>
        </div>

        <!-- 服务标签 -->
        <div class="flex gap-6 mb-8 text-sm text-gray-500">
            <span class="flex items-center gap-1"><Truck class="w-4 h-4"/> 全场包邮</span>
            <span class="flex items-center gap-1"><ShieldCheck class="w-4 h-4"/> 品质保证</span>
            <span class="flex items-center gap-1"><Clock class="w-4 h-4"/> 48小时发货</span>
        </div>
        
        <div class="flex gap-4 mt-auto">
          <button @click="addToCart(false)" class="flex-1 bg-emerald-500 text-white px-8 py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-600 transition shadow-lg shadow-emerald-200 font-bold">
            <ShoppingCart class="w-5 h-5"/> 加入购物车
          </button>
          <button @click="addToCart(true)" class="flex-1 bg-emerald-50 text-emerald-600 px-8 py-4 rounded-xl hover:bg-emerald-100 transition font-bold border border-emerald-200">
            立即购买
          </button>
        </div>
      </div>
    </div>
  </div>
</template>