import type * as React from 'react'

// ISP: 2 slots opcionais (left/right) + children pra composição livre —
// mesmo racional do Header (seção "Layout" — versão/empresa/ano são do app consumidor)
export interface FooterProps {
  left?: React.ReactNode
  right?: React.ReactNode
  children?: React.ReactNode
  className?: string
}
