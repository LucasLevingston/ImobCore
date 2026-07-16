import { cn } from '../../lib/utils'

// DIP: mesmo racional do Sidebar — não conhece next/navigation, quem decide
// os segmentos é o app consumidor (calcula a partir de usePathname)
export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  if (items.length === 0) {
    return null
  }

  const lastIndex = items.length - 1

  return (
    <nav aria-label="breadcrumb" className={cn('text-sm', className)}>
      <ol className="flex items-center gap-2">
        {items.map((item, index) => {
          const isLast = index === lastIndex
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {index > 0 && <span aria-hidden="true">/</span>}
              {isLast ? (
                <span aria-current="page" className="font-medium text-foreground">
                  {item.label}
                </span>
              ) : (
                <a href={item.href} className="text-muted-foreground hover:text-foreground">
                  {item.label}
                </a>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
