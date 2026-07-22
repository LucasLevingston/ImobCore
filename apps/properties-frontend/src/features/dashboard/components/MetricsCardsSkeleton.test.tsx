import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MetricsCardsSkeleton } from './MetricsCardsSkeleton'

describe('MetricsCardsSkeleton', () => {
  it('should render a skeleton placeholder for each stat and breakdown card', () => {
    render(<MetricsCardsSkeleton />)
    // 4 stat cards x 3 placeholders (label + value + icon) + 2 breakdown
    // cards x 4 placeholders (title + 3 rows)
    expect(screen.getAllByRole('status')).toHaveLength(4 * 3 + 2 * 4)
  })
})
