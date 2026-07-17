import type { PropertyFilterValues } from '../types'

export interface PropertyFiltersProps {
  initialValues?: PropertyFilterValues | undefined
  onApply: (filters: PropertyFilterValues) => void
}
