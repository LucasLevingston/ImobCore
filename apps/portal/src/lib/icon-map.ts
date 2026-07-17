import {
  BarChart3,
  Bot,
  Building2,
  CalendarCheck,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Users,
  type LucideIcon,
} from 'lucide-react'
import type { ModuleIconName } from '../routes/modules.types'

// Nome (dado puro em routes/modules.ts) -> componente de ícone real —
// compartilhado por ModuleCard e PortalSidebar, nunca duplicado entre os dois
export const iconMap: Record<ModuleIconName, LucideIcon> = {
  LayoutDashboard,
  Building2,
  Users,
  CalendarCheck,
  Bot,
  BarChart3,
  ShieldCheck,
  Settings,
}
