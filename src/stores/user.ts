import { defineStore } from 'pinia'
import { ref } from 'vue'

interface UserInfo {
  id: string
  account: string
  avatar: string
  token: string
}

export const useUserStore = defineStore('user', () => {
  // 状态
  const userInfo = ref<UserInfo | null>(null)

  // 模拟登录 Action
  const login = async (account: string, password: string) => {
    // 模拟 API 请求延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (account === 'admin' && password === '123456') {
      userInfo.value = {
        id: 'u_1001',
        account: 'Admin',
        avatar: 'https://ui-avatars.com/api/?name=Admin&background=27BA9B&color=fff',
        token: 'mock_token_' + Date.now()
      }
      return Promise.resolve({ msg: '登录成功' })
    } else {
      return Promise.reject({ msg: '账号或密码错误 (Try: admin/123456)' })
    }
  }

  // 退出登录
  const logout = () => {
    userInfo.value = null
  }

  return { userInfo, login, logout }
}, {
  persist: true // 开启持久化 (需要安装插件)
})