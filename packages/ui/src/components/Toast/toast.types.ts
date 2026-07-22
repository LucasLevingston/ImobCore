import type * as React from 'react'

// React 19 ampliou ReactNode pra incluir bigint; a tipagem do Radix Toast
// (ToastTitle/ToastDescription) ainda não acompanhou isso. Nunca renderizamos
// um bigint bruto num toast de verdade, então exclui explicitamente em vez de
// esperar o Radix atualizar.
type RenderableNode = Exclude<React.ReactNode, bigint>

export interface ToastData {
  id: string
  title?: RenderableNode
  description?: RenderableNode
  variant?: 'default' | 'destructive' | 'success'
  open: boolean
}

export type ToastInput = Omit<ToastData, 'id' | 'open'>

export type ToastAction =
  | { type: 'ADD_TOAST'; toast: ToastData }
  | { type: 'UPDATE_TOAST'; toast: Partial<ToastData> & { id: string } }
  | { type: 'DISMISS_TOAST'; toastId: string }
  | { type: 'REMOVE_TOAST'; toastId: string }

export interface ToastState {
  toasts: ToastData[]
}
