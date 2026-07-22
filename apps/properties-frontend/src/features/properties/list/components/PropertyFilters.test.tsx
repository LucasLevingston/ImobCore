import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../test-utils/renderWithProviders'
import { PropertyFilters } from './PropertyFilters'

describe('PropertyFilters', () => {
  it('should call onApply with only the filled-in fields', async () => {
    const onApply = vi.fn()
    const { user } = renderWithProviders(<PropertyFilters onApply={onApply} />)

    await user.type(screen.getByLabelText('Buscar'), 'cobertura')
    await user.type(screen.getByLabelText('Cidade'), 'São Paulo')
    await user.click(screen.getByRole('button', { name: 'Filtrar' }))

    expect(onApply).toHaveBeenCalledWith({ q: 'cobertura', city: 'São Paulo' })
  })

  it('should convert price fields to numbers', async () => {
    const onApply = vi.fn()
    const { user } = renderWithProviders(<PropertyFilters onApply={onApply} />)

    await user.type(screen.getByLabelText('Preço mínimo'), '100000')
    await user.type(screen.getByLabelText('Preço máximo'), '500000')
    await user.click(screen.getByRole('button', { name: 'Filtrar' }))

    expect(onApply).toHaveBeenCalledWith({ minPrice: 100_000, maxPrice: 500_000 })
  })

  it('should include type and status when selected', async () => {
    const onApply = vi.fn()
    const { user } = renderWithProviders(<PropertyFilters onApply={onApply} />)

    await user.selectOptions(screen.getByLabelText('Tipo'), 'House')
    await user.selectOptions(screen.getByLabelText('Status'), 'Available')
    await user.click(screen.getByRole('button', { name: 'Filtrar' }))

    expect(onApply).toHaveBeenCalledWith({ type: 'House', status: 'Available' })
  })

  it('should pre-fill fields from initialValues', () => {
    renderWithProviders(
      <PropertyFilters initialValues={{ city: 'Rio de Janeiro' }} onApply={vi.fn()} />,
    )

    expect(screen.getByLabelText('Cidade')).toHaveValue('Rio de Janeiro')
  })

  it('should pre-fill price fields from initialValues', () => {
    renderWithProviders(
      <PropertyFilters
        initialValues={{ minPrice: 100_000, maxPrice: 500_000 }}
        onApply={vi.fn()}
      />,
    )

    expect(screen.getByLabelText('Preço mínimo')).toHaveValue(100_000)
    expect(screen.getByLabelText('Preço máximo')).toHaveValue(500_000)
  })

  it('should call onApply with an empty object when nothing is filled in', async () => {
    const onApply = vi.fn()
    const { user } = renderWithProviders(<PropertyFilters onApply={onApply} />)

    await user.click(screen.getByRole('button', { name: 'Filtrar' }))

    expect(onApply).toHaveBeenCalledWith({})
  })

  it('should clear the search field when the clear button is clicked', async () => {
    const onApply = vi.fn()
    const { user } = renderWithProviders(<PropertyFilters onApply={onApply} />)

    await user.type(screen.getByLabelText('Buscar'), 'cobertura')
    await user.click(screen.getByRole('button', { name: 'Limpar busca' }))
    await user.click(screen.getByRole('button', { name: 'Filtrar' }))

    expect(onApply).toHaveBeenCalledWith({})
  })
})
