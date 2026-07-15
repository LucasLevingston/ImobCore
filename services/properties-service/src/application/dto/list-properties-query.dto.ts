import { z } from 'zod'
import { propertyStatusSchema, propertyTypeSchema } from './create-property.dto'

// Query string chega como texto — z.coerce converte number/int; booleans precisam de
// tratamento manual porque Boolean("false") é `true` em JS (z.coerce.boolean cairia nessa pegadinha)
const booleanQueryParam = z
  .union([z.boolean(), z.enum(['true', 'false'])])
  .transform((value) => (typeof value === 'boolean' ? value : value === 'true'))
  .optional()

export const listPropertiesQuerySchema = z.object({
  city: z.string().optional(),
  district: z.string().optional(),
  type: propertyTypeSchema.optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  bedrooms: z.coerce.number().int().optional(),
  bathrooms: z.coerce.number().int().optional(),
  garageSpaces: z.coerce.number().int().optional(),
  minArea: z.coerce.number().optional(),
  maxArea: z.coerce.number().optional(),
  status: propertyStatusSchema.optional(),
  acceptsFinancing: booleanQueryParam,
  acceptsPets: booleanQueryParam,
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.enum(['price', 'area', 'bedrooms', 'createdAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

export type ListPropertiesQuery = z.infer<typeof listPropertiesQuerySchema>
