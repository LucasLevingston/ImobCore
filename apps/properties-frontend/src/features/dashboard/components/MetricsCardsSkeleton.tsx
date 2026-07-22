import { Card, CardContent, CardHeader, Skeleton } from '@microfrontends/ui'

// Formato espelha o grid real de MetricsCards (4 stat cards + 2 breakdown
// cards) — skeleton "no formato do conteúdo final", não um spinner genérico.
export function MetricsCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }, (_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: placeholder estático sem identidade própria; contagem fixa, nunca reordena
        <Card key={`stat-${index}`}>
          <CardContent className="flex items-start justify-between p-5">
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-8 w-16" />
            </div>
            <Skeleton className="h-9 w-9 rounded-lg" />
          </CardContent>
        </Card>
      ))}

      {Array.from({ length: 2 }, (_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: placeholder estático sem identidade própria; contagem fixa, nunca reordena
        <Card key={`breakdown-${index}`} className="sm:col-span-2">
          <CardHeader>
            <Skeleton className="h-5 w-28" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
