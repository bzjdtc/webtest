import { defineStore } from 'pinia'
import { ref } from 'vue'
// 导入不同的本地头像
import adminAvatar from '@/assets/ui/admin.svg' 
import userAvatar from '@/assets/ui/user.jpg'

interface UserInfo {
  id: string
  account: string
  avatar: string
  token: string
}

interface MockUser {
  account: string
  password: string
  name: string
  role: 'admin' | 'user' // 增加角色区分
}

export const useUserStore = defineStore('user', () => {
  const userInfo = ref<UserInfo | null>(null)
  
  // 模拟数据库
  const mockUsers = ref<MockUser[]>([
    { account: 'admin', password: '123456', name: 'Admin', role: 'admin' }
  ])

  // 注册 Action
  const register = async (account: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 800))
    const isExist = mockUsers.value.find(u => u.account === account)
    if (isExist) {
      return Promise.reject({ msg: '该账号已存在' })
    }

    mockUsers.value.push({
      account,
      password,
      name: `${account.slice(-4)}`,
      role: 'user' // 注册的默认为普通用户
    })
    
    return Promise.resolve({ msg: '注册成功' })
  }

  // 登录 Action
  const login = async (account: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    const user = mockUsers.value.find(u => u.account === account && u.password === password)
    
    if (user) {
      userInfo.value = {
        id: 'u_' + Date.now(),
        account: user.name,
        // 根据角色选择头像
        avatar: user.role === 'admin' ? adminAvatar : userAvatar, 
        token: 'mock_token_' + Date.now()
      }
      return Promise.resolve({ msg: '登录成功' })
    } else {
      return Promise.reject({ msg: '账号或密码错误' })
    }
  }

  const logout = () => {
    userInfo.value = null
  }

  return { userInfo, login, logout, register }
}, {
  persist: true 
})