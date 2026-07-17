import { propertyResponseSchema } from '@microfrontends/validation-schemas'
import { z } from 'zod'

export const paginatedPropertiesSchema = z.object({
  items: z.array(propertyResponseSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
})
