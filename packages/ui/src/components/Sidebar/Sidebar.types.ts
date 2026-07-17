import type * as React from 'react'

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
  // Largura em si não é responsabilidade do Sidebar (o app já pode sobrescrever
  // via className, que passa por cn) — collapsed só esconde o texto do label,
  // mantendo o ícone e a navegabilidade por leitor de tela (sr-only, não display:none)
  collapsed?: boolean
}
