'use client'

import { ErrorState, Loading } from '@microfrontends/ui'
import { MetricsCards, useDashboardMetrics } from '@/features/dashboard'

export default function DashboardPage() {
  const { data, isLoading, isError, refetch } = useDashboardMetrics()

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {isLoading && <Loading label="Carregando métricas..." />}
      {isError && (
        <ErrorState title="Não foi possível carregar as métricas" onRetry={() => void refetch()} />
      )}
      {data && <MetricsCards metrics={data} />}
    </div>
  )
}
