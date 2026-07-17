import type * as React from 'react'

// ISP: só o essencial de um input + error opcional — sem props booleanas condicionais extras
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // `| undefined` explícito (não só `?:`) — sob exactOptionalPropertyTypes,
  // permite que consumidores espalhem `error: errors.x?.message` (que produz
  // `string | undefined`) sem precisar omitir a chave condicionalmente
  error?: string | undefined
}
