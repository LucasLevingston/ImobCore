import { z } from 'zod'

export const propertyIdParamsSchema = z.object({ id: z.string() })

export type PropertyIdParams = z.infer<typeof propertyIdParamsSchema>
