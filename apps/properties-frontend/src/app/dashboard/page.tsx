'use client'

import { ErrorState } from '@microfrontends/ui'
import { MetricsCards, MetricsCardsSkeleton, useDashboardMetrics } from '@/features/dashboard'

export default function DashboardPage() {
  const { data, isLoading, isError, refetch } = useDashboardMetrics()

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Visão geral dos seus imóveis.</p>
      </div>

      {isLoading && <MetricsCardsSkeleton />}
      {isError && (
        <ErrorState title="Não foi possível carregar as métricas" onRetry={() => void refetch()} />
      )}
      {data && <MetricsCards metrics={data} />}
    </div>
  )
}
