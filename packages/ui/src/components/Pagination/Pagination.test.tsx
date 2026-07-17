import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithUser } from '../../test-utils'
import { Pagination } from './Pagination'

describe('Pagination', () => {
  it('should render nothing when there is only one page', () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} onPageChange={vi.fn()} />,
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('should disable the previous button on the first page', () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Página anterior' })).toBeDisabled()
  })

  it('should disable the next button on the last page', () => {
    render(<Pagination currentPage={5} totalPages={5} onPageChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Próxima página' })).toBeDisabled()
  })

  it('should mark the current page with aria-current', () => {
    render(<Pagination currentPage={3} totalPages={5} onPageChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: '3' })).toHaveAttribute('aria-current', 'page')
  })

  it('should call onPageChange with the clicked page number', async () => {
    const onPageChange = vi.fn()
    const { user } = renderWithUser(
      <Pagination currentPage={2} totalPages={5} onPageChange={onPageChange} />,
    )

    await user.click(screen.getByRole('button', { name: '4' }))

    expect(onPageChange).toHaveBeenCalledWith(4)
  })

  it('should call onPageChange with the next page number when next is clicked', async () => {
    const onPageChange = vi.fn()
    const { user } = renderWithUser(
      <Pagination currentPage={2} totalPages={5} onPageChange={onPageChange} />,
    )

    await user.click(screen.getByRole('button', { name: 'Próxima página' }))

    expect(onPageChange).toHaveBeenCalledWith(3)
  })

  it('should call onPageChange with the previous page number when previous is clicked', async () => {
    const onPageChange = vi.fn()
    const { user } = renderWithUser(
      <Pagination currentPage={2} totalPages={5} onPageChange={onPageChange} />,
    )

    await user.click(screen.getByRole('button', { name: 'Página anterior' }))

    expect(onPageChange).toHaveBeenCalledWith(1)
  })

  it('should not call onPageChange when clicking the disabled previous button', async () => {
    const onPageChange = vi.fn()
    const { user } = renderWithUser(
      <Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />,
    )

    await user.click(screen.getByRole('button', { name: 'Página anterior' }))

    expect(onPageChange).not.toHaveBeenCalled()
  })

  it('should not call onPageChange when clicking the already-active page button', async () => {
    const onPageChange = vi.fn()
    const { user } = renderWithUser(
      <Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} />,
    )

    await user.click(screen.getByRole('button', { name: '3' }))

    expect(onPageChange).not.toHaveBeenCalled()
  })

  it('should render an ellipsis when there are more pages than visible siblings', () => {
    render(<Pagination currentPage={1} totalPages={20} onPageChange={vi.fn()} />)
    expect(screen.getByText('…')).toBeInTheDocument()
  })

  it('should be navigable via keyboard', async () => {
    const onPageChange = vi.fn()
    const { user } = renderWithUser(
      <Pagination currentPage={2} totalPages={5} onPageChange={onPageChange} />,
    )

    screen.getByRole('button', { name: '4' }).focus()
    await user.keyboard('{Enter}')

    expect(onPageChange).toHaveBeenCalledWith(4)
  })

  it('should forward a custom className to the nav element', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={vi.fn()}
        className="my-custom-class"
      />,
    )
    expect(screen.getByRole('navigation')).toHaveClass('my-custom-class')
  })
})
