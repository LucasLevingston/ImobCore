import { z } from 'zod'
import { propertyResponseSchema } from '@microfrontends/validation-schemas'

export const paginatedPropertiesSchema = z.object({
  items: z.array(propertyResponseSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
})
