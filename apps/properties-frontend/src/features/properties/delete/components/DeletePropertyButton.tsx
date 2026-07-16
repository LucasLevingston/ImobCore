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
} from '@microfrontends/ui'
import { useState } from 'react'
import { useDeleteProperty } from '../hooks/useDeleteProperty'

export interface DeletePropertyButtonProps {
  propertyId: string
  onDeleted?: () => void
}

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
