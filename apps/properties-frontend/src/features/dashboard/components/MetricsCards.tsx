import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@microfrontends/ui'
import type { MetricsCardsProps } from './MetricsCards.types'

const currencyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export function MetricsCards({ metrics }: MetricsCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader>
          <CardDescription>Total de imóveis</CardDescription>
          <CardTitle>{metrics.total}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>Preço médio</CardDescription>
          <CardTitle>{currencyFormatter.format(metrics.averagePrice)}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>Disponíveis</CardDescription>
          <CardTitle>{metrics.byStatus.Available}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>Vendidos/Alugados</CardDescription>
          <CardTitle>{metrics.byStatus.Sold + metrics.byStatus.Rented}</CardTitle>
        </CardHeader>
      </Card>

      <Card className="sm:col-span-2">
        <CardHeader>
          <CardTitle>Por cidade</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1 text-sm">
            {metrics.byCity.map((entry) => (
              <li key={entry.city} className="flex justify-between">
                <span>{entry.city}</span>
                <span>{entry.count}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="sm:col-span-2">
        <CardHeader>
          <CardTitle>Por bairro</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1 text-sm">
            {metrics.byDistrict.map((entry) => (
              <li key={entry.district} className="flex justify-between">
                <span>{entry.district}</span>
                <span>{entry.count}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
