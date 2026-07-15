import { apiClient } from '../../../../lib/api-client'
import type { Property } from '../../../../types/property'
import type { PropertyFormValues } from '../../create/schemas/property-form.schema'

export async function updateProperty(id: string, input: PropertyFormValues): Promise<Property> {
  return apiClient.put<Property>(`/api/properties/${id}`, input)
}
