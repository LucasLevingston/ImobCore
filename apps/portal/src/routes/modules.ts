import { env } from '../lib/env'

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

// Single source of truth de navegação (docs/ARCHITECTURE.md seção 05a) —
// PortalSidebar e a home institucional (ModuleCard) leem daqui, nunca
// duplicam a lista. "internal" = rota própria do Portal; "external" = MFE
// standalone existente (link simples, sem Module Federation ainda);
// "placeholder" = rota própria do Portal só com PlaceholderModule, pronta
// pra virar "external"/federada quando o MFE existir de verdade.
export const MODULES: ModuleDescriptor[] = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    href: '/',
    kind: 'internal',
    iconName: 'LayoutDashboard',
  },
  {
    key: 'properties',
    label: 'Imóveis',
    href: env.NEXT_PUBLIC_PROPERTIES_FRONTEND_URL,
    kind: 'external',
    iconName: 'Building2',
  },
  { key: 'clients', label: 'Clientes', href: '/clients', kind: 'placeholder', iconName: 'Users' },
  {
    key: 'visits',
    label: 'Visitas',
    href: '/visits',
    kind: 'placeholder',
    iconName: 'CalendarCheck',
  },
  { key: 'ai', label: 'IA', href: '/chat', kind: 'placeholder', iconName: 'Bot' },
  {
    key: 'analytics',
    label: 'Analytics',
    href: '/analytics',
    kind: 'placeholder',
    iconName: 'BarChart3',
  },
  {
    key: 'admin',
    label: 'Administração',
    href: '/admin',
    kind: 'placeholder',
    iconName: 'ShieldCheck',
  },
  {
    key: 'settings',
    label: 'Configurações',
    href: '/settings',
    kind: 'placeholder',
    iconName: 'Settings',
  },
]
