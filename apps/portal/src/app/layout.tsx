import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { AppShell } from '../layouts/AppShell'
import { AppProviders } from '../providers/AppProviders'
import './globals.css'

export const metadata: Metadata = {
  title: 'Portal — Microfrontends Platform',
  description: 'App Shell — navegação, layout global e autorização de acesso aos módulos',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <AppProviders>
          <AppShell>{children}</AppShell>
        </AppProviders>
      </body>
    </html>
  )
}
