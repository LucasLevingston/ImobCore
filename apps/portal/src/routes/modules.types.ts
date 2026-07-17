export type ModuleKind = 'internal' | 'external' | 'placeholder'

// Nome de ícone (lucide-react), não o componente em si — mantém este módulo
// livre de React/JSX, testável como dado puro (PortalSidebar/ModuleCard
// resolvem o nome pro componente de ícone real)
export type ModuleIconName =
  | 'LayoutDashboard'
  | 'Building2'
  | 'Users'
  | 'CalendarCheck'
  | 'Bot'
  | 'BarChart3'
  | 'ShieldCheck'
  | 'Settings'

export interface ModuleDescriptor {
  key: string
  label: string
  href: string
  kind: ModuleKind
  iconName: ModuleIconName
}
