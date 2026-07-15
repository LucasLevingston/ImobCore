import { apiClient } from '../../../../lib/api-client'

export async function deleteProperty(id: string): Promise<void> {
  await apiClient.delete(`/api/properties/${id}`)
}
