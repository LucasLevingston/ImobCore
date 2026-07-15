import { screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { makePropertyFormValues } from '../../../../test-utils/factories/make-property-form-values'
import { renderWithProviders } from '../../../../test-utils/renderWithProviders'
import { PropertyForm } from './PropertyForm'

describe('PropertyForm', () => {
  it('should submit the filled-in values', async () => {
    const onSubmit = vi.fn()
    const { user } = renderWithProviders(<PropertyForm onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('Título'), 'Casa nova')
    await user.type(screen.getByLabelText('Descrição'), 'Uma casa bem grande e espaçosa.')
    await user.type(screen.getByLabelText('Preço'), '500000')
    await user.type(screen.getByLabelText('Área (m²)'), '120')
    await user.type(screen.getByLabelText('Endereço'), 'Av. Principal')
    await user.type(screen.getByLabelText('Número'), '42')
    await user.type(screen.getByLabelText('Bairro'), 'Jardins')
    await user.type(screen.getByLabelText('Cidade'), 'São Paulo')
    await user.type(screen.getByLabelText('UF'), 'SP')
    await user.type(screen.getByLabelText('CEP'), '01000-000')

    await user.click(screen.getByRole('button', { name: 'Salvar' }))

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1))
    const submitted = onSubmit.mock.calls[0]?.[0]
    expect(submitted.title).toBe('Casa nova')
    expect(submitted.price).toBe(500_000)
    expect(submitted.condominiumFee).toBeNull()
  })

  it('should show a validation error and not submit when the title is too short', async () => {
    const onSubmit = vi.fn()
    const { user } = renderWithProviders(<PropertyForm onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('Título'), 'ab')
    await user.click(screen.getByRole('button', { name: 'Salvar' }))

    await waitFor(() =>
      expect(screen.getByText('Título deve ter ao menos 3 caracteres')).toBeInTheDocument(),
    )
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('should pre-fill fields from defaultValues (edit mode)', () => {
    renderWithProviders(
      <PropertyForm
        defaultValues={makePropertyFormValues({ title: 'Imóvel existente' })}
        onSubmit={vi.fn()}
      />,
    )

    expect(screen.getByLabelText('Título')).toHaveValue('Imóvel existente')
  })

  it('should use the given submitLabel', () => {
    renderWithProviders(<PropertyForm onSubmit={vi.fn()} submitLabel="Atualizar imóvel" />)

    expect(screen.getByRole('button', { name: 'Atualizar imóvel' })).toBeInTheDocument()
  })

  it('should disable the submit button while isSubmitting is true', () => {
    renderWithProviders(<PropertyForm onSubmit={vi.fn()} isSubmitting />)

    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('should toggle boolean checkboxes', async () => {
    const onSubmit = vi.fn()
    const { user } = renderWithProviders(
      <PropertyForm defaultValues={makePropertyFormValues()} onSubmit={onSubmit} />,
    )

    await user.click(screen.getByLabelText('Mobiliado'))
    await user.click(screen.getByRole('button', { name: 'Salvar' }))

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1))
    expect(onSubmit.mock.calls[0]?.[0].furnished).toBe(true)
  })
})
