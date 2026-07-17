'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@microfrontends/ui'
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
    <form onSubmit={(event) => void handleSubmit(onSubmit)(event)} className="space-y-4" noValidate>
      <PropertyFormBasicFields register={register} errors={errors} />
      <PropertyFormClassificationFields register={register} errors={errors} />
      <PropertyFormPricingFields register={register} errors={errors} />
      <PropertyFormRoomFields register={register} errors={errors} />
      <PropertyFormExtraFields register={register} errors={errors} />
      <PropertyFormAmenityFields register={register} errors={errors} />
      <PropertyFormAddressFields register={register} errors={errors} />

      <Button type="submit" isLoading={isSubmitting} className="w-full">
        {submitLabel}
      </Button>
    </form>
  )
}
