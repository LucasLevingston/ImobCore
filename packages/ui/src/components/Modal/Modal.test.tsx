import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithUser } from '../../test-utils'
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from '.'

describe('Modal', () => {
  it('should not render content when closed', () => {
    render(
      <Modal>
        <ModalTrigger>Abrir</ModalTrigger>
        <ModalContent>
          <ModalTitle>Confirmar exclusão</ModalTitle>
        </ModalContent>
      </Modal>,
    )

    expect(screen.queryByText('Confirmar exclusão')).not.toBeInTheDocument()
  })

  it('should open the modal when trigger is clicked', async () => {
    const { user } = renderWithUser(
      <Modal>
        <ModalTrigger>Abrir</ModalTrigger>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Confirmar exclusão</ModalTitle>
            <ModalDescription>Essa ação não pode ser desfeita.</ModalDescription>
          </ModalHeader>
          <ModalFooter>Rodapé</ModalFooter>
        </ModalContent>
      </Modal>,
    )

    await user.click(screen.getByRole('button', { name: 'Abrir' }))

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Confirmar exclusão')).toBeInTheDocument()
    expect(screen.getByText('Essa ação não pode ser desfeita.')).toBeInTheDocument()
    expect(screen.getByText('Rodapé')).toBeInTheDocument()
  })

  it('should respect controlled open state', () => {
    render(
      <Modal open onOpenChange={vi.fn()}>
        <ModalContent>
          <ModalTitle>Título controlado</ModalTitle>
        </ModalContent>
      </Modal>,
    )

    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('should call onOpenChange when closed via close button', async () => {
    const onOpenChange = vi.fn()
    const { user } = renderWithUser(
      <Modal open onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalTitle>Título</ModalTitle>
        </ModalContent>
      </Modal>,
    )

    await user.click(screen.getByRole('button', { name: 'Fechar' }))

    expect(onOpenChange).toHaveBeenCalledWith(false)
  })
})
