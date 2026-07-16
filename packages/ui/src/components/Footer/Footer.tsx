import * as React from 'react'
import { cn } from '../../lib/utils'

// ISP: 2 slots opcionais (left/right) + children pra composição livre —
// mesmo racional do Header (seção "Layout" — versão/empresa/ano são do app consumidor)
export interface FooterProps {
  left?: React.ReactNode
  right?: React.ReactNode
  children?: React.ReactNode
  className?: string
}

export function Footer({ left, right, children, className }: FooterProps) {
  return (
    <footer
      className={cn(
        'flex h-14 w-full items-center justify-between gap-4 border-t bg-background px-4 text-sm text-muted-foreground md:px-8',
        className,
      )}
    >
      {children ?? (
        <>
          <div className="flex items-center gap-2">{left}</div>
          <div className="flex items-center gap-2">{right}</div>
        </>
      )}
    </footer>
  )
}
