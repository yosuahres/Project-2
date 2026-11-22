import { reactive } from 'vue'

// Short confirmations in the corner, as the finance app's Toaster shows them.
const DURATION_MS = { success: 3000, error: 6000 }

export const toasts = reactive([])
let nextId = 1

export const dismissToast = (id) => {
  const index = toasts.findIndex((toast) => toast.id === id)
  if (index !== -1) toasts.splice(index, 1)
}

export const showToast = (message, kind = 'success') => {
  const id = nextId++
  toasts.push({ id, message, kind })
  setTimeout(() => dismissToast(id), DURATION_MS[kind])
}
