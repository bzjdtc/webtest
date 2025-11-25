<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, watch } from 'vue'
import GoodsCard from '@/components/GoodsCard.vue'
import { useCartStore } from '@/stores/cart'
import type { Product } from '@/types'

const route = useRoute()
const cartStore = useCartStore()
const list = ref<Product[]>([])

// 模拟根据分类ID获取数据
const getCategoryData = (id: string) => {
    // 实际应调用API
    console.log('Fetching data for category:', id)
    list.value = Array.from({ length: 8 }).map((_, i) => ({
        id: Date.now() + i,
        name: `${id === 'fresh' ? '生鲜' : '美食'}商品 - ${i + 1}`,
        price: (Math.random() * 100 + 10).toFixed(2),
        image: id === 'fresh' 
            ? 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=400&q=80'
            : 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80'
    }))
}

// 监听路由参数变化
watch(() => route.params.id, (newId) => {
    if(newId) getCategoryData(newId as string)
}, { immediate: true })

</script>

<template>
  <div class="container mx-auto px-4 max-w-7xl py-10">
      <div class="bg-white p-6 rounded-lg mb-6">
          <h1 class="text-2xl font-bold text-gray-800 capitalize">{{ route.params.id }} 专区</h1>
          <p class="text-gray-500 text-sm mt-2">全场包邮，低价特惠</p>
      </div>
      
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <GoodsCard 
            v-for="item in list" 
            :key="item.id" 
            :product="item" 
            @add-cart="cartStore.addCart"
          />
      </div>
  </div>
</template>