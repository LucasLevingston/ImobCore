import { cn } from '../../lib/utils'
import type { HeaderProps } from './Header.types'

export function Header({ logo, nav, actions, className }: HeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex h-16 w-full items-center justify-between gap-4 border-b border-border/70 bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:px-8',
        className,
      )}
    >
      <div className="flex items-center gap-6">
        {logo}
        {nav}
      </div>
      <div className="flex items-center gap-2">{actions}</div>
    </header>
  )
}
