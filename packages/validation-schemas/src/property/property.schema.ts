import { z } from 'zod'

export const PROPERTY_TYPES = [
  'Apartment',
  'House',
  'Land',
  'Commercial',
  'Farm',
  'Studio',
  'Penthouse',
] as const

export const PROPERTY_STATUSES = ['Available', 'Reserved', 'Sold', 'Rented', 'Inactive'] as const

export type PropertyType = (typeof PROPERTY_TYPES)[number]
export type PropertyStatus = (typeof PROPERTY_STATUSES)[number]

export const propertyTypeSchema = z.enum(PROPERTY_TYPES)
export const propertyStatusSchema = z.enum(PROPERTY_STATUSES)

// Formato "server" — campos numéricos já são number (JSON tipado). O formulário
// HTML do frontend precisa de um wrapper próprio em cima disso (coerce de string
// pra number, preprocess de "" pra null) — mecânica de parsing de formulário não
// é regra de negócio, então fica fora deste pacote (ver property-form.schema.ts
// em apps/properties-frontend).
export const createPropertySchema = z.object({
  title: z.string().min(3, 'Título deve ter ao menos 3 caracteres'),
  description: z.string().min(10, 'Descrição deve ter ao menos 10 caracteres'),
  type: propertyTypeSchema,
  status: propertyStatusSchema.default('Available'),
  price: z.number().positive('Preço deve ser positivo'),
  condominiumFee: z.number().nonnegative().nullable().default(null),
  iptu: z.number().nonnegative().nullable().default(null),
  bedrooms: z.number().int().nonnegative(),
  bathrooms: z.number().int().nonnegative(),
  garageSpaces: z.number().int().nonnegative(),
  area: z.number().positive('Área deve ser positiva'),
  lotArea: z.number().positive().nullable().default(null),
  floor: z.number().int().nullable().default(null),
  furnished: z.boolean().default(false),
  acceptsFinancing: z.boolean().default(false),
  acceptsPets: z.boolean().default(false),
  address: z.string().min(3),
  number: z.string().min(1),
  district: z.string().min(1),
  city: z.string().min(1),
  state: z.string().length(2, 'UF deve ter 2 caracteres'),
  zipCode: z.string().min(8, 'CEP inválido'),
  latitude: z.number().nullable().default(null),
  longitude: z.number().nullable().default(null),
})

export type CreatePropertyInput = z.infer<typeof createPropertySchema>
