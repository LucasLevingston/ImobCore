import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MOCK_PROPERTY } from '../../../../mocks/handlers/properties'
import { renderWithProviders } from '../../../../test-utils/renderWithProviders'
import { PropertyCard } from './PropertyCard'

describe('PropertyCard', () => {
  it('should render the title, location, price, and key specs', () => {
    renderWithProviders(<PropertyCard property={MOCK_PROPERTY} />)

    expect(screen.getByText('Apartamento 2 quartos no Centro')).toBeInTheDocument()
    expect(screen.getByText(/Centro, São Paulo/)).toBeInTheDocument()
    expect(screen.getByText('R$ 350.000,00')).toBeInTheDocument()
    expect(screen.getByText(/2 qts/)).toBeInTheDocument()
  })

  it('should link to the property detail page', () => {
    renderWithProviders(<PropertyCard property={MOCK_PROPERTY} />)

    expect(screen.getByRole('link')).toHaveAttribute('href', '/properties/property-1')
  })
})
