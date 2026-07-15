import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '../../../../test-utils/renderWithProviders'
import { MOCK_PROPERTY } from '../../../../mocks/handlers/properties'
import { PropertyDetail } from './PropertyDetail'

describe('PropertyDetail', () => {
  it('should render the title, address, description, and price', () => {
    renderWithProviders(<PropertyDetail property={MOCK_PROPERTY} />)

    expect(screen.getByText('Apartamento 2 quartos no Centro')).toBeInTheDocument()
    expect(screen.getByText(/Rua das Flores, 123/)).toBeInTheDocument()
    expect(screen.getByText(MOCK_PROPERTY.description)).toBeInTheDocument()
    expect(screen.getByText('R$ 350.000,00')).toBeInTheDocument()
  })

  it('should render boolean specs as Sim/Não', () => {
    renderWithProviders(<PropertyDetail property={{ ...MOCK_PROPERTY, acceptsPets: false }} />)

    expect(screen.getByText('Sim')).toBeInTheDocument()
    expect(screen.getByText('Não')).toBeInTheDocument()
  })

  it('should render "Não" for acceptsFinancing when false', () => {
    renderWithProviders(<PropertyDetail property={{ ...MOCK_PROPERTY, acceptsFinancing: false }} />)

    expect(screen.getAllByText('Não')).toHaveLength(1)
  })
})
