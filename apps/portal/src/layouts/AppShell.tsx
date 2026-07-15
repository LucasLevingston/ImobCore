'use client'

import { Button, Layout } from '@microfrontends/ui'
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { PortalBreadcrumb } from './PortalBreadcrumb'
import { PortalFooter } from './PortalFooter'
import { PortalHeader } from './PortalHeader'
import { PortalSidebar } from './PortalSidebar'

export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex min-h-screen flex-col">
      <PortalHeader />
      <div className="flex flex-1">
        <div className="relative">
          <PortalSidebar collapsed={collapsed} />
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
            className="absolute -right-3 top-4 h-6 w-6 rounded-full"
            onClick={() => setCollapsed((prev) => !prev)}
          >
            {collapsed ? (
              <PanelLeftOpen className="h-3 w-3" aria-hidden="true" />
            ) : (
              <PanelLeftClose className="h-3 w-3" aria-hidden="true" />
            )}
          </Button>
        </div>
        <div className="flex flex-1 flex-col">
          <div className="border-b px-4 py-2 md:px-8">
            <PortalBreadcrumb />
          </div>
          <Layout fullWidth className="flex-1">
            {children}
          </Layout>
        </div>
      </div>
      <PortalFooter />
    </div>
  )
}
