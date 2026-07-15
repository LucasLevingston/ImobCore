import { apiClient } from '../../../../lib/api-client'
import type { Property } from '../../../../types/property'
import type { PropertyFormValues } from '../schemas/property-form.schema'

export async function createProperty(input: PropertyFormValues): Promise<Property> {
  return apiClient.post<Property>('/api/properties', input)
}
