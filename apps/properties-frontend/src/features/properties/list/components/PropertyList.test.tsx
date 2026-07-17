import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MOCK_PROPERTY } from '../../../../mocks/handlers/properties'
import { renderWithProviders } from '../../../../test-utils/renderWithProviders'
import { PropertyList } from './PropertyList'

describe('PropertyList', () => {
  it('should render a card for each property', () => {
    renderWithProviders(
      <PropertyList properties={[MOCK_PROPERTY, { ...MOCK_PROPERTY, id: 'property-2' }]} />,
    )

    expect(screen.getAllByRole('link')).toHaveLength(2)
  })

  it('should render an empty state when there are no properties', () => {
    renderWithProviders(<PropertyList properties={[]} />)

    expect(screen.getByText('Nenhum imóvel encontrado.')).toBeInTheDocument()
  })
})
