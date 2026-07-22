import { screen, waitFor } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import { describe, expect, it, vi } from 'vitest'
import { env } from '../../../../lib/env'
import { server } from '../../../../mocks/server'
import { renderWithProviders } from '../../../../test-utils/renderWithProviders'
import { DeletePropertyButton } from './DeletePropertyButton'

const BASE = env.NEXT_PUBLIC_API_GATEWAY_URL

describe('DeletePropertyButton', () => {
  it('should render the trigger button and no dialog initially', () => {
    renderWithProviders(<DeletePropertyButton propertyId="property-1" />)

    expect(screen.getByRole('button', { name: 'Excluir' })).toBeInTheDocument()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('should open a confirmation dialog when the trigger is clicked', async () => {
    const { user } = renderWithProviders(<DeletePropertyButton propertyId="property-1" />)

    await user.click(screen.getByRole('button', { name: 'Excluir' }))

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Excluir imóvel')).toBeInTheDocument()
  })

  it('should close the dialog without deleting when cancelled', async () => {
    const onDeleted = vi.fn()
    const { user } = renderWithProviders(
      <DeletePropertyButton propertyId="property-1" onDeleted={onDeleted} />,
    )

    await user.click(screen.getByRole('button', { name: 'Excluir' }))
    await user.click(screen.getByRole('button', { name: 'Cancelar' }))

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(onDeleted).not.toHaveBeenCalled()
  })

  it('should delete and call onDeleted when confirmed', async () => {
    const onDeleted = vi.fn()
    const { user } = renderWithProviders(
      <DeletePropertyButton propertyId="property-1" onDeleted={onDeleted} />,
    )

    await user.click(screen.getByRole('button', { name: 'Excluir' }))
    await user.click(screen.getByRole('button', { name: 'Confirmar exclusão' }))

    await waitFor(() => expect(onDeleted).toHaveBeenCalledTimes(1))
  })

  it('should not throw when clicked without an onDeleted callback', async () => {
    const { user } = renderWithProviders(<DeletePropertyButton propertyId="property-1" />)

    await user.click(screen.getByRole('button', { name: 'Excluir' }))
    await user.click(screen.getByRole('button', { name: 'Confirmar exclusão' }))

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })

  it('should show a toast and keep the dialog open when deletion fails', async () => {
    server.use(
      http.delete(`${BASE}/api/properties/:id`, () =>
        HttpResponse.json({ message: 'Imóvel possui contratos vinculados.' }, { status: 409 }),
      ),
    )
    const onDeleted = vi.fn()
    const { user } = renderWithProviders(
      <DeletePropertyButton propertyId="property-1" onDeleted={onDeleted} />,
    )

    await user.click(screen.getByRole('button', { name: 'Excluir' }))
    await user.click(screen.getByRole('button', { name: 'Confirmar exclusão' }))

    expect(await screen.findByText('Não foi possível excluir o imóvel')).toBeInTheDocument()
    expect(screen.getByText('Imóvel possui contratos vinculados.')).toBeInTheDocument()
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(onDeleted).not.toHaveBeenCalled()
  })

  it('should show a generic toast message when deletion fails with a non-API error', async () => {
    server.use(http.delete(`${BASE}/api/properties/:id`, () => HttpResponse.error()))
    const onDeleted = vi.fn()
    const { user } = renderWithProviders(
      <DeletePropertyButton propertyId="property-1" onDeleted={onDeleted} />,
    )

    await user.click(screen.getByRole('button', { name: 'Excluir' }))
    await user.click(screen.getByRole('button', { name: 'Confirmar exclusão' }))

    expect(await screen.findByText('Não foi possível excluir o imóvel')).toBeInTheDocument()
    expect(screen.getByText('Tente novamente em instantes.')).toBeInTheDocument()
    expect(onDeleted).not.toHaveBeenCalled()
  })
})
