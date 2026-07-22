import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@microfrontends/ui'
import Link from 'next/link'
import { memo } from 'react'
import { PROPERTY_STATUS_BADGE_VARIANT, PROPERTY_STATUS_LABELS } from '../../property-status'
import type { PropertyCardProps } from './PropertyCard.types'

const currencyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

// memo: PropertyList re-renderiza a cada mudança de página/filtro — sem
// isso, todo card já renderizado re-executaria mesmo com a mesma `property`
export const PropertyCard = memo(function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Link href={`/properties/${property.id}`} className="group block">
      <Card className="h-full shadow-xs transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md hover:border-brand/40">
        <CardHeader className="flex-row items-start justify-between gap-2 space-y-0">
          <div>
            <CardTitle className="line-clamp-1 group-hover:text-brand">{property.title}</CardTitle>
            <CardDescription className="mt-1">
              {property.district}, {property.city} — {property.state}
            </CardDescription>
          </div>
          <Badge variant={PROPERTY_STATUS_BADGE_VARIANT[property.status]} className="shrink-0">
            {PROPERTY_STATUS_LABELS[property.status]}
          </Badge>
        </CardHeader>
        <CardContent className="flex items-center justify-between text-sm">
          <span className="font-semibold tabular-nums">
            {currencyFormatter.format(property.price)}
          </span>
          <span className="text-muted-foreground">
            {property.bedrooms} qts · {property.bathrooms} banh · {property.area}m²
          </span>
        </CardContent>
      </Card>
    </Link>
  )
})
