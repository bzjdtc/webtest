<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useUserStore } from '@/stores/user'
import { useOrderStore, type Address } from '@/stores/order'
import { 
  Package, 
  User, 
  MapPin, 
  LogOut, 
  Plus, 
  Pencil, 
  Trash2, 
  CheckCircle2, 
  X,
  CreditCard,
  ShieldCheck
} from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const orderStore = useOrderStore()
const router = useRouter()
const userInfo = userStore.userInfo

// 当前激活的选项卡: 'profile' | 'orders' | 'address'
const activeTab = ref('profile')

// --- 地址管理逻辑 ---
const showAddressModal = ref(false)
const isEdit = ref(false)
const currentAddressId = ref('')

const addressForm = reactive({
  receiver: '',
  phone: '',
  address: '',
  isDefault: false
})

const resetForm = () => {
  addressForm.receiver = ''
  addressForm.phone = ''
  addressForm.address = ''
  addressForm.isDefault = false
  isEdit.value = false
  currentAddressId.value = ''
}

const openAddModal = () => {
  resetForm()
  showAddressModal.value = true
}

const openEditModal = (addr: Address) => {
  isEdit.value = true
  currentAddressId.value = addr.id
  addressForm.receiver = addr.receiver
  addressForm.phone = addr.phone
  addressForm.address = addr.address
  addressForm.isDefault = addr.isDefault
  showAddressModal.value = true
}

const saveAddress = () => {
  if (!addressForm.receiver || !addressForm.phone || !addressForm.address) {
    return alert('请填写完整信息')
  }

  if (isEdit.value) {
    orderStore.updateAddress(currentAddressId.value, { ...addressForm })
  } else {
    orderStore.addAddress({ ...addressForm })
  }
  showAddressModal.value = false
}

const removeAddress = (id: string) => {
  if (confirm('确定要删除该地址吗？')) {
    orderStore.deleteAddress(id)
  }
}

// --- 订单相关 ---
type OrderStatus = 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled'

const statusMap: Record<OrderStatus, { label: string, color: string }> = {
  pending: { label: '待支付', color: 'text-red-500' },
  paid: { label: '待发货', color: 'text-emerald-500' },
  shipped: { label: '已发货', color: 'text-blue-500' },
  completed: { label: '已完成', color: 'text-gray-500' },
  cancelled: { label: '已取消', color: 'text-gray-400' }
}

const getStatusInfo = (status: string) => {
  return statusMap[status as OrderStatus] || { label: '未知状态', color: 'text-gray-500' }
}

const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}


</script>

<template>
  <div class="container mx-auto px-4 max-w-7xl py-10 flex flex-col md:flex-row gap-6 min-h-[80vh]">
    <!-- 侧边栏导航 -->
    <aside class="w-full md:w-64 bg-white rounded-2xl p-6 h-fit shadow-sm border border-gray-100">
      <div class="text-center border-b border-gray-100 pb-6 mb-4">
        <div class="relative w-20 h-20 mx-auto mb-3">
          <img :src="userInfo?.avatar" class="w-full h-full rounded-full border-2 border-emerald-100 p-1 object-cover">
          <div class="absolute bottom-0 right-0 bg-emerald-500 text-white p-1 rounded-full border-2 border-white">
            <ShieldCheck class="w-3 h-3" />
          </div>
        </div>
        <h3 class="font-bold text-lg text-gray-800">{{ userInfo?.account || '未登录' }}</h3>
        <p class="text-xs text-emerald-500 font-medium mt-1 bg-emerald-50 inline-block px-2 py-0.5 rounded">黄金会员</p>
      </div>
      <nav class="space-y-1">
        <button 
          @click="activeTab = 'profile'"
          :class="[activeTab === 'profile' ? 'bg-emerald-50 text-emerald-600' : 'text-gray-600 hover:bg-gray-50']"
          class="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition"
        >
          <User class="w-5 h-5" /> 个人信息
        </button>
        <button 
          @click="activeTab = 'orders'"
          :class="[activeTab === 'orders' ? 'bg-emerald-50 text-emerald-600' : 'text-gray-600 hover:bg-gray-50']"
          class="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition"
        >
          <Package class="w-5 h-5" /> 我的订单
        </button>
        <button 
          @click="activeTab = 'address'"
          :class="[activeTab === 'address' ? 'bg-emerald-50 text-emerald-600' : 'text-gray-600 hover:bg-gray-50']"
          class="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition"
        >
          <MapPin class="w-5 h-5" /> 地址管理
        </button>
        <button @click="handleLogout" class="w-full flex items-center gap-3 text-gray-400 hover:text-red-500 px-4 py-3 rounded-xl transition mt-4 border-t border-gray-50">
          <LogOut class="w-5 h-5" /> 退出登录
        </button>
      </nav>
    </aside>

    <!-- 主内容区 -->
    <main class="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      
      <!-- 1. 个人信息面板 -->
      <section v-if="activeTab === 'profile'" class="p-8 animate-fade-in">
        <h2 class="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-2">
           个人中心
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="space-y-6">
            <div class="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <label class="text-xs text-gray-400 font-bold uppercase tracking-wider block mb-1">用户账号</label>
              <div class="text-lg font-medium text-gray-800">{{ userInfo?.account }}</div>
            </div>
            <div class="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <label class="text-xs text-gray-400 font-bold uppercase tracking-wider block mb-1">手机号码</label>
              <div class="text-lg font-medium text-gray-800">138****8888</div>
            </div>
            <div class="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100">
              <label class="text-xs text-emerald-600 font-bold uppercase tracking-wider block mb-1">会员权益</label>
              <div class="flex items-center gap-2 text-emerald-700 font-bold">
                <CreditCard class="w-5 h-5" /> 尊享全场 9.5 折优惠
              </div>
            </div>
          </div>
          <div class="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-100 flex flex-col items-center justify-center text-center">
            <div class="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
               <ShieldCheck class="w-8 h-8" />
            </div>
            <h4 class="font-bold text-gray-800 mb-2">账户安全级别：极高</h4>
            <p class="text-gray-400 text-sm mb-6">您的账户已绑定手机和邮箱，资金安全受实时保护</p>
            <button class="px-6 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium hover:bg-gray-50 transition">修改登录密码</button>
          </div>
        </div>
      </section>

      <!-- 2. 我的订单面板 -->
      <section v-if="activeTab === 'orders'" class="p-8 animate-fade-in">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-2xl font-bold text-gray-800">最近订单</h2>
          <div class="flex gap-4 text-sm font-medium">
            <button class="text-emerald-600 relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-emerald-500">全部</button>
            <button class="text-gray-400 hover:text-emerald-500">待支付</button>
            <button class="text-gray-400 hover:text-emerald-500">待收货</button>
          </div>
        </div>
        
        <div v-if="orderStore.orderList.length === 0" class="text-center py-24 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
          <Package class="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <p class="text-gray-400">暂无相关订单记录</p>
          <button @click="router.push('/')" class="mt-4 text-emerald-500 font-medium hover:underline">去逛逛</button>
        </div>

        <div v-else class="space-y-6">
          <div v-for="order in orderStore.orderList" :key="order.id" class="border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
            <div class="bg-gray-50/80 px-6 py-3 flex justify-between items-center text-xs">
              <span class="text-gray-500 font-medium">下单时间：{{ order.createTime }} <span class="mx-2">|</span> 订单号：{{ order.id }}</span>
              <span 
                :class="getStatusInfo(order.status).color" 
                class="font-bold bg-white px-3 py-1 rounded-full border border-current opacity-80 scale-90"
              >
                {{ getStatusInfo(order.status).label }}
              </span>
            </div>
            <div class="p-6">
              <div class="flex flex-col md:flex-row gap-8 items-center">
                <div class="flex-1 flex gap-3 overflow-x-auto no-scrollbar py-2">
                  <div v-for="item in order.goods" :key="item.id" class="group relative flex-shrink-0">
                    <img :src="item.image" class="w-20 h-20 rounded-xl object-cover border border-gray-100 group-hover:opacity-75 transition">
                    <span class="absolute -bottom-1 -right-1 bg-black/60 text-white text-[10px] px-1.5 rounded-md">x{{ item.count }}</span>
                  </div>
                </div>
                <div class="flex items-center gap-8 pl-8 md:border-l border-gray-100">
                  <div class="text-right">
                    <p class="text-[10px] text-gray-400 uppercase font-bold mb-1">应付总额</p>
                    <p class="text-xl font-black text-red-500">¥{{ order.totalMoney }}</p>
                  </div>
                  <button v-if="order.status === 'pending'" @click="router.push(`/pay?orderId=${order.id}`)" class="bg-emerald-500 text-white px-6 py-2 rounded-xl font-bold hover:bg-emerald-600 transition shadow-lg shadow-emerald-100">
                    去支付
                  </button>
                </div>
              </div>
              <div class="mt-4 pt-4 border-t border-gray-50 flex items-center gap-2 text-xs text-gray-400">
                <MapPin class="w-3 h-3" />
                <span>收货地址：{{ order.receiver }} - {{ order.address }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 3. 地址管理面板 -->
      <section v-if="activeTab === 'address'" class="p-8 animate-fade-in">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="text-2xl font-bold text-gray-800">地址管理</h2>
            <p class="text-sm text-gray-400 mt-1">最多可保存 10 条常用收货地址</p>
          </div>
          <button 
            @click="openAddModal"
            class="flex items-center gap-2 bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-emerald-600 transition shadow-lg shadow-emerald-100"
          >
            <Plus class="w-5 h-5" /> 新增地址
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            v-for="addr in orderStore.addressList" 
            :key="addr.id" 
            class="group p-6 border rounded-2xl relative hover:border-emerald-200 hover:shadow-sm transition-all bg-white"
            :class="addr.isDefault ? 'border-emerald-500 bg-emerald-50/10' : 'border-gray-100'"
          >
            <div v-if="addr.isDefault" class="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] px-3 py-1 rounded-bl-xl font-bold">
              默认地址
            </div>

            <div class="flex items-start gap-4">
              <div class="p-3 bg-gray-50 rounded-xl text-gray-400 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition">
                <MapPin class="w-6 h-6" />
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-1">
                  <span class="font-bold text-gray-800">{{ addr.receiver }}</span>
                  <span class="text-gray-500 text-sm font-medium">{{ addr.phone }}</span>
                </div>
                <p class="text-gray-500 text-sm leading-relaxed mb-4 min-h-[40px]">{{ addr.address }}</p>
                
                <div class="flex items-center gap-4 border-t border-gray-50 pt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button @click="openEditModal(addr)" class="flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700">
                    <Pencil class="w-3 h-3" /> 编辑
                  </button>
                  <button @click="removeAddress(addr.id)" class="flex items-center gap-1 text-xs font-bold text-red-400 hover:text-red-500">
                    <Trash2 class="w-3 h-3" /> 删除
                  </button>
                  <button 
                    v-if="!addr.isDefault" 
                    @click="orderStore.setDefaultAddress(addr.id)"
                    class="ml-auto text-xs font-medium text-gray-400 hover:text-emerald-500"
                  >
                    设为默认
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 缺省页 -->
        <div v-if="orderStore.addressList.length === 0" class="text-center py-20 text-gray-400">
           暂时没有保存的地址
        </div>
      </section>

    </main>

    <!-- 地址编辑模态框 (Modal) -->
    <div v-if="showAddressModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="showAddressModal = false"></div>
      <div class="bg-white rounded-3xl w-full max-w-md relative z-10 shadow-2xl overflow-hidden animate-fade-in">
        <div class="px-8 py-6 border-b border-gray-50 flex justify-between items-center">
          <h3 class="text-xl font-bold text-gray-800">{{ isEdit ? '编辑收货地址' : '新增收货地址' }}</h3>
          <button @click="showAddressModal = false" class="text-gray-400 hover:text-gray-600"><X class="w-6 h-6" /></button>
        </div>
        <div class="p-8 space-y-5">
          <div class="space-y-1.5">
            <label class="text-xs font-bold text-gray-400 uppercase ml-1">收货人姓名</label>
            <input v-model="addressForm.receiver" type="text" placeholder="请输入姓名" class="w-full px-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-500 outline-none transition">
          </div>
          <div class="space-y-1.5">
            <label class="text-xs font-bold text-gray-400 uppercase ml-1">联系电话</label>
            <input v-model="addressForm.phone" type="tel" placeholder="请输入手机号" class="w-full px-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-500 outline-none transition">
          </div>
          <div class="space-y-1.5">
            <label class="text-xs font-bold text-gray-400 uppercase ml-1">详细地址</label>
            <textarea v-model="addressForm.address" rows="3" placeholder="请输入省市区街道详细地址" class="w-full px-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-500 outline-none transition resize-none"></textarea>
          </div>
          <label class="flex items-center gap-3 cursor-pointer group py-2">
            <div class="relative">
              <input type="checkbox" v-model="addressForm.isDefault" class="sr-only">
              <div class="w-5 h-5 border-2 rounded-md transition-all flex items-center justify-center" :class="addressForm.isDefault ? 'bg-emerald-500 border-emerald-500' : 'border-gray-200 bg-white group-hover:border-emerald-300'">
                <CheckCircle2 v-if="addressForm.isDefault" class="w-3 h-3 text-white" />
              </div>
            </div>
            <span class="text-sm font-medium text-gray-600">设为默认收货地址</span>
          </label>
        </div>
        <div class="px-8 pb-8 flex gap-3">
          <button @click="showAddressModal = false" class="flex-1 py-3 border border-gray-100 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition">取消</button>
          <button @click="saveAddress" class="flex-[2] py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition shadow-lg shadow-emerald-100">保存并使用</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}
.no-scrollbar::-webkit-scrollbar { display: none; }
</style>