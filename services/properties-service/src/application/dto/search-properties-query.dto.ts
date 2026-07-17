import { z } from 'zod'
import { listPropertiesQuerySchema } from './list-properties-query.dto'

export const searchPropertiesQuerySchema = listPropertiesQuerySchema.extend({
  q: z.string().min(1, 'Termo de busca é obrigatório'),
})
