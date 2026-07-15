'use client'

import { Breadcrumb } from '@microfrontends/ui'
import { usePathname } from 'next/navigation'
import { breadcrumbFromPathname } from '../utils/breadcrumb-from-pathname'

export function PortalBreadcrumb() {
  const pathname = usePathname()
  return <Breadcrumb items={breadcrumbFromPathname(pathname)} />
}
