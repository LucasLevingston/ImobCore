'use client'

import { Header, ThemeToggle } from '@microfrontends/ui'
import { NotificationsButton } from '../components/NotificationsButton'
import { SearchBar } from '../components/SearchBar'
import { UserMenu } from '../components/UserMenu'

export function PortalHeader() {
  return (
    <Header
      logo={<span className="font-semibold">Microfrontends Platform</span>}
      nav={<SearchBar />}
      actions={
        <>
          <NotificationsButton />
          <ThemeToggle />
          <UserMenu />
        </>
      }
    />
  )
}
