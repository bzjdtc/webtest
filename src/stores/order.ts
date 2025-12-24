import { defineStore } from 'pinia'
import { ref } from 'vue'

// 商品条目接口：用于订单清单
export interface OrderItem {
  id: string | number
  name: string
  image: string
  price: string // 与购物车中的价格类型保持一致
  count: number
}

// 地址信息接口
export interface Address {
  id: string
  receiver: string
  phone: string
  address: string
  isDefault: boolean
}

// 订单完整接口
export interface Order {
  id: string
  createTime: string
  totalMoney: string
  payMoney: string
  status: 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled'
  goods: OrderItem[]
  address: string
  receiver: string
  phone: string
}

export const useOrderStore = defineStore('order', () => {
  // --- 状态 (State) ---
  
  // 订单列表：存储所有历史订单
  const orderList = ref<Order[]>([])
  
  // 地址列表：默认提供两条测试数据
  const addressList = ref<Address[]>([
    { 
      id: '1', 
      receiver: '张三', 
      phone: '13800000000', 
      address: '北京市朝阳区三里屯街道88号', 
      isDefault: true 
    },
    { 
      id: '2', 
      receiver: '李四', 
      phone: '13911111111', 
      address: '上海市浦东新区陆家嘴环路1号', 
      isDefault: false 
    }
  ])

  // --- 订单操作 (Order Actions) ---

  /**
   * 创建订单并将其添加到订单列表顶部
   * @param goods 商品数组
   * @param total 总金额字符串
   * @param addressObj 选中的地址详细信息
   * @returns 新创建的订单ID
   */
  const createOrder = (
    goods: OrderItem[], 
    total: string, 
    addressObj: { address: string, receiver: string, phone: string }
  ) => {
    const order: Order = {
      id: 'ORD' + Date.now().toString(), // 生成简单的唯一ID
      createTime: new Date().toLocaleString(),
      totalMoney: total,
      payMoney: total,
      status: 'pending',
      goods,
      ...addressObj
    }
    
    // 将新订单添加到数组开头
    orderList.value.unshift(order)
    return order.id
  }

  // 修改订单支付状态
  const payOrder = (orderId: string) => {
    const order = orderList.value.find(o => o.id === orderId)
    if (order) {
      order.status = 'paid'
    }
  }

  // 根据 ID 获取订单详情
  const getOrder = (orderId: string) => {
    return orderList.value.find(o => o.id === orderId)
  }

  // --- 地址管理 (Address Actions) ---
  
  // 添加新地址
  const addAddress = (addr: Omit<Address, 'id'>) => {
    const newAddr = {
      ...addr,
      id: Date.now().toString()
    }
    // 如果设置为默认地址，先把其他的默认状态取消
    if (newAddr.isDefault) {
      addressList.value.forEach(a => (a.isDefault = false))
    }
    addressList.value.push(newAddr)
  }

  // 删除地址
  const deleteAddress = (id: string) => {
    addressList.value = addressList.value.filter(a => a.id !== id)
  }

  // 修改已有地址信息
const updateAddress = (id: string, updatedFields: Partial<Address>) => {
  const index = addressList.value.findIndex(a => a.id === id)
  if (index !== -1) {
    // 如果修改中包含设为默认，则重置其他地址
    if (updatedFields.isDefault) {
      addressList.value.forEach(a => (a.isDefault = false))
    }
    // 使用类型断言确保类型安全
    addressList.value[index] = { 
      ...addressList.value[index], 
      ...updatedFields 
    } as Address
  }
}

  // 快捷设置默认地址
  const setDefaultAddress = (id: string) => {
    addressList.value.forEach(a => {
      a.isDefault = a.id === id
    })
  }

  return { 
    orderList, 
    addressList,
    createOrder, 
    payOrder, 
    getOrder,
    addAddress,
    deleteAddress,
    updateAddress,
    setDefaultAddress
  }
}, {
  // 开启持久化，将数据存储在 localStorage 中
  persist: true
})