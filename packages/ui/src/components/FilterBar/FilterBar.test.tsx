import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithUser } from '../../test-utils'
import { FilterBar } from './FilterBar'

describe('FilterBar', () => {
  it('should render fields passed via FilterBar.Field', () => {
    render(
      <FilterBar>
        <FilterBar.Field label="Cidade">
          <input aria-label="input-cidade" />
        </FilterBar.Field>
      </FilterBar>,
    )
    expect(screen.getByRole('group', { name: 'Cidade' })).toBeInTheDocument()
  })

  it('should render actions passed via FilterBar.Actions', () => {
    render(
      <FilterBar>
        <FilterBar.Actions>
          <button type="button">Aplicar</button>
        </FilterBar.Actions>
      </FilterBar>,
    )
    expect(screen.getByRole('button', { name: 'Aplicar' })).toBeInTheDocument()
  })

  it('should hide the clear button when activeCount is 0', () => {
    render(<FilterBar activeCount={0}>{null}</FilterBar>)
    expect(screen.queryByRole('button', { name: /limpar filtros/i })).not.toBeInTheDocument()
  })

  it('should show the clear button when activeCount is greater than 0', () => {
    render(<FilterBar activeCount={3}>{null}</FilterBar>)
    expect(screen.getByRole('button', { name: /limpar filtros/i })).toBeInTheDocument()
  })

  it('should call onClear when the clear button is clicked', async () => {
    const onClear = vi.fn()
    const { user } = renderWithUser(
      <FilterBar activeCount={2} onClear={onClear}>
        {null}
      </FilterBar>,
    )

    await user.click(screen.getByRole('button', { name: /limpar filtros/i }))

    expect(onClear).toHaveBeenCalledTimes(1)
  })

  it('should show the active filter count on the mobile toggle button', () => {
    render(<FilterBar activeCount={2}>{null}</FilterBar>)
    expect(screen.getByRole('button', { name: 'Filtros (2)' })).toBeInTheDocument()
  })

  it('should toggle the fields container open state when the mobile toggle is clicked', async () => {
    const { user } = renderWithUser(
      <FilterBar>
        <FilterBar.Field label="Cidade">
          <input aria-label="input-cidade" />
        </FilterBar.Field>
      </FilterBar>,
    )

    const toggle = screen.getByRole('button', { name: 'Filtros' })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')

    await user.click(toggle)

    expect(toggle).toHaveAttribute('aria-expanded', 'true')
  })

  it('should forward a custom className to the root element', () => {
    const { container } = render(<FilterBar className="my-custom-class">{null}</FilterBar>)
    expect(container.firstChild).toHaveClass('my-custom-class')
  })
})
