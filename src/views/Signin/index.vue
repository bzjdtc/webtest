<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { Sprout, ArrowLeft } from 'lucide-vue-next'

const userStore = useUserStore()
const router = useRouter()

const form = ref({ 
  account: '', 
  password: '', 
  confirmPassword: '',
  agree: false 
})

const errorMsg = ref('')
const loading = ref(false)

const handleRegister = async () => {
  // 1. 账号非空校验
  if (!form.value.account.trim()) {
    return errorMsg.value = '请输入账号名称'
  }

  // 2. 密码长度校验 (6-20位)
  const pwdLen = form.value.password.length
  if (pwdLen < 6 || pwdLen > 20) {
    return errorMsg.value = '密码长度必须在 6 到 20 位之间'
  }

  // 3. 两次密码一致性校验
  if (form.value.password !== form.value.confirmPassword) {
    return errorMsg.value = '两次输入的密码不一致'
  }

  // 4. 协议勾选校验
  if (!form.value.agree) {
    return errorMsg.value = '请先同意注册协议'
  }
  
  loading.value = true
  errorMsg.value = ''
  
  try {
    await userStore.register(form.value.account, form.value.password)
    // 注册成功跳转登录
    router.push('/login')
  } catch (e: any) {
    errorMsg.value = e.msg
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-emerald-50 flex items-center justify-center p-4">
    <div class="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden">
      <!-- 头部装饰 -->
      <div class="bg-emerald-500 p-8 text-white text-center relative">
        <button @click="router.push('/login')" class="absolute left-4 top-4 hover:bg-emerald-600 p-1 rounded transition">
          <ArrowLeft class="w-5 h-5" />
        </button>
        <Sprout class="w-12 h-12 mx-auto mb-2" />
        <h1 class="text-2xl font-bold">加入小兔鲜儿</h1>
        <p class="text-emerald-100 text-sm mt-1">创建您的账户，开启高品质生鲜之旅</p>
      </div>

      <!-- 表单区域 -->
      <div class="p-8">
        <div class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">账号名称</label>
            <input 
              v-model="form.account" 
              type="text" 
              placeholder="请输入账号" 
              class="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">设置密码</label>
            <input 
              v-model="form.password" 
              type="password" 
              placeholder="6-20位字符" 
              class="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">确认密码</label>
            <input 
              v-model="form.confirmPassword" 
              type="password" 
              placeholder="请再次输入密码" 
              class="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition"
            >
          </div>

          <div v-if="errorMsg" class="text-red-500 text-xs py-1 animate-pulse font-medium">
            ⚠️ {{ errorMsg }}
          </div>

          <div class="flex items-start gap-2">
            <input v-model="form.agree" type="checkbox" id="reg-agree" class="mt-1 accent-emerald-500 cursor-pointer">
            <label for="reg-agree" class="text-xs text-gray-500 leading-relaxed cursor-pointer select-none">
              同意并接受《服务条款》、《隐私权政策》以及《小兔鲜儿平台服务协议》
            </label>
          </div>

          <button 
            @click="handleRegister" 
            :disabled="loading"
            class="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-lg shadow-lg shadow-emerald-100 transition disabled:opacity-50"
          >
            {{ loading ? '注册中...' : '立即注册' }}
          </button>

          <div class="text-center text-sm text-gray-500">
            已有账号？
            <router-link to="/login" class="text-emerald-500 font-bold hover:underline">立即登录</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>