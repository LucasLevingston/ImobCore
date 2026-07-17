import { act, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { renderWithUser, resetToasts } from '../../test-utils'
import { Toaster } from './Toaster'
import { toast } from './use-toast'

describe('Toaster', () => {
  afterEach(() => {
    resetToasts()
  })

  it('should render nothing when there are no toasts', () => {
    render(<Toaster />)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('should display a toast triggered via toast()', () => {
    render(<Toaster />)

    act(() => {
      toast({ title: 'Produto criado', description: 'Salvo com sucesso.' })
    })

    expect(screen.getByText('Produto criado')).toBeInTheDocument()
    expect(screen.getByText('Salvo com sucesso.')).toBeInTheDocument()
  })

  it('should render a toast without a title', () => {
    render(<Toaster />)

    act(() => {
      toast({ description: 'Só a descrição.' })
    })

    expect(screen.getByText('Só a descrição.')).toBeInTheDocument()
  })

  it('should dismiss the toast when its close button is clicked', async () => {
    const { user } = renderWithUser(<Toaster />)

    act(() => {
      toast({ title: 'Produto criado' })
    })
    expect(screen.getByText('Produto criado')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Fechar notificação' }))

    expect(screen.queryByText('Produto criado')).not.toBeInTheDocument()
  })
})
