import { z } from 'zod'
import {
  PROPERTY_STATUSES,
  PROPERTY_TYPES,
  type PropertyStatus,
  type PropertyType,
} from '../../../../types/property'

// Inputs HTML de número vazios chegam como string vazia (nunca `undefined`) — sem
// esse preprocess, z.coerce.number() converteria "" em 0 em vez de null
function nullableNumber(validate?: (schema: z.ZodNumber) => z.ZodNumber) {
  const numberSchema = validate ? validate(z.number()) : z.number()
  return z.preprocess(
    (value) => (value === '' || value === null || value === undefined ? null : value),
    numberSchema.nullable(),
  )
}

// Mesmas regras do createPropertySchema do backend (services/properties-service) — validação
// client-side é UX (feedback rápido), o backend continua sendo a fonte de verdade
export const propertyFormSchema = z.object({
  title: z.string().min(3, 'Título deve ter ao menos 3 caracteres'),
  description: z.string().min(10, 'Descrição deve ter ao menos 10 caracteres'),
  type: z.enum(PROPERTY_TYPES as [PropertyType, ...PropertyType[]]),
  status: z.enum(PROPERTY_STATUSES as [PropertyStatus, ...PropertyStatus[]]),
  price: z.coerce.number().positive('Preço deve ser positivo'),
  condominiumFee: nullableNumber((schema) => schema.nonnegative()),
  iptu: nullableNumber((schema) => schema.nonnegative()),
  bedrooms: z.coerce.number().int().nonnegative(),
  bathrooms: z.coerce.number().int().nonnegative(),
  garageSpaces: z.coerce.number().int().nonnegative(),
  area: z.coerce.number().positive('Área deve ser positiva'),
  lotArea: nullableNumber((schema) => schema.positive()),
  floor: nullableNumber(),
  furnished: z.boolean().default(false),
  acceptsFinancing: z.boolean().default(false),
  acceptsPets: z.boolean().default(false),
  address: z.string().min(3),
  number: z.string().min(1),
  district: z.string().min(1),
  city: z.string().min(1),
  state: z.string().length(2, 'UF deve ter 2 caracteres'),
  zipCode: z.string().min(8, 'CEP inválido'),
  latitude: nullableNumber(),
  longitude: nullableNumber(),
})

export type PropertyFormValues = z.infer<typeof propertyFormSchema>
