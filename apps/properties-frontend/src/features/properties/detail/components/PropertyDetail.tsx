import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@microfrontends/ui'
import type { ReactNode } from 'react'
import { PROPERTY_STATUS_BADGE_VARIANT, PROPERTY_STATUS_LABELS } from '../../property-status'
import type { PropertyDetailProps } from './PropertyDetail.types'

const currencyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

function Spec({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 font-medium">{value}</dd>
    </div>
  )
}

export function PropertyDetail({ property }: PropertyDetailProps) {
  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-2 space-y-0">
        <div>
          <CardTitle>{property.title}</CardTitle>
          <CardDescription className="mt-1">
            {property.address}, {property.number} — {property.district}, {property.city}/
            {property.state} — {property.zipCode}
          </CardDescription>
        </div>
        <Badge variant={PROPERTY_STATUS_BADGE_VARIANT[property.status]} className="shrink-0">
          {PROPERTY_STATUS_LABELS[property.status]}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-sm leading-relaxed text-foreground/90">{property.description}</p>

        <div className="border-t border-border/70 pt-4">
          <h3 className="mb-3 text-sm font-medium text-foreground">Especificações</h3>
          <dl className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
            <Spec label="Preço" value={currencyFormatter.format(property.price)} />
            <Spec label="Tipo" value={property.type} />
            <Spec label="Quartos" value={property.bedrooms} />
            <Spec label="Banheiros" value={property.bathrooms} />
            <Spec label="Vagas" value={property.garageSpaces} />
            <Spec label="Área" value={`${property.area}m²`} />
            <Spec label="Aceita financiamento" value={property.acceptsFinancing ? 'Sim' : 'Não'} />
            <Spec label="Aceita pets" value={property.acceptsPets ? 'Sim' : 'Não'} />
          </dl>
        </div>
      </CardContent>
    </Card>
  )
}
