import type { z } from 'zod'
import type { searchPropertiesQuerySchema } from './search-properties-query.dto'

export type SearchPropertiesQuery = z.infer<typeof searchPropertiesQuerySchema>
