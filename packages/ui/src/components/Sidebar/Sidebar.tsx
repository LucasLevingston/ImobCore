import * as React from 'react'
import { cn } from '../../lib/utils'

// DIP: Sidebar não conhece next/navigation — quem decide "ativo" é o app
// consumidor (calcula com usePathname e passa active já resolvido)
export interface SidebarItem {
  label: string
  href: string
  icon?: React.ReactNode
  active?: boolean
}

export interface SidebarProps {
  items: SidebarItem[]
  header?: React.ReactNode
  footer?: React.ReactNode
  className?: string
}

export function Sidebar({ items, header, footer, className }: SidebarProps) {
  return (
    <nav
      aria-label="Navegação lateral"
      className={cn(
        'flex h-full w-64 flex-col justify-between border-r bg-background p-4',
        className,
      )}
    >
      <div className="space-y-4">
        {header}
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum item de navegação.</p>
        ) : (
          <ul className="space-y-1">
            {items.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  aria-current={item.active ? 'page' : undefined}
                  className={cn(
                    'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                    item.active && 'bg-accent text-accent-foreground',
                  )}
                >
                  {item.icon}
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
      {footer}
    </nav>
  )
}
