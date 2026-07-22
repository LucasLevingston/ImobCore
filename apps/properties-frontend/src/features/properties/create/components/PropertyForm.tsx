'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@microfrontends/ui'
import type { ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { type PropertyFormValues, propertyFormSchema } from '../schemas/property-form.schema'
import { EMPTY_DEFAULTS } from './PropertyForm.constants'
import type { PropertyFormInput, PropertyFormProps } from './PropertyForm.types'
import { PropertyFormAddressFields } from './PropertyFormAddressFields'
import { PropertyFormAmenityFields } from './PropertyFormAmenityFields'
import { PropertyFormBasicFields } from './PropertyFormBasicFields'
import { PropertyFormClassificationFields } from './PropertyFormClassificationFields'
import { PropertyFormExtraFields } from './PropertyFormExtraFields'
import { PropertyFormPricingFields } from './PropertyFormPricingFields'
import { PropertyFormRoomFields } from './PropertyFormRoomFields'

function FormSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-4 rounded-xl border border-border/70 bg-card p-5 shadow-xs">
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  )
}

export function PropertyForm({
  defaultValues,
  onSubmit,
  isSubmitting = false,
  submitLabel = 'Salvar',
}: PropertyFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PropertyFormInput, unknown, PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: { ...EMPTY_DEFAULTS, ...defaultValues },
  })

  return (
    <form onSubmit={(event) => void handleSubmit(onSubmit)(event)} className="space-y-5" noValidate>
      <FormSection title="Informações básicas">
        <PropertyFormBasicFields register={register} errors={errors} />
      </FormSection>

      <FormSection title="Classificação">
        <PropertyFormClassificationFields register={register} errors={errors} />
      </FormSection>

      <FormSection title="Preço e condições">
        <PropertyFormPricingFields register={register} errors={errors} />
      </FormSection>

      <FormSection title="Cômodos">
        <PropertyFormRoomFields register={register} errors={errors} />
      </FormSection>

      <FormSection title="Detalhes adicionais">
        <PropertyFormExtraFields register={register} errors={errors} />
      </FormSection>

      <FormSection title="Comodidades">
        <PropertyFormAmenityFields register={register} errors={errors} />
      </FormSection>

      <FormSection title="Endereço">
        <PropertyFormAddressFields register={register} errors={errors} />
      </FormSection>

      <Button type="submit" isLoading={isSubmitting} className="w-full">
        {submitLabel}
      </Button>
    </form>
  )
}
