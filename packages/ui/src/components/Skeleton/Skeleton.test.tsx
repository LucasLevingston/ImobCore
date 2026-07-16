import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Skeleton } from './Skeleton'

describe('Skeleton', () => {
  it('should render with status role and an accessible label for screen readers', () => {
    render(<Skeleton />)
    expect(screen.getByRole('status', { name: 'Carregando conteúdo' })).toBeInTheDocument()
  })

  it('should apply the pulse animation class by default', () => {
    render(<Skeleton />)
    expect(screen.getByRole('status')).toHaveClass('animate-pulse')
  })

  it('should apply a custom className for sizing/shape', () => {
    render(<Skeleton className="h-40 w-full rounded-full" />)
    const skeleton = screen.getByRole('status')
    expect(skeleton).toHaveClass('h-40', 'w-full', 'rounded-full')
  })

  it('should forward additional HTML attributes', () => {
    render(<Skeleton data-testid="property-card-skeleton" />)
    expect(screen.getByTestId('property-card-skeleton')).toBeInTheDocument()
  })
})
