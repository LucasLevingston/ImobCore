import { Card, CardDescription, CardHeader, CardTitle } from '@microfrontends/ui'

export interface PlaceholderModuleProps {
  title: string
  description?: string
}

// Reaproveitado pelas 6 rotas de módulo ainda não federado (docs/ARCHITECTURE.md
// seção 05a) — troca por conteúdo real quando o respectivo MFE existir.
export function PlaceholderModule({ title, description }: PlaceholderModuleProps) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg items-center justify-center">
      <Card className="w-full text-center">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            {description ?? 'Este módulo ainda está em construção.'}
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}
