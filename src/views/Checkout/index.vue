<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useOrderStore } from '@/stores/order'
import { useRouter } from 'vue-router'
import { MapPin, ChevronRight, Truck, CreditCard } from 'lucide-vue-next'

const cartStore = useCartStore()
const orderStore = useOrderStore()
const router = useRouter()

// 结算商品：仅获取选中的商品
const checkoutItems = computed(() => cartStore.cartList.filter(item => item.selected))

// --- 修改点：地址逻辑从 OrderStore 获取 ---
// 默认选中地址：优先找标记为 isDefault 的，否则找第一个
const activeAddress = ref(
  orderStore.addressList.find(a => a.isDefault) || orderStore.addressList[0]
)

// 切换地址的简单实现（如果需要切换，可以弹窗选择地址列表中的其他项）
const switchAddress = (addr: any) => {
  activeAddress.value = addr
}

const submitOrder = () => {
  if (!activeAddress.value) {
    return alert('请先去个人中心添加收货地址')
  }
  
  const goods = checkoutItems.value.map(item => ({
    id: item.id,
    name: item.name,
    image: item.image,
    price: item.price,
    count: item.count
  }))

  // 创建订单并传递当前选中的地址信息
  const orderId = orderStore.createOrder(
    goods,
    cartStore.selectedPrice,
    {
      address: activeAddress.value.address,
      receiver: activeAddress.value.receiver,
      phone: activeAddress.value.phone
    }
  )

  // 清空购物车中已购买的商品
  checkoutItems.value.forEach(item => {
    cartStore.delCart(item.id)
  })

  // 跳转到支付页
  router.replace({ path: '/pay', query: { orderId } })
}
</script>

<template>
  <div class="bg-gray-50 min-h-screen py-12">
    <div class="container mx-auto px-4 max-w-5xl">
      <h1 class="text-2xl font-bold text-gray-800 mb-8">填写并核对订单信息</h1>

      <div class="space-y-6">
        <!-- 收货地址模块：现在是响应式的 -->
        <section class="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-bold flex items-center gap-2">
              <MapPin class="w-5 h-5 text-emerald-500" /> 收货人信息
            </h3>
            <button @click="router.push('/member')" class="text-sm text-emerald-500 hover:underline">管理地址</button>
          </div>

          <!-- 地址展示 -->
          <div v-if="orderStore.addressList.length > 0">
            <div 
              v-for="addr in orderStore.addressList" 
              :key="addr.id"
              @click="activeAddress = addr"
              class="relative border-2 rounded-xl p-5 cursor-pointer transition-all mb-3 last:mb-0"
              :class="activeAddress?.id === addr.id ? 'border-emerald-500 bg-emerald-50/30' : 'border-gray-100 hover:border-gray-200'"
            >
              <div class="flex items-center justify-between">
                <div>
                  <div class="flex items-center gap-3 mb-2">
                    <span class="font-bold text-gray-800">{{ addr.receiver }}</span>
                    <span class="text-gray-500">{{ addr.phone }}</span>
                    <span v-if="addr.isDefault" class="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded">默认</span>
                  </div>
                  <p class="text-gray-500 text-sm">{{ addr.address }}</p>
                </div>
                <div v-if="activeAddress?.id === addr.id" class="text-emerald-500">
                  <CheckCircle2 class="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-6">
            <p class="text-gray-400 mb-4">还没有收货地址</p>
            <button @click="router.push('/member')" class="bg-emerald-500 text-white px-6 py-2 rounded-lg font-bold">去添加地址</button>
          </div>
        </section>

        <!-- 商品清单 -->
        <section class="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h3 class="text-lg font-bold mb-6 flex items-center gap-2">
            <Package class="w-5 h-5 text-emerald-500" /> 商品清单
          </h3>
          <div class="divide-y divide-gray-50">
            <div v-for="item in checkoutItems" :key="item.id" class="py-4 flex items-center gap-4">
              <img :src="item.image" class="w-20 h-20 rounded-lg object-cover border">
              <div class="flex-1">
                <h4 class="font-medium text-gray-800">{{ item.name }}</h4>
                <p class="text-gray-400 text-sm mt-1">数量：{{ item.count }}</p>
              </div>
              <div class="text-right">
                <p class="font-bold text-gray-800">¥{{ (Number(item.price) * item.count).toFixed(2) }}</p>
                <p class="text-xs text-gray-400">单价: ¥{{ item.price }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- 支付方式 -->
        <section class="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h3 class="text-lg font-bold mb-6">支付方式</h3>
          <div class="flex gap-4">
            <button class="flex-1 border-2 border-emerald-500 bg-emerald-50/50 rounded-xl p-4 flex flex-col items-center gap-2">
              <CreditCard class="w-6 h-6 text-emerald-500" />
              <span class="text-sm font-bold">在线支付</span>
            </button>
            <button class="flex-1 border-2 border-gray-100 rounded-xl p-4 flex flex-col items-center gap-2 opacity-50 cursor-not-allowed">
              <Truck class="w-6 h-6 text-gray-400" />
              <span class="text-sm font-bold text-gray-400">货到付款</span>
            </button>
          </div>
        </section>

        <!-- 提交栏 -->
        <div class="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div class="text-gray-500 text-sm">
            应付总额：<span class="text-3xl font-black text-red-500 ml-2">¥{{ cartStore.selectedPrice }}</span>
          </div>
          <div class="flex items-center gap-4 w-full md:w-auto">
            <button @click="router.push('/cart')" class="flex-1 md:flex-none px-8 py-3 text-gray-400 font-bold">返回购物车</button>
            <button @click="submitOrder" class="flex-1 md:flex-none bg-emerald-500 text-white px-12 py-4 rounded-2xl font-bold hover:bg-emerald-600 transition shadow-lg shadow-emerald-100">
              提交订单
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>