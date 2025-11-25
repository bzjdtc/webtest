import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Product } from '@/types'

export interface CartItem extends Product {
  count: number
  selected: boolean
}

export const useCartStore = defineStore('cart', () => {
  const cartList = ref<CartItem[]>([])

  const addCart = (goods: Product) => {
    const item = cartList.value.find(i => i.id === goods.id)
    if (item) {
      item.count++
    } else {
      cartList.value.push({ ...goods, count: 1, selected: true })
    }
  }

  const delCart = (skuId: number) => {
    const idx = cartList.value.findIndex(item => item.id === skuId)
    if (idx > -1) cartList.value.splice(idx, 1)
  }

  const totalCount = computed(() => cartList.value.reduce((p, c) => p + c.count, 0))
  const totalPrice = computed(() => cartList.value.reduce((p, c) => p + parseFloat(c.price) * c.count, 0).toFixed(2))

  return { cartList, addCart, delCart, totalCount, totalPrice }
})
