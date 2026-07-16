'use client'

import { useRouter } from 'next/navigation'
import { PropertyForm, useCreateProperty } from '@/features/properties/create'

export default function NewPropertyPage() {
  const router = useRouter()
  const { mutate, isPending, error } = useCreateProperty()

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <h1 className="text-2xl font-bold">Novo imóvel</h1>
      <PropertyForm
        submitLabel="Cadastrar"
        isSubmitting={isPending}
        onSubmit={(values) =>
          mutate(values, {
            onSuccess: (property) => router.push(`/properties/${property.id}`),
          })
        }
      />
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error.message}
        </p>
      )}
    </div>
  )
}
