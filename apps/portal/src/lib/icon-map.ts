import {
  BarChart3,
  Bot,
  Building2,
  CalendarCheck,
  LayoutDashboard,
  type LucideIcon,
  Settings,
  ShieldCheck,
  Users,
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
