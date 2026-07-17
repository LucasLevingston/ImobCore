import { act, renderHook } from '@testing-library/react'
import { useToast } from '../components/Toast/use-toast'

// Toast usa store em módulo (fora da árvore React) — precisa de reset explícito
// entre testes pra evitar vazamento de estado de um teste pro outro
export function resetToasts(): void {
  const { result } = renderHook(() => useToast())
  act(() => {
    result.current.toasts.forEach((t) => {
      result.current.dismiss(t.id)
    })
  })
}
