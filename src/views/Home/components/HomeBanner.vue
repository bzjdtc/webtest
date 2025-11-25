<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { BannerItem } from '@/types'



const imageModules = import.meta.glob<{ default: string }>('@/assets/content/banner*', { eager: true })


// ✅ 构建轮播图列表（自动处理图片路径）

const list = ref<BannerItem[]>(Object.values(imageModules).map((img, index) => ({

  id: index + 1,          // 1, 2, 3...

  imgUrl: img.default      // Vite 处理后的图片路径（如 /assets/banner1.abc123.jpg）

})))

const active = ref(0)
let timer: any = null

const autoPlay = () => {
    timer = setInterval(() => {
        active.value = (active.value + 1) % list.value.length
    }, 3000)
}

onMounted(() => autoPlay())
onUnmounted(() => clearInterval(timer))
</script>

<template>
  <div class="relative h-[500px] bg-gray-100 group overflow-hidden">
      <!-- 图片 -->
      <div 
        v-for="(item, i) in list" 
        :key="item.id"
        class="absolute inset-0 transition-opacity duration-500"
        :class="active === i ? 'opacity-100 z-10' : 'opacity-0 z-0'"
      >
          <img :src="item.imgUrl" class="w-full h-full object-cover">
      </div>

      <!-- 指示点 -->
      <div class="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          <span 
            v-for="(item, i) in list" 
            :key="item.id"
            class="w-3 h-3 rounded-full cursor-pointer transition-all"
            :class="active === i ? 'bg-white w-8' : 'bg-white/50'"
            @click="active = i"
          ></span>
      </div>
  </div>
</template>