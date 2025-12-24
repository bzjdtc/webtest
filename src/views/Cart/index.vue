<script setup lang="ts">
import { useCartStore } from '@/stores/cart'
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const cartStore = useCartStore()
const router = useRouter()

// 切换全选状态
const handleCheckAll = (e: Event) => {
  const checked = (e.target as HTMLInputElement).checked
  cartStore.checkAll(checked)
}
</script>

<template>
  <div class="container mx-auto px-4 max-w-7xl py-8 min-h-[600px]">
    <!-- 标题 -->
    <h1 class="text-2xl font-bold mb-6 flex items-center gap-2">
      <ShoppingBag class="w-6 h-6 text-emerald-500"/>
      购物车
    </h1>

    <!-- 空状态 -->
    <div v-if="cartStore.cartList.length === 0" class="bg-white rounded-xl p-12 text-center shadow-sm">
      <div class="w-40 h-40 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <ShoppingBag class="w-16 h-16 text-gray-300" />
      </div>
      <p class="text-gray-500 text-lg mb-6">购物车还是空的，快去逛逛吧~</p>
      <button 
        @click="router.push('/')"
        class="bg-emerald-500 text-white px-8 py-2.5 rounded-full hover:bg-emerald-600 transition shadow-lg shadow-emerald-200"
      >
        去首页逛逛
      </button>
    </div>

    <!-- 购物车列表 -->
    <div v-else class="relative">
      <!-- 表头 -->
      <div class="bg-white rounded-t-xl p-4 grid grid-cols-12 gap-4 text-gray-500 text-sm border-b">
        <div class="col-span-1 text-center">
            <input 
              type="checkbox" 
              :checked="cartStore.isAllSelected" 
              @change="handleCheckAll"
              class="w-4 h-4 text-emerald-500 rounded focus:ring-emerald-500 cursor-pointer"
            >
        </div>
        <div class="col-span-5">商品信息</div>
        <div class="col-span-2 text-center">单价</div>
        <div class="col-span-2 text-center">数量</div>
        <div class="col-span-1 text-center">小计</div>
        <div class="col-span-1 text-center">操作</div>
      </div>

      <!-- 商品列表 -->
      <div class="bg-white rounded-b-xl shadow-sm divide-y">
        <div 
          v-for="item in cartStore.cartList" 
          :key="item.id" 
          class="grid grid-cols-12 gap-4 items-center p-4 hover:bg-gray-50 transition"
        >
          <!-- 勾选框 -->
          <div class="col-span-1 text-center">
            <input 
              type="checkbox" 
              v-model="item.selected"
              class="w-4 h-4 text-emerald-500 rounded focus:ring-emerald-500 cursor-pointer"
            >
          </div>

          <!-- 商品图片与名称 -->
          <div class="col-span-5 flex items-center gap-4">
            <img :src="item.image" class="w-20 h-20 object-cover rounded bg-gray-100 flex-shrink-0">
            <div>
                <h3 class="font-medium text-gray-800 line-clamp-2">{{ item.name }}</h3>
                <span class="text-xs text-gray-400 mt-1 block">规格: 默认</span>
            </div>
          </div>

          <!-- 单价 -->
          <div class="col-span-2 text-center text-gray-600">
            ¥{{ item.price }}
          </div>

          <!-- 数量操作 -->
          <div class="col-span-2 flex justify-center">
            <div class="flex items-center border rounded">
                <button 
                  @click="item.count > 1 && item.count--"
                  class="p-1 hover:bg-gray-100 disabled:opacity-50"
                  :disabled="item.count <= 1"
                >
                    <Minus class="w-4 h-4 text-gray-500"/>
                </button>
                <input 
                  type="text" 
                  v-model.number="item.count"
                  class="w-10 text-center text-sm outline-none"
                  readonly
                >
                <button 
                  @click="item.count++"
                  class="p-1 hover:bg-gray-100"
                >
                    <Plus class="w-4 h-4 text-gray-500"/>
                </button>
            </div>
          </div>

          <!-- 小计 -->
          <div class="col-span-1 text-center text-emerald-600 font-bold">
            ¥{{ (parseFloat(item.price) * item.count).toFixed(2) }}
          </div>

          <!-- 操作 -->
          <div class="col-span-1 text-center">
            <button 
              @click="cartStore.delCart(item.id)"
              class="text-gray-400 hover:text-red-500 transition p-2"
              title="删除"
            >
                <Trash2 class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <!-- 底部结算栏 -->
      <div class="mt-6 bg-white p-4 rounded-xl shadow-lg flex justify-between items-center sticky bottom-4 z-10 border border-gray-100">
        <div class="flex items-center gap-4 text-gray-600">
            <label class="flex items-center gap-2 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  :checked="cartStore.isAllSelected" 
                  @change="handleCheckAll"
                  class="w-4 h-4 text-emerald-500 rounded focus:ring-emerald-500"
                >
                <span>全选</span>
            </label>
            <span class="text-gray-300">|</span>
            <span>已选 <span class="text-emerald-500 font-bold">{{ cartStore.selectedCount }}</span> 件</span>
        </div>
        
        <div class="flex items-center gap-6">
            <div class="text-right">
                <span class="text-gray-600 mr-2">合计:</span>
                <span class="text-2xl font-bold text-red-500">¥{{ cartStore.selectedPrice }}</span>
            </div>
            <!-- 修改处：添加 @click 跳转到 checkout -->
            <button 
                @click="router.push('/checkout')"
                class="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-full font-medium transition shadow-lg shadow-emerald-200"
            >
                去结算
            </button>
        </div>
      </div>
    </div>
  </div>
</template>