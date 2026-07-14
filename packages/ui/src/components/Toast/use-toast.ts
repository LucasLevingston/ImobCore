import * as React from 'react'

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1_000_000

export interface ToastData {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  variant?: 'default' | 'destructive'
  open: boolean
}

type ToastInput = Omit<ToastData, 'id' | 'open'>

type Action =
  | { type: 'ADD_TOAST'; toast: ToastData }
  | { type: 'UPDATE_TOAST'; toast: Partial<ToastData> & { id: string } }
  | { type: 'DISMISS_TOAST'; toastId: string }
  | { type: 'REMOVE_TOAST'; toastId: string }

interface State {
  toasts: ToastData[]
}

// SRP: reducer puro — sem efeitos colaterais, testável isoladamente
// Switch exaustivo sobre a union Action — sem `default`: os 4 cases cobrem
// todo o tipo, e um `default` morto não seria alcançável nem testável.
export function reducer(state: State, action: Action): State {
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

let memoryState: State = { toasts: [] }
const listeners: Array<(state: State) => void> = []
const removeTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => listener(memoryState))
}

function scheduleRemoval(toastId: string) {
  if (removeTimeouts.has(toastId)) return
  const timeout = setTimeout(() => {
    removeTimeouts.delete(toastId)
    dispatch({ type: 'REMOVE_TOAST', toastId })
  }, TOAST_REMOVE_DELAY)
  removeTimeouts.set(toastId, timeout)
}

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
    dispatch({ type: 'UPDATE_TOAST', toast: { ...toast, id } })
  const dismiss = () => {
    dispatch({ type: 'DISMISS_TOAST', toastId: id })
    scheduleRemoval(id)
  }

  dispatch({ type: 'ADD_TOAST', toast: { ...input, id, open: true } })

  return { id, update, dismiss }
}

export function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) listeners.splice(index, 1)
    }
  }, [])

  return {
    toasts: state.toasts,
    toast,
    dismiss: (toastId: string) => {
      dispatch({ type: 'DISMISS_TOAST', toastId })
      scheduleRemoval(toastId)
    },
  }
}
