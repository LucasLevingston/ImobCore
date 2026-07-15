'use client'

import { DeletePropertyButton } from '@/features/properties/delete'
import { PropertyDetail, useProperty } from '@/features/properties/detail'
import { ErrorState, Loading } from '@microfrontends/ui'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { use } from 'react'

export default function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  const { data, isLoading, isError, refetch } = useProperty(id)

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      {isLoading && <Loading label="Carregando imóvel..." />}
      {isError && (
        <ErrorState title="Não foi possível carregar o imóvel" onRetry={() => void refetch()} />
      )}
      {data && (
        <>
          <PropertyDetail property={data} />
          <div className="flex gap-3">
            <Link
              href={`/properties/${data.id}/edit`}
              className="text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              Editar
            </Link>
            <DeletePropertyButton
              propertyId={data.id}
              onDeleted={() => router.push('/properties')}
            />
          </div>
        </>
      )}
    </div>
  )
}
