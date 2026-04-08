import { create } from 'zustand'

const getStored = (key) => {
  if (typeof window === 'undefined') return null
  try { return JSON.parse(localStorage.getItem(key)) } catch { return null }
}
const setStored = (key, val) => {
  if (typeof window === 'undefined') return
  try { localStorage.setItem(key, JSON.stringify(val)) } catch {}
}

const useCartStore = create((set, get) => ({
  items: [],
  address: null,
  lastOrder: null,
  orderHistory: [],

  hydrate: () => {
    const items = getStored('prama_cart') || []
    const address = getStored('prama_address')
    const orderHistory = getStored('prama_orders') || []
    set({ items, address, orderHistory })
  },

  addItem: (product, provider, section) => {
    set((state) => {
      const existingIndex = state.items.findIndex(
        (item) => item.productId === product.id && item.provider === provider.name
      )
      let newItems
      if (existingIndex !== -1) {
        newItems = [...state.items]
        newItems[existingIndex] = { ...newItems[existingIndex], qty: newItems[existingIndex].qty + 1 }
      } else {
        const worstPrice = Math.max(...product.providers.map(p => p.price))
        newItems = [...state.items, {
          id: `${product.id}_${provider.name}_${Date.now()}`,
          productId: product.id, name: product.name, emoji: product.emoji, image: product.image,
          quantity: product.quantity, unit: product.unit, provider: provider.name,
          price: provider.price, originalPrice: provider.originalPrice,
          worstPrice, isBest: provider.isBest, section, qty: 1,
        }]
      }
      setStored('prama_cart', newItems)
      return { items: newItems }
    })
  },

  removeItem: (id) => {
    set((state) => {
      const newItems = state.items.filter((item) => item.id !== id)
      setStored('prama_cart', newItems)
      return { items: newItems }
    })
  },

  updateQty: (id, qty) => {
    if (qty < 1) return get().removeItem(id)
    set((state) => {
      const newItems = state.items.map((item) => item.id === id ? { ...item, qty } : item)
      setStored('prama_cart', newItems)
      return { items: newItems }
    })
  },

  clearCart: () => { setStored('prama_cart', []); set({ items: [] }) },

  setAddress: (addr) => { setStored('prama_address', addr); set({ address: addr }) },

  completeOrder: (paymentMethod) => {
    const state = get()
    const orderId = 'PRM' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 5).toUpperCase()
    const order = {
      orderId, items: [...state.items], subtotal: state.getSubtotal(),
      total: state.getTotal(), savings: state.getSavings(),
      address: state.address, paymentMethod, date: new Date().toISOString(),
    }
    const newHistory = [order, ...state.orderHistory].slice(0, 20)
    setStored('prama_orders', newHistory)
    setStored('prama_cart', [])
    set({ lastOrder: order, items: [], orderHistory: newHistory })
    return order
  },

  getSubtotal: () => get().items.reduce((sum, item) => sum + item.price * item.qty, 0),
  getOriginalTotal: () => get().items.reduce((sum, item) => sum + item.originalPrice * item.qty, 0),
  getTotal: () => get().getSubtotal(),
  getSavings: () => get().getOriginalTotal() - get().getSubtotal(),
  getSmartSavings: () => get().items.reduce((sum, item) => sum + (item.worstPrice - item.price) * item.qty, 0),
  getItemCount: () => get().items.reduce((sum, item) => sum + item.qty, 0),
}))

export default useCartStore