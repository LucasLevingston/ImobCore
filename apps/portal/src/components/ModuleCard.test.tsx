import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { ModuleDescriptor } from '../routes/modules.types'
import { ModuleCard } from './ModuleCard'

const internalModule: ModuleDescriptor = {
  key: 'dashboard',
  label: 'Dashboard',
  href: '/',
  kind: 'internal',
  iconName: 'LayoutDashboard',
}

const externalModule: ModuleDescriptor = {
  key: 'properties',
  label: 'Imóveis',
  href: 'http://localhost:3003',
  kind: 'external',
  iconName: 'Building2',
}

const placeholderModule: ModuleDescriptor = {
  key: 'clients',
  label: 'Clientes',
  href: '/clients',
  kind: 'placeholder',
  iconName: 'Users',
}

describe('ModuleCard', () => {
  it('should render the module label', () => {
    render(<ModuleCard module={internalModule} />)
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })

  it('should link to the href for an internal module', () => {
    render(<ModuleCard module={internalModule} />)
    expect(screen.getByRole('link', { name: /Dashboard/ })).toHaveAttribute('href', '/')
  })

  it('should link to the external href for an external module', () => {
    render(<ModuleCard module={externalModule} />)
    expect(screen.getByRole('link', { name: /Imóveis/ })).toHaveAttribute(
      'href',
      'http://localhost:3003',
    )
  })

  it('should show an "Em breve" indicator for placeholder modules', () => {
    render(<ModuleCard module={placeholderModule} />)
    expect(screen.getByText('Em breve')).toBeInTheDocument()
  })

  it('should not show an "Em breve" indicator for internal or external modules', () => {
    render(<ModuleCard module={internalModule} />)
    expect(screen.queryByText('Em breve')).not.toBeInTheDocument()
  })
})
