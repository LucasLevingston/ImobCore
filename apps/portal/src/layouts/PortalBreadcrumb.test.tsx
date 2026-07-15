import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PortalBreadcrumb } from './PortalBreadcrumb'

const usePathnameMock = vi.hoisted(() => vi.fn())

vi.mock('next/navigation', () => ({
  usePathname: usePathnameMock,
}))

describe('PortalBreadcrumb', () => {
  it('should render "Início" for the root path', () => {
    usePathnameMock.mockReturnValue('/')
    render(<PortalBreadcrumb />)
    expect(screen.getByText('Início')).toBeInTheDocument()
  })

  it('should render a trail derived from the current pathname', () => {
    usePathnameMock.mockReturnValue('/clients/123')
    render(<PortalBreadcrumb />)
    expect(screen.getByRole('link', { name: 'Clients' })).toHaveAttribute('href', '/clients')
    expect(screen.getByText('123')).toHaveAttribute('aria-current', 'page')
  })
})
