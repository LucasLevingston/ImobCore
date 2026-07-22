import { AlertCircle } from 'lucide-react'
import { cn } from '../../lib/utils'
import type { FormErrorProps } from './FormError.types'

// Mensagem de erro de submissão (login, criar/editar imóvel etc) — mais leve
// que ErrorState (sem título/retry), pensada pra ficar perto do botão de
// submit. message vem sempre de ApiError.message (texto do backend, seguro
// de mostrar) — nunca de uma exception arbitrária.
export function FormError({ message, className }: FormErrorProps) {
  if (!message) {
    return null
  }

  return (
    <div
      role="alert"
      className={cn(
        'flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive',
        className,
      )}
    >
      <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span>{message}</span>
    </div>
  )
}
