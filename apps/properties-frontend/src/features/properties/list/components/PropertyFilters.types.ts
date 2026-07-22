import type { PropertyStatus, PropertyType } from '../../../../types/property'
import type { PropertyFilterValues } from '../types'

export interface PropertyFiltersProps {
  initialValues?: PropertyFilterValues | undefined
  onApply: (filters: PropertyFilterValues) => void
}

export interface RawPropertyFilters {
  q: string
  city: string
  type: PropertyType | ''
  status: PropertyStatus | ''
  minPrice: string
  maxPrice: string
}
