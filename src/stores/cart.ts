import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Product } from '@/types'

export interface CartItem extends Product {
  count: number
  selected: boolean
}

export const useCartStore = defineStore('cart', () => {
  const cartList = ref<CartItem[]>([])

  // 添加购物车
  const addCart = (goods: Product) => {
    const item = cartList.value.find(i => i.id === goods.id)
    if (item) {
      item.count++
    } else {
      cartList.value.push({ ...goods, count: 1, selected: true })
    }
  }

  // 删除购物车
  const delCart = (skuId: number | string) => {
    const idx = cartList.value.findIndex(item => item.id === skuId)
    if (idx > -1) cartList.value.splice(idx, 1)
  }

  // 单选功能（直接修改 item.selected 即可，这里提供全选逻辑）
  const checkAll = (selected: boolean) => {
    cartList.value.forEach(item => item.selected = selected)
  }

  // 修改数量
  const updateCount = (skuId: number | string, count: number) => {
    const item = cartList.value.find(i => i.id === skuId)
    if (item) {
        item.count = count
    }
  }

  // --- 计算属性 ---

  // 是否全选
  const isAllSelected = computed(() => {
    return cartList.value.length > 0 && cartList.value.every(item => item.selected)
  })

  // 购物车总件数 (角标用)
  const totalCount = computed(() => cartList.value.reduce((p, c) => p + c.count, 0))

  // 选中的商品总件数 (结算用)
  const selectedCount = computed(() => cartList.value.filter(i => i.selected).reduce((p, c) => p + c.count, 0))

  // 选中的商品总价 (结算用)
  const selectedPrice = computed(() => 
    cartList.value
      .filter(i => i.selected)
      .reduce((p, c) => p + parseFloat(c.price) * c.count, 0)
      .toFixed(2)
  )

  return { 
    cartList, 
    addCart, 
    delCart, 
    checkAll,
    updateCount,
    isAllSelected,
    totalCount, 
    selectedCount, 
    selectedPrice 
  }
}, {
  persist: true
})