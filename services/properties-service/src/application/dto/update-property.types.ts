import type { z } from 'zod'
import type { updatePropertySchema } from './update-property.dto'

export type UpdatePropertyInput = z.infer<typeof updatePropertySchema>
