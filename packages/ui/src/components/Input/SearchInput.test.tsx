import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithUser } from '../../test-utils'
import { SearchInput } from './SearchInput'

describe('SearchInput', () => {
  it('should not show the clear button when there is no text', () => {
    render(<SearchInput value="" onChange={vi.fn()} onClear={vi.fn()} />)
    expect(screen.queryByRole('button', { name: 'Limpar busca' })).not.toBeInTheDocument()
  })

  it('should show the clear button when there is text', () => {
    render(<SearchInput value="apartamento" onChange={vi.fn()} onClear={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Limpar busca' })).toBeInTheDocument()
  })

  it('should not show the clear button when onClear is not provided, even with text', () => {
    render(<SearchInput value="apartamento" onChange={vi.fn()} />)
    expect(screen.queryByRole('button', { name: 'Limpar busca' })).not.toBeInTheDocument()
  })

  it('should call onClear when the clear button is clicked', async () => {
    const onClear = vi.fn()
    const { user } = renderWithUser(
      <SearchInput value="apartamento" onChange={vi.fn()} onClear={onClear} />,
    )

    await user.click(screen.getByRole('button', { name: 'Limpar busca' }))

    expect(onClear).toHaveBeenCalledTimes(1)
  })

  it('should call onChange as the user types', async () => {
    const onChange = vi.fn()
    const { user } = renderWithUser(<SearchInput value="" onChange={onChange} />)

    await user.type(screen.getByRole('searchbox'), 'casa')

    expect(onChange).toHaveBeenCalledTimes(4)
  })

  it('should forward placeholder and other Input props', () => {
    render(<SearchInput value="" onChange={vi.fn()} placeholder="Buscar por título..." />)
    expect(screen.getByPlaceholderText('Buscar por título...')).toBeInTheDocument()
  })
})
