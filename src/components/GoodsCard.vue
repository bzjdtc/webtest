<script setup lang="ts">
import type { Product } from '@/types'

defineProps<{
    product: Product
}>()

const emit = defineEmits<{
    (e: 'add-cart', product: Product): void
}>()
</script>

<template>
  <div class="bg-white hover:shadow-xl transition-shadow duration-300 rounded-lg overflow-hidden group cursor-pointer">
      <div class="relative overflow-hidden aspect-[1/1]">
          <img :src="product.image" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
      </div>
      <div class="p-4 text-center">
          <h4 class="text-gray-800 truncate mb-2">{{ product.name }}</h4>
          <p class="text-emerald-500 font-bold text-lg">¥{{ product.price }}</p>
          
          <button 
            @click.stop="emit('add-cart', product)"
            class="mt-3 w-full py-2 bg-emerald-50 text-emerald-600 rounded text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity hover:bg-emerald-500 hover:text-white"
          >
            加入购物车
          </button>
      </div>
  </div>
</template>