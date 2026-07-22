import { SearchX } from 'lucide-react'
import { PropertyCard } from './PropertyCard'
import type { PropertyListProps } from './PropertyList.types'

export function PropertyList({ properties }: PropertyListProps) {
  if (properties.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-16 text-center">
        <SearchX className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
        <div>
          <p className="font-medium">Nenhum imóvel encontrado.</p>
          <p className="text-sm text-muted-foreground">
            Tente ajustar os filtros ou cadastre um novo imóvel.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  )
}
