import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { RemoteHeader } from '@/components/federation/RemoteHeader'
import { Providers } from './providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'Imóveis — Microfrontends Platform',
  description: 'Dashboard, listagem, cadastro, edição e busca de imóveis',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>
          <RemoteHeader />
          {children}
        </Providers>
      </body>
    </html>
  )
}
