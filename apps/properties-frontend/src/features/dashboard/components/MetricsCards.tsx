import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@microfrontends/ui'
import { Building2, CheckCircle2, MapPin, Wallet } from 'lucide-react'
import type { ReactNode } from 'react'
import type { MetricsCardsProps } from './MetricsCards.types'

const currencyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

interface StatCardProps {
  label: string
  value: string | number
  icon: ReactNode
}

function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <Card>
      <CardContent className="flex items-start justify-between p-5">
        <div>
          <CardDescription>{label}</CardDescription>
          <p className="mt-2 text-3xl font-semibold tracking-tight tabular-nums">{value}</p>
        </div>
        <div className="rounded-lg bg-brand/10 p-2 text-brand">{icon}</div>
      </CardContent>
    </Card>
  )
}

function BreakdownCard({
  title,
  entries,
}: {
  title: string
  entries: { label: string; count: number }[]
}) {
  return (
    <Card className="sm:col-span-2">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sem dados disponíveis.</p>
        ) : (
          <ul className="divide-y divide-border/70">
            {entries.map((entry) => (
              <li key={entry.label} className="flex items-center justify-between py-2 text-sm">
                <span className="text-foreground/90">{entry.label}</span>
                <span className="tabular-nums text-muted-foreground">{entry.count}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

export function MetricsCards({ metrics }: MetricsCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="Total de imóveis"
        value={metrics.total}
        icon={<Building2 className="h-5 w-5" />}
      />
      <StatCard
        label="Preço médio"
        value={currencyFormatter.format(metrics.averagePrice)}
        icon={<Wallet className="h-5 w-5" />}
      />
      <StatCard
        label="Disponíveis"
        value={metrics.byStatus.Available}
        icon={<CheckCircle2 className="h-5 w-5" />}
      />
      <StatCard
        label="Vendidos/Alugados"
        value={metrics.byStatus.Sold + metrics.byStatus.Rented}
        icon={<MapPin className="h-5 w-5" />}
      />

      <BreakdownCard
        title="Por cidade"
        entries={metrics.byCity.map((entry) => ({ label: entry.city, count: entry.count }))}
      />
      <BreakdownCard
        title="Por bairro"
        entries={metrics.byDistrict.map((entry) => ({ label: entry.district, count: entry.count }))}
      />
    </div>
  )
}
