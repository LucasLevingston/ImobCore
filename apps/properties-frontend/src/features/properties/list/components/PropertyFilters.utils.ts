import type { PropertyFilterValues } from '../types'
import type { RawPropertyFilters } from './PropertyFilters.types'

// Transforma o estado bruto do formulário (strings) em PropertyFilterValues
// (tipos reais, chaves vazias omitidas) — separado do componente pra ser
// testável isoladamente, sem precisar montar/interagir com o form.
export function buildFilterValues(raw: RawPropertyFilters): PropertyFilterValues {
  return {
    ...(raw.q ? { q: raw.q } : {}),
    ...(raw.city ? { city: raw.city } : {}),
    ...(raw.type ? { type: raw.type } : {}),
    ...(raw.status ? { status: raw.status } : {}),
    ...(raw.minPrice ? { minPrice: Number(raw.minPrice) } : {}),
    ...(raw.maxPrice ? { maxPrice: Number(raw.maxPrice) } : {}),
  }
}
