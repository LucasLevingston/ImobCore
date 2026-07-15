import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@microfrontends/ui'
import { iconMap } from '../lib/icon-map'
import type { ModuleDescriptor } from '../routes/modules'

export interface ModuleCardProps {
  module: ModuleDescriptor
}

export function ModuleCard({ module }: ModuleCardProps) {
  const Icon = iconMap[module.iconName]

  const content = (
    <Card className="h-full transition-colors hover:border-primary">
      <CardHeader className="flex-row items-center gap-3 space-y-0">
        <Icon className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
        <CardTitle className="text-base">{module.label}</CardTitle>
      </CardHeader>
      {module.kind === 'placeholder' && (
        <CardContent className="pt-0 text-xs text-muted-foreground">Em breve</CardContent>
      )}
    </Card>
  )

  if (module.kind === 'external') {
    return (
      <a href={module.href} className="block">
        {content}
      </a>
    )
  }

  return (
    <Link href={module.href} className="block">
      {content}
    </Link>
  )
}
