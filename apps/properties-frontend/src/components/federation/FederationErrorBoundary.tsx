'use client'

import { Component, type ReactNode } from 'react'

export interface FederationErrorBoundaryProps {
  children: ReactNode
  fallback: ReactNode
}

interface FederationErrorBoundaryState {
  hasError: boolean
}

// Se auth-frontend estiver fora do ar, o import do remote falha — sem isso,
// um componente federado quebrado derrubaria a página inteira do host
// (docs/ARCHITECTURE.md seção 06: "cai num fallback local mínimo")
export class FederationErrorBoundary extends Component<
  FederationErrorBoundaryProps,
  FederationErrorBoundaryState
> {
  state: FederationErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): FederationErrorBoundaryState {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }
    return this.props.children
  }
}
