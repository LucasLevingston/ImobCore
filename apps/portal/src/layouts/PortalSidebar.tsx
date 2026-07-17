'use client'

import { Button, Sidebar, type SidebarItem } from '@microfrontends/ui'
import { LogOut } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { iconMap } from '../lib/icon-map'
import { MODULES } from '../routes/modules'
import { logoutService } from '../services/logout.service'
import type { PortalSidebarProps } from './PortalSidebar.types'

async function defaultLogout() {
  await logoutService.logout()
  window.location.reload()
}

export function PortalSidebar({ collapsed, onLogout }: PortalSidebarProps) {
  const pathname = usePathname()

  const items: SidebarItem[] = MODULES.map((module) => {
    const Icon = iconMap[module.iconName]
    return {
      label: module.label,
      href: module.href,
      icon: <Icon className="h-4 w-4" aria-hidden="true" />,
      active: module.kind !== 'external' && pathname === module.href,
    }
  })

  return (
    <Sidebar
      items={items}
      collapsed={collapsed}
      footer={
        <Button
          type="button"
          variant="ghost"
          className="w-full justify-start gap-2"
          onClick={() => void (onLogout ? onLogout() : defaultLogout())}
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          <span className={collapsed ? 'sr-only' : undefined}>Sair</span>
        </Button>
      }
    />
  )
}
