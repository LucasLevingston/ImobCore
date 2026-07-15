'use client'

import { PropertyForm } from '@/features/properties/create'
import { useProperty } from '@/features/properties/detail'
import { useUpdateProperty } from '@/features/properties/update'
import { ErrorState, Loading } from '@microfrontends/ui'
import { useRouter } from 'next/navigation'
import { use } from 'react'

export default function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  const { data, isLoading, isError, refetch } = useProperty(id)
  const { mutate, isPending, error } = useUpdateProperty(id)

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <h1 className="text-2xl font-bold">Editar imóvel</h1>

      {isLoading && <Loading label="Carregando imóvel..." />}
      {isError && (
        <ErrorState title="Não foi possível carregar o imóvel" onRetry={() => void refetch()} />
      )}
      {data && (
        <PropertyForm
          defaultValues={data}
          submitLabel="Salvar alterações"
          isSubmitting={isPending}
          onSubmit={(values) =>
            mutate(values, { onSuccess: () => router.push(`/properties/${id}`) })
          }
        />
      )}
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error.message}
        </p>
      )}
    </div>
  )
}
