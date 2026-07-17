import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { logoutService } from '../services/logout.service'
import { PortalSidebar } from './PortalSidebar'

const usePathnameMock = vi.hoisted(() => vi.fn())

vi.mock('next/navigation', () => ({
  usePathname: usePathnameMock,
}))

describe('PortalSidebar', () => {
  it('should render a link for every module', () => {
    usePathnameMock.mockReturnValue('/')
    render(<PortalSidebar collapsed={false} />)

    expect(screen.getByRole('link', { name: /Dashboard/ })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: /Imóveis/ })).toHaveAttribute(
      'href',
      'http://localhost:3003',
    )
    expect(screen.getByRole('link', { name: /Clientes/ })).toHaveAttribute('href', '/clients')
  })

  it('should mark the module matching the current pathname as active', () => {
    usePathnameMock.mockReturnValue('/clients')
    render(<PortalSidebar collapsed={false} />)

    expect(screen.getByRole('link', { name: /Clientes/ })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: /Dashboard/ })).not.toHaveAttribute('aria-current')
  })

  it('should render a logout button in the footer slot, not as a nav link', () => {
    usePathnameMock.mockReturnValue('/')
    const onLogout = vi.fn()
    render(<PortalSidebar collapsed={false} onLogout={onLogout} />)

    expect(screen.queryByRole('link', { name: /Sair/ })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Sair/ })).toBeInTheDocument()
  })

  it('should call the provided onLogout instead of the default when given', async () => {
    usePathnameMock.mockReturnValue('/')
    const onLogout = vi.fn()
    const user = userEvent.setup()
    render(<PortalSidebar collapsed={false} onLogout={onLogout} />)

    await user.click(screen.getByRole('button', { name: /Sair/ }))

    expect(onLogout).toHaveBeenCalled()
  })

  it('should pass the collapsed prop through to the underlying Sidebar', () => {
    usePathnameMock.mockReturnValue('/')
    render(<PortalSidebar collapsed />)

    const dashboardLabel = screen.getByText('Dashboard')
    expect(dashboardLabel).toHaveClass('sr-only')
  })

  it('should call logoutService and reload when no onLogout is provided', async () => {
    usePathnameMock.mockReturnValue('/')
    const logoutSpy = vi.spyOn(logoutService, 'logout').mockResolvedValue(undefined)
    const reloadSpy = vi.fn()
    vi.stubGlobal('location', { ...window.location, reload: reloadSpy })

    const user = userEvent.setup()
    render(<PortalSidebar collapsed={false} />)
    await user.click(screen.getByRole('button', { name: /Sair/ }))

    await waitFor(() => expect(logoutSpy).toHaveBeenCalled())
    await waitFor(() => expect(reloadSpy).toHaveBeenCalled())
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })
})
