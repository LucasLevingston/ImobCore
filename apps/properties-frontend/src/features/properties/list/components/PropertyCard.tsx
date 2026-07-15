import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@microfrontends/ui'
import Link from 'next/link'
import type { Property } from '../../../../types/property'

const currencyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export interface PropertyCardProps {
  property: Property
}

export function PropertyCard({ property }: PropertyCardProps) {
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
}
