import { apiClient } from '../../../../lib/api-client'
import type { Property } from '../../../../types/property'

export async function getProperty(id: string): Promise<Property> {
  return apiClient.get<Property>(`/api/properties/${id}`)
}
