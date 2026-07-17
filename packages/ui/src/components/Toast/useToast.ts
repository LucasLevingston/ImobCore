import * as React from 'react'
import type { ToastState } from './toast.types'
import { toastStore } from './toast-store'
import { toast } from './trigger-toast'

export function useToast() {
  const [state, setState] = React.useState<ToastState>(toastStore.getState())

  React.useEffect(() => toastStore.subscribe(setState), [])

  return {
    toasts: state.toasts,
    toast,
    dismiss: (toastId: string) => {
      toastStore.dispatch({ type: 'DISMISS_TOAST', toastId })
      toastStore.scheduleRemoval(toastId)
    },
  }
}
