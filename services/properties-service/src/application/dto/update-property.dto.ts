import type { z } from 'zod'
import { createPropertySchema } from './create-property.dto'

export const updatePropertySchema = createPropertySchema.partial()

export type UpdatePropertyInput = z.infer<typeof updatePropertySchema>
