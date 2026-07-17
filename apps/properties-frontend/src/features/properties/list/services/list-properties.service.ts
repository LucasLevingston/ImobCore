import { apiClient } from '../../../../lib/api-client'
import type { PaginatedResult, Property } from '../../../../types/property'
import type { ListPropertiesParams } from './list-properties.service.types'

function toQueryString(params: ListPropertiesParams): string {
  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') {
      query.set(key, String(value))
    }
  }
  return query.toString()
}

// Combina os dois endpoints do backend (GET /properties e GET /properties/search)
// atrás de uma única função — o hook não precisa saber qual rota chamar
export async function listProperties(
  params: ListPropertiesParams,
): Promise<PaginatedResult<Property>> {
  const queryString = toQueryString(params)
  const basePath = params.q ? '/api/properties/search' : '/api/properties'
  return apiClient.get<PaginatedResult<Property>>(
    queryString ? `${basePath}?${queryString}` : basePath,
  )
}
