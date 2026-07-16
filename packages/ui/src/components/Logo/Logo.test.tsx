import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Logo } from './Logo'

describe('Logo', () => {
  it('should render the full variant with visible brand text by default', () => {
    render(<Logo />)
    const text = screen.getByText('ImobCore')
    expect(text).toBeInTheDocument()
    expect(text).not.toHaveClass('sr-only')
  })

  it('should render the icon variant with visually-hidden (but present) brand text', () => {
    render(<Logo variant="icon" />)
    expect(screen.getByText('ImobCore')).toHaveClass('sr-only')
  })

  it('should render as a link when href is provided', () => {
    render(<Logo href="/" />)
    const link = screen.getByRole('link', { name: 'ImobCore' })
    expect(link).toHaveAttribute('href', '/')
  })

  it('should render as a static element (not a link) when href is omitted', () => {
    render(<Logo />)
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('should apply the correct icon size class for sm/md/lg', () => {
    const { rerender, container } = render(<Logo size="sm" />)
    expect(container.querySelector('svg')).toHaveClass('h-5', 'w-5')

    rerender(<Logo size="lg" />)
    expect(container.querySelector('svg')).toHaveClass('h-8', 'w-8')
  })

  it('should forward a custom className', () => {
    render(<Logo className="my-custom-class" />)
    expect(screen.getByText('ImobCore').closest('div')).toHaveClass('my-custom-class')
  })
})
