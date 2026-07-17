import type { ToastAction, ToastState } from './toast.types'

const TOAST_LIMIT = 1

// SRP: reducer puro — sem efeitos colaterais, testável isoladamente
// Switch exaustivo sobre a union Action — sem `default`: os 4 cases cobrem
// todo o tipo, e um `default` morto não seria alcançável nem testável.
export function reducer(state: ToastState, action: ToastAction): ToastState {
  switch (action.type) {
    case 'ADD_TOAST':
      return { toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT) }
    case 'UPDATE_TOAST':
      return {
        toasts: state.toasts.map((t) => (t.id === action.toast.id ? { ...t, ...action.toast } : t)),
      }
    case 'DISMISS_TOAST':
      return {
        toasts: state.toasts.map((t) => (t.id === action.toastId ? { ...t, open: false } : t)),
      }
    case 'REMOVE_TOAST':
      return { toasts: state.toasts.filter((t) => t.id !== action.toastId) }
  }
}
