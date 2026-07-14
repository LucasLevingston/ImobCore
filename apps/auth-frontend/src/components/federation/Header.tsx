'use client'

import { Header as UiHeader } from '@microfrontends/ui'
import Link from 'next/link'
import { AuthStatus } from './AuthStatus'
import { UserMenu } from './UserMenu'

// Exposto via Module Federation — shell estrutural (logo + slots). Estado de
// auth vem de AuthStatus/UserMenu, que o properties-frontend também consome
// separadamente caso precise compor de outro jeito (docs seção 06/07).
export function Header() {
  return (
    <UiHeader
      logo={
        <Link href="/" className="text-sm font-semibold">
          Microfrontends Platform
        </Link>
      }
      actions={
        <div className="flex items-center gap-4">
          <AuthStatus />
          <UserMenu />
        </div>
      }
    />
  )
}
