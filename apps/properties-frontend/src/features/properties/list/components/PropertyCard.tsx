import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@microfrontends/ui'
import Link from 'next/link'
import { memo } from 'react'
import type { PropertyCardProps } from './PropertyCard.types'

const currencyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

// memo: PropertyList re-renderiza a cada mudança de página/filtro — sem
// isso, todo card já renderizado re-executaria mesmo com a mesma `property`
export const PropertyCard = memo(function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Link href={`/properties/${property.id}`} className="block">
      <Card className="h-full transition-colors hover:border-primary">
        <CardHeader>
          <CardTitle>{property.title}</CardTitle>
          <CardDescription>
            {property.district}, {property.city} — {property.state}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between text-sm">
          <span className="font-semibold">{currencyFormatter.format(property.price)}</span>
          <span className="text-muted-foreground">
            {property.bedrooms} qts · {property.bathrooms} banh · {property.area}m²
          </span>
        </CardContent>
      </Card>
    </Link>
  )
})
