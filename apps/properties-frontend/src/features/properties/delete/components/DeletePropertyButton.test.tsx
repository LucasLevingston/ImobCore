import { screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../test-utils/renderWithProviders'
import { DeletePropertyButton } from './DeletePropertyButton'

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
})
