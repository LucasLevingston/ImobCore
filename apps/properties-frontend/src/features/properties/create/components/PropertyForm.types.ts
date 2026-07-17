import type { FieldErrors, UseFormRegister } from 'react-hook-form'
import type { z } from 'zod'
import type { propertyFormSchema, PropertyFormValues } from '../schemas/property-form.schema'

// propertyFormSchema usa z.preprocess (nullableNumber) pra campos numéricos
// nullable — o tipo de entrada (antes do parse) diverge do tipo de saída
// (depois do parse), então precisa dos 3 generics do RHF 7.55+ pra @hookform/
// resolvers v5 tipar corretamente: TFieldValues (bruto, o que os inputs HTML
// realmente produzem) e TTransformedValues (o que o resolver devolve)
export type PropertyFormInput = z.input<typeof propertyFormSchema>

export interface PropertyFormProps {
  defaultValues?: Partial<PropertyFormValues>
  onSubmit: (values: PropertyFormValues) => void
  isSubmitting?: boolean
  submitLabel?: string
}

export interface PropertyFormFieldsProps {
  register: UseFormRegister<PropertyFormInput>
  errors: FieldErrors<PropertyFormInput>
}
