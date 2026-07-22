import { Card, CardDescription, CardHeader, CardTitle } from '@microfrontends/ui'
import { Construction } from 'lucide-react'
import type { PlaceholderModuleProps } from './PlaceholderModule.types'

// Reaproveitado pelas 6 rotas de módulo ainda não federado (docs/ARCHITECTURE.md
// seção 05a) — troca por conteúdo real quando o respectivo MFE existir.
export function PlaceholderModule({ title, description }: PlaceholderModuleProps) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg items-center justify-center">
      <Card className="w-full text-center">
        <CardHeader className="items-center">
          <span className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-brand">
            <Construction className="h-6 w-6" aria-hidden="true" />
          </span>
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription>
            {description ?? 'Este módulo ainda está em construção.'}
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}
