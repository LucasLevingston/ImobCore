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
