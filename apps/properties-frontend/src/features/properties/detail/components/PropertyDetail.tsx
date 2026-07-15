import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@microfrontends/ui'
import type { Property } from '../../../../types/property'

const currencyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export interface PropertyDetailProps {
  property: Property
}

export function PropertyDetail({ property }: PropertyDetailProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{property.title}</CardTitle>
        <CardDescription>
          {property.address}, {property.number} — {property.district}, {property.city}/
          {property.state} — {property.zipCode}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>{property.description}</p>
        <dl className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-muted-foreground">Preço</dt>
            <dd className="font-semibold">{currencyFormatter.format(property.price)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Tipo</dt>
            <dd>{property.type}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Status</dt>
            <dd>{property.status}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Quartos</dt>
            <dd>{property.bedrooms}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Banheiros</dt>
            <dd>{property.bathrooms}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Vagas</dt>
            <dd>{property.garageSpaces}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Área</dt>
            <dd>{property.area}m²</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Aceita financiamento</dt>
            <dd>{property.acceptsFinancing ? 'Sim' : 'Não'}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Aceita pets</dt>
            <dd>{property.acceptsPets ? 'Sim' : 'Não'}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  )
}
