import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../test-utils/renderWithProviders'
import { FederationErrorBoundary } from './FederationErrorBoundary'

function Bomb(): never {
  throw new Error('remote failed to load')
}

describe('FederationErrorBoundary', () => {
  it('should render children when there is no error', () => {
    renderWithProviders(
      <FederationErrorBoundary fallback={<span>fallback</span>}>
        <span>child content</span>
      </FederationErrorBoundary>,
    )

    expect(screen.getByText('child content')).toBeInTheDocument()
    expect(screen.queryByText('fallback')).not.toBeInTheDocument()
  })

  it('should render the fallback when a child throws', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    renderWithProviders(
      <FederationErrorBoundary fallback={<span>fallback</span>}>
        <Bomb />
      </FederationErrorBoundary>,
    )

    expect(screen.getByText('fallback')).toBeInTheDocument()
    consoleError.mockRestore()
  })
})
