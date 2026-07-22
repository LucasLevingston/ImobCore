'use client'

import { Button, Sidebar, type SidebarItem } from '@microfrontends/ui'
import { LogOut } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useLogout } from '../hooks/useLogout'
import { iconMap } from '../lib/icon-map'
import { reloadAfterLogout } from '../lib/reload-after-logout'
import { MODULES } from '../routes/modules'
import type { PortalSidebarProps } from './PortalSidebar.types'

export function PortalSidebar({ collapsed }: PortalSidebarProps) {
  const pathname = usePathname()
  const { mutate: logout } = useLogout()

  function handleLogout() {
    logout(undefined, { onSettled: reloadAfterLogout })
  }

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
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          <span className={collapsed ? 'sr-only' : undefined}>Sair</span>
        </Button>
      }
    />
  )
}
