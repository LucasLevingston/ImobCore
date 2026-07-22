'use client'

import {
  Button,
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
  toast,
} from '@microfrontends/ui'
import { useState } from 'react'
import { ApiError } from '../../../../lib/api-client'
import { useDeleteProperty } from '../hooks/useDeleteProperty'
import type { DeletePropertyButtonProps } from './DeletePropertyButton.types'

export function DeletePropertyButton({
  propertyId,
  onDeleted = () => {},
}: DeletePropertyButtonProps) {
  const [open, setOpen] = useState(false)
  const { mutate, isPending } = useDeleteProperty()

  function handleConfirm() {
    mutate(propertyId, {
      onSuccess: () => {
        setOpen(false)
        onDeleted()
      },
      onError: (error) => {
        // Modal fica aberto pra usuário poder tentar de novo — só um toast
        // avisando o motivo, sem fechar o fluxo de confirmação
        toast({
          variant: 'destructive',
          title: 'Não foi possível excluir o imóvel',
          description: error instanceof ApiError ? error.message : 'Tente novamente em instantes.',
        })
      },
    })
  }

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger asChild>
        <Button variant="destructive">Excluir</Button>
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Excluir imóvel</ModalTitle>
          <ModalDescription>Essa ação não pode ser desfeita.</ModalDescription>
        </ModalHeader>
        <ModalFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" isLoading={isPending} onClick={handleConfirm}>
            Confirmar exclusão
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
