'use client'

import dynamic from 'next/dynamic'
import { FederationErrorBoundary } from './FederationErrorBoundary'

// Nunca ssr: true num remote (docs/ARCHITECTURE.md seção 06) — o remote não
// está disponível durante o build do host, só em runtime no browser
const AuthFrontendHeader = dynamic(() => import('authFrontend/Header'), { ssr: false })

const FALLBACK = (
  <header className="flex h-16 items-center border-b px-6">
    <span className="font-semibold">Microfrontends Platform</span>
  </header>
)

export function RemoteHeader() {
  return (
    <FederationErrorBoundary fallback={FALLBACK}>
      <AuthFrontendHeader />
    </FederationErrorBoundary>
  )
}
