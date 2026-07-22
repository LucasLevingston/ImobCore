import { Card, CardContent, CardHeader, Skeleton } from '@microfrontends/ui'

interface PropertyListSkeletonProps {
  count?: number
}

// Formato espelha PropertyCard (título+localização+badge no header, preço+specs
// no content) — skeleton "no formato do conteúdo final", não um spinner genérico.
export function PropertyListSkeleton({ count = 6 }: PropertyListSkeletonProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: placeholder estático sem identidade própria; contagem fixa, nunca reordena
        <Card key={index}>
          <CardHeader className="flex-row items-start justify-between gap-2 space-y-0">
            <div className="w-full space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3.5 w-1/2" />
            </div>
            <Skeleton className="h-5 w-16 shrink-0 rounded-full" />
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
