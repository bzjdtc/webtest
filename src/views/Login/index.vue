<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { Sprout } from 'lucide-vue-next'

const userStore = useUserStore()
const router = useRouter()

const form = ref({ account: '', password: '', agree: false })
const errorMsg = ref('')
const loading = ref(false)

const handleLogin = async () => {
  if (!form.value.agree) return errorMsg.value = '请先同意隐私条款'
  if (!form.value.account || !form.value.password) return errorMsg.value = '请输入账号密码'
  
  loading.value = true
  errorMsg.value = ''
  
  try {
    await userStore.login(form.value.account, form.value.password)
    router.push('/') // 登录成功跳转首页
  } catch (e: any) {
    errorMsg.value = e.msg
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex relative">
    <!-- 背景装饰 -->
    <div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497250681960-ef047c08a56e?q=80&w=2574')] bg-cover bg-center opacity-10"></div>

    <section class="relative w-full max-w-5xl mx-auto flex items-center justify-center px-4">
      <div class="bg-white shadow-2xl rounded-2xl overflow-hidden flex w-full max-w-4xl h-[500px]">
        
        <!-- 左侧海报 -->
        <div class="w-1/2 hidden md:flex flex-col justify-between bg-emerald-500 p-10 text-white relative overflow-hidden">
          <div class="z-10">
             <div class="flex items-center gap-2 text-2xl font-bold mb-4">
                <Sprout class="w-8 h-8" /> 小兔鲜儿
             </div>
             <p class="text-emerald-100">品质 / 新鲜 / 惠民 / 快捷</p>
          </div>
          <div class="z-10">
            <h3 class="text-3xl font-bold mb-2">欢迎回来</h3>
            <p class="text-emerald-100 text-sm">登录以访问您的专属优惠和订单信息</p>
          </div>
          <!-- 装饰圆圈 -->
          <div class="absolute -bottom-20 -right-20 w-64 h-64 bg-emerald-400 rounded-full opacity-50"></div>
        </div>

        <!-- 右侧表单 -->
        <div class="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <h2 class="text-2xl font-bold text-gray-800 mb-2">账户登录</h2>
          <p class="text-gray-400 text-sm mb-8"></p>

          <div class="space-y-4">
            <div class="space-y-1">
               <input v-model="form.account" type="text" placeholder="请输入用户名" class="w-full px-4 py-3 rounded border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition">
            </div>
            <div class="space-y-1">
               <input v-model="form.password" type="password" placeholder="请输入密码" class="w-full px-4 py-3 rounded border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition" @keyup.enter="handleLogin">
            </div>
            
            <div v-if="errorMsg" class="text-red-500 text-xs flex items-center animate-pulse">
               {{ errorMsg }}
            </div>

            <button @click="handleLogin" :disabled="loading" class="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded transition disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center">
               <span v-if="loading" class="animate-spin mr-2">⏳</span>
               {{ loading ? '登录中...' : '登 录' }}
            </button>

            <div class="text-center text-sm text-gray-500 mt-4">
              没有账号？
              <router-link to="/signin" class="text-emerald-500 font-bold hover:underline">
                立即注册
              </router-link>
            </div>

            <div class="flex items-center gap-2 pt-4">
               <input v-model="form.agree" type="checkbox" id="agree" class="accent-emerald-500 w-4 h-4 cursor-pointer">
               <label for="agree" class="text-xs text-gray-400 cursor-pointer select-none">我已阅读并同意《隐私条款》和《服务协议》</label>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>