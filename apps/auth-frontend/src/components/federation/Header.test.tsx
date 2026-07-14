import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '../../test-utils/renderWithProviders'
import { Header } from './Header'

describe('Header', () => {
  it('should render a banner landmark', () => {
    renderWithProviders(<Header />)
    expect(screen.getByRole('banner')).toBeInTheDocument()
  })

  it('should render the platform name linking home', () => {
    renderWithProviders(<Header />)
    expect(screen.getByRole('link', { name: 'Microfrontends Platform' })).toHaveAttribute(
      'href',
      '/',
    )
  })

  it('should render login/register links when not authenticated (via UserMenu)', () => {
    renderWithProviders(<Header />)
    expect(screen.getByRole('link', { name: 'Entrar' })).toBeInTheDocument()
  })
})
