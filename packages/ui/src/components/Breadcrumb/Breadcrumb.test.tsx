import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Breadcrumb, type BreadcrumbItem } from './Breadcrumb'

const items: BreadcrumbItem[] = [
  { label: 'Início', href: '/' },
  { label: 'Imóveis', href: '/properties' },
  { label: 'Casa na praia' },
]

describe('Breadcrumb', () => {
  it('should render a navigation landmark labeled breadcrumb', () => {
    render(<Breadcrumb items={items} />)
    expect(screen.getByRole('navigation', { name: 'breadcrumb' })).toBeInTheDocument()
  })

  it('should render a link for every item that has an href', () => {
    render(<Breadcrumb items={items} />)
    expect(screen.getByRole('link', { name: 'Início' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'Imóveis' })).toHaveAttribute('href', '/properties')
  })

  it('should render the last item as plain text with aria-current=page, not a link', () => {
    render(<Breadcrumb items={items} />)
    const last = screen.getByText('Casa na praia')
    expect(last.tagName).not.toBe('A')
    expect(last).toHaveAttribute('aria-current', 'page')
  })

  it('should render the last item as text even when it has an href', () => {
    render(
      <Breadcrumb
        items={[
          { label: 'Início', href: '/' },
          { label: 'Atual', href: '/atual' },
        ]}
      />,
    )
    expect(screen.queryByRole('link', { name: 'Atual' })).not.toBeInTheDocument()
    expect(screen.getByText('Atual')).toHaveAttribute('aria-current', 'page')
  })

  it('should render nothing when items is empty', () => {
    render(<Breadcrumb items={[]} />)
    expect(screen.queryByRole('navigation', { name: 'breadcrumb' })).not.toBeInTheDocument()
  })

  it('should forward custom className', () => {
    render(<Breadcrumb items={items} className="my-breadcrumb" />)
    expect(screen.getByRole('navigation', { name: 'breadcrumb' })).toHaveClass('my-breadcrumb')
  })
})
