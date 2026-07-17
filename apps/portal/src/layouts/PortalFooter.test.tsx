import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import packageJson from '../../package.json'
import { PortalFooter } from './PortalFooter'

describe('PortalFooter', () => {
  it('should render the current year', () => {
    render(<PortalFooter />)
    const year = new Date().getFullYear().toString()
    expect(screen.getByText(new RegExp(year))).toBeInTheDocument()
  })

  it('should render the app version from package.json', () => {
    render(<PortalFooter />)
    expect(screen.getByText(new RegExp(packageJson.version))).toBeInTheDocument()
  })

  it('should render a contentinfo landmark', () => {
    render(<PortalFooter />)
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })
})
