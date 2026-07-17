import type { ToastData, ToastInput } from './toast.types'
import { toastStore } from './toast-store'

let toastCount = 0
function generateId(): string {
  toastCount += 1
  return toastCount.toString()
}

// Módulo exporta toast() standalone — pode ser chamado fora da árvore React
// (ex.: onError de uma mutation do TanStack Query)
export function toast(input: ToastInput) {
  const id = generateId()

  const update = (toast: Partial<ToastData>) =>
    toastStore.dispatch({ type: 'UPDATE_TOAST', toast: { ...toast, id } })
  const dismiss = () => {
    toastStore.dispatch({ type: 'DISMISS_TOAST', toastId: id })
    toastStore.scheduleRemoval(id)
  }

  toastStore.dispatch({ type: 'ADD_TOAST', toast: { ...input, id, open: true } })

  return { id, update, dismiss }
}
