import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../test-utils/renderWithProviders'
import { Pagination } from './Pagination'

describe('Pagination', () => {
  it('should render nothing when there is only one page', () => {
    renderWithProviders(<Pagination page={1} totalPages={1} onPageChange={vi.fn()} />)

    expect(screen.queryByRole('navigation', { name: 'Paginação' })).not.toBeInTheDocument()
  })

  it('should disable "Anterior" on the first page', () => {
    renderWithProviders(<Pagination page={1} totalPages={3} onPageChange={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Anterior' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Próxima' })).toBeEnabled()
  })

  it('should disable "Próxima" on the last page', () => {
    renderWithProviders(<Pagination page={3} totalPages={3} onPageChange={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Próxima' })).toBeDisabled()
  })

  it('should call onPageChange with the next page when clicking "Próxima"', async () => {
    const onPageChange = vi.fn()
    const { user } = renderWithProviders(
      <Pagination page={2} totalPages={5} onPageChange={onPageChange} />,
    )

    await user.click(screen.getByRole('button', { name: 'Próxima' }))

    expect(onPageChange).toHaveBeenCalledWith(3)
  })

  it('should call onPageChange with the previous page when clicking "Anterior"', async () => {
    const onPageChange = vi.fn()
    const { user } = renderWithProviders(
      <Pagination page={2} totalPages={5} onPageChange={onPageChange} />,
    )

    await user.click(screen.getByRole('button', { name: 'Anterior' }))

    expect(onPageChange).toHaveBeenCalledWith(1)
  })
})
