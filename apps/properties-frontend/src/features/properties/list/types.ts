import type { PropertyStatus, PropertyType } from '../../../types/property'

// `| undefined` explícito em cada campo — sob exactOptionalPropertyTypes, permite
// que o serviço (que filtra chaves undefined antes de montar a query string) receba
// objetos parcialmente preenchidos sem precisar omitir condicionalmente cada chave
export interface PropertyFilterValues {
  q?: string | undefined
  city?: string | undefined
  type?: PropertyType | undefined
  status?: PropertyStatus | undefined
  minPrice?: number | undefined
  maxPrice?: number | undefined
}
