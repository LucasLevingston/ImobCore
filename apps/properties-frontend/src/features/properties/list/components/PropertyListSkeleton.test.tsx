import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PropertyListSkeleton } from './PropertyListSkeleton'

describe('PropertyListSkeleton', () => {
  it('should render 6 placeholder cards by default', () => {
    render(<PropertyListSkeleton />)
    // 5 placeholders per card: title, location, badge, price, specs
    expect(screen.getAllByRole('status')).toHaveLength(6 * 5)
  })

  it('should render a custom number of placeholder cards', () => {
    render(<PropertyListSkeleton count={3} />)
    expect(screen.getAllByRole('status')).toHaveLength(3 * 5)
  })
})
