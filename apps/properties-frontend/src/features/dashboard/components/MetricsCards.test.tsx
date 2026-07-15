import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '../../../test-utils/renderWithProviders'
import type { DashboardMetrics } from '../../../types/property'
import { MetricsCards } from './MetricsCards'

const metrics: DashboardMetrics = {
  total: 3,
  byStatus: { Available: 1, Reserved: 0, Sold: 1, Rented: 1, Inactive: 0 },
  averagePrice: 300_000,
  byCity: [{ city: 'São Paulo', count: 2 }],
  byDistrict: [{ district: 'Centro', count: 2 }],
}

describe('MetricsCards', () => {
  it('should render the total and average price', () => {
    renderWithProviders(<MetricsCards metrics={metrics} />)

    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('R$ 300.000,00')).toBeInTheDocument()
  })

  it('should render the city and district breakdown', () => {
    renderWithProviders(<MetricsCards metrics={metrics} />)

    expect(screen.getByText('São Paulo')).toBeInTheDocument()
    expect(screen.getByText('Centro')).toBeInTheDocument()
  })
})
