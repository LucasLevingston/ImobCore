import { cn } from '../../lib/utils'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../Tooltip'
import type { SidebarProps } from './Sidebar.types'

export function Sidebar({ items, header, footer, className, collapsed = false }: SidebarProps) {
  return (
    <nav
      aria-label="Navegação lateral"
      className={cn(
        'flex h-full w-64 flex-col justify-between border-r border-border/70 bg-background p-3 transition-[width] duration-200',
        className,
      )}
    >
      <div className="space-y-4">
        {header}
        {items.length === 0 ? (
          <p className="px-3 text-sm text-muted-foreground">Nenhum item de navegação.</p>
        ) : (
          <TooltipProvider delayDuration={300}>
            <ul className="space-y-0.5">
              {items.map((item) => {
                const link = (
                  <a
                    href={item.href}
                    aria-current={item.active ? 'page' : undefined}
                    className={cn(
                      'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 transition-colors duration-150 hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                      collapsed && 'justify-center',
                      item.active &&
                        'bg-brand/10 text-brand hover:bg-brand/15 hover:text-brand dark:bg-brand/15',
                    )}
                  >
                    {item.icon}
                    <span className={cn(collapsed && 'sr-only')}>{item.label}</span>
                  </a>
                )
                return (
                  <li key={item.href}>
                    {collapsed ? (
                      <Tooltip>
                        <TooltipTrigger asChild>{link}</TooltipTrigger>
                        <TooltipContent side="right">{item.label}</TooltipContent>
                      </Tooltip>
                    ) : (
                      link
                    )}
                  </li>
                )
              })}
            </ul>
          </TooltipProvider>
        )}
      </div>
      {footer}
    </nav>
  )
}
