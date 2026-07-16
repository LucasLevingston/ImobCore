import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import { Toaster } from '@microfrontends/ui'
import { renderWithUser } from '../test-utils/renderWithUser'
import { SearchBar } from './SearchBar'

describe('SearchBar', () => {
  it('should render a search input with an accessible label', () => {
    renderWithUser(<SearchBar />)
    expect(screen.getByRole('searchbox', { name: 'Pesquisar' })).toBeInTheDocument()
  })

  it('should let the user type a query', async () => {
    const { user } = renderWithUser(<SearchBar />)
    const input = screen.getByRole('searchbox', { name: 'Pesquisar' })
    await user.type(input, 'casa em são paulo')
    expect(input).toHaveValue('casa em são paulo')
  })

  it('should show a placeholder toast when submitted (search is not implemented yet)', async () => {
    const { user } = renderWithUser(
      <>
        <SearchBar />
        <Toaster />
      </>,
    )
    const input = screen.getByRole('searchbox', { name: 'Pesquisar' })
    await user.type(input, 'casa{Enter}')

    expect(await screen.findByText('Busca ainda não disponível')).toBeInTheDocument()
  })
})
