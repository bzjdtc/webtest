<script setup lang="ts">
import { ref } from 'vue'
import HomeBanner from './components/HomeBanner.vue'
import GoodsCard from '@/components/GoodsCard.vue'
import { useCartStore } from '@/stores/cart'
import type { Product } from '@/types'

const cartStore = useCartStore()

const imageModules = import.meta.glob<{ default: string }>(
  '@/assets/content/fresh*.webp',
  { eager: true }
)



// ✅ 定义固定的产品信息（名称和价格）

const fixedProducts = [

  { id: 1, name: '智利车厘子 5kg', price: '299.00' },

  { id: 2, name: '新鲜红心火龙果', price: '19.90' },

  { id: 3, name: '海南贵妃芒', price: '39.90' },

  { id: 4, name: '云南蓝莓', price: '15.80' }

]



const sortedImages = Object.values(imageModules).sort((a, b) => {

  const idA = parseInt(a.default.match(/fresh(\d+)\./)?.[1] || '0')

  const idB = parseInt(b.default.match(/fresh(\d+)\./)?.[1] || '0')

  return idA - idB

})
// ✅ 构建最终的产品列表（图片路径从本地导入）

const products = ref<Product[]>(fixedProducts.map((item, index) => ({
  id: item.id,
  name: item.name,
  price: item.price,
  // 使用 ! 断言 sortedImages[index] 存在且非空
  image: sortedImages[index]!.default // 注意：这里可能还需要解决 index 越界问题
})))


</script>

<template>
  <div class="pb-10">
      <div class="container mx-auto px-4 max-w-7xl mt-6 rounded-lg overflow-hidden">
        <HomeBanner />
      </div>

      <section class="container mx-auto px-4 max-w-7xl mt-10">
          <h2 class="text-3xl font-light mb-8">新鲜好物</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
              <GoodsCard 
                v-for="item in products" 
                :key="item.id" 
                :product="item"
                @add-cart="cartStore.addCart"
              />
          </div>
      </section>
  </div>
</template>