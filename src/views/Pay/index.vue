<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOrderStore } from '@/stores/order'
import { CheckCircle2, AlertCircle } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const orderStore = useOrderStore()

const orderInfo = ref<any>(null)
const time = ref(1800) // 30分钟倒计时

// 格式化时间
const formatTime = (s: number) => {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}分${sec < 10 ? '0' + sec : sec}秒`
}

onMounted(() => {
  // 获取订单ID
  const orderId = route.query.orderId as string
  if (orderId) {
    orderInfo.value = orderStore.getOrder(orderId)
  }
  
  // 倒计时
  const timer = setInterval(() => {
    if (time.value > 0) time.value--
    else clearInterval(timer)
  }, 1000)
})

const handlePay = () => {
  if (!orderInfo.value) return
  
  // 更新订单状态为已支付
  orderStore.payOrder(orderInfo.value.id)
  
  // 模拟支付 loading
  const btn = document.getElementById('pay-btn') as HTMLButtonElement
  if(btn) btn.innerText = '支付中...'
  
  setTimeout(() => {
    alert('支付成功！')
    router.replace('/member') // 跳转到个人中心
  }, 1500)
}
</script>

<template>
  <div class="container mx-auto px-4 max-w-7xl py-10">
    <!-- 错误状态 -->
    <div v-if="!orderInfo" class="bg-white rounded-xl p-10 text-center">
        <AlertCircle class="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 class="text-xl font-bold text-gray-600">订单不存在或已失效</h2>
        <button @click="router.push('/')" class="mt-4 text-emerald-500 hover:underline">返回首页</button>
    </div>

    <template v-else>
        <!-- 支付状态 -->
        <div class="bg-white rounded-xl p-10 text-center mb-6 shadow-sm">
        <CheckCircle2 class="w-16 h-16 text-emerald-500 mx-auto mb-4" />
        <h2 class="text-2xl font-bold mb-2">订单提交成功！请尽快完成支付。</h2>
        <p class="text-gray-500 mb-6">支付还剩 <span class="text-red-500 font-mono font-bold">{{ formatTime(time) }}</span>，超时后将取消订单</p>
        
        <div class="flex justify-center items-end gap-2">
            <span class="text-gray-600 mb-1">应付金额：</span>
            <span class="text-red-500 text-3xl font-bold">¥{{ orderInfo.totalMoney }}</span>
        </div>
        </div>

        <!-- 支付方式 -->
        <div class="bg-white rounded-xl p-8 shadow-sm">
        <h3 class="font-bold text-lg mb-6">选择支付方式</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div class="border-2 border-emerald-500 rounded-lg px-6 py-4 cursor-pointer text-emerald-600 font-bold bg-emerald-50 flex items-center justify-center gap-2">
                <span>支付宝支付</span>
                <span class="text-xs bg-red-500 text-white px-1 rounded">推荐</span>
            </div>
            <div class="border border-gray-200 rounded-lg px-6 py-4 cursor-pointer hover:border-emerald-500 flex items-center justify-center text-gray-600">微信支付</div>
            <div class="border border-gray-200 rounded-lg px-6 py-4 cursor-pointer hover:border-emerald-500 flex items-center justify-center text-gray-600">银行卡支付</div>
        </div>
        <div class="text-right border-t pt-6">
            <button 
                id="pay-btn"
                @click="handlePay" 
                class="w-full md:w-auto bg-emerald-500 text-white px-12 py-3.5 rounded-lg hover:bg-emerald-600 font-bold shadow-lg shadow-emerald-200 transition"
            >
                立即支付
            </button>
        </div>
        </div>
    </template>
  </div>
</template>