import { cn } from '../../lib/utils'
import type { FooterProps } from './Footer.types'

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
