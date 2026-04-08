import { create } from 'zustand'

const API = 'http://localhost:8000'

const getStored = (key) => {
  if (typeof window === 'undefined') return null
  try { return JSON.parse(localStorage.getItem(key)) } catch { return null }
}
const setStored = (key, val) => {
  if (typeof window === 'undefined') return
  try { localStorage.setItem(key, JSON.stringify(val)) } catch {}
}
const removeStored = (key) => {
  if (typeof window === 'undefined') return
  try { localStorage.removeItem(key) } catch {}
}

const useAuthStore = create((set, get) => ({
  user: null,
  isLoggedIn: false,
  error: '',
  loading: false,
  token: null,

  hydrate: () => {
    const user = getStored('prama_user')
    const token = getStored('prama_token')
    if (user && token) set({ user, token, isLoggedIn: true, error: '' })
  },

  signup: async (name, email, password) => {
    if (!name || name.trim().length < 2) { set({ error: 'Enter your full name' }); return false }
    if (!email || !email.includes('@')) { set({ error: 'Enter a valid email' }); return false }
    if (!password || password.length < 6) { set({ error: 'Password must be at least 6 characters' }); return false }

    set({ loading: true, error: '' })
    try {
      const res = await fetch(`${API}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim().toLowerCase(), password }),
      })
      const data = await res.json()
      if (!res.ok) { set({ error: data.detail || 'Signup failed', loading: false }); return false }
      setStored('prama_token', data.access_token)
      setStored('prama_user', data.user)
      set({ user: data.user, token: data.access_token, isLoggedIn: true, error: '', loading: false })
      return true
    } catch (e) {
      set({ error: 'Cannot connect to server. Is the backend running?', loading: false })
      return false
    }
  },

  login: async (email, password) => {
    if (!email || !password) { set({ error: 'Enter email and password' }); return false }
    set({ loading: true, error: '' })
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      })
      const data = await res.json()
      if (!res.ok) { set({ error: data.detail || 'Invalid email or password', loading: false }); return false }
      setStored('prama_token', data.access_token)
      setStored('prama_user', data.user)
      set({ user: data.user, token: data.access_token, isLoggedIn: true, error: '', loading: false })
      return true
    } catch (e) {
      set({ error: 'Cannot connect to server. Is the backend running?', loading: false })
      return false
    }
  },

  logout: () => {
    removeStored('prama_token')
    removeStored('prama_user')
    set({ user: null, token: null, isLoggedIn: false, error: '' })
  },

  getAuthHeader: () => {
    const token = getStored('prama_token')
    return token ? { Authorization: `Bearer ${token}` } : {}
  },

  clearError: () => set({ error: '' }),
}))

export default useAuthStore