'use client'

import { FormError } from '@microfrontends/ui'
import { useRouter } from 'next/navigation'
import { PropertyForm, useCreateProperty } from '@/features/properties/create'

export default function NewPropertyPage() {
  const router = useRouter()
  const { mutate, isPending, error } = useCreateProperty()

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <h1 className="text-2xl font-semibold tracking-tight">Novo imóvel</h1>
      <FormError message={error?.message} />
      <PropertyForm
        submitLabel="Cadastrar"
        isSubmitting={isPending}
        onSubmit={(values) =>
          mutate(values, {
            onSuccess: (property) => router.push(`/properties/${property.id}`),
          })
        }
      />
    </div>
  )
}
