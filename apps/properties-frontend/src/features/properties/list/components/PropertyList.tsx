import { PropertyCard } from './PropertyCard'
import type { PropertyListProps } from './PropertyList.types'

export function PropertyList({ properties }: PropertyListProps) {
  if (properties.length === 0) {
    return <p className="text-center text-muted-foreground">Nenhum imóvel encontrado.</p>
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  )
}
