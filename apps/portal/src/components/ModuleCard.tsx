import { Card, CardContent, CardHeader, CardTitle } from '@microfrontends/ui'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { iconMap } from '../lib/icon-map'
import type { ModuleCardProps } from './ModuleCard.types'

const LINK_CLASSNAME =
  'group block rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'

export function ModuleCard({ module }: ModuleCardProps) {
  const Icon = iconMap[module.iconName]

  const content = (
    <Card className="h-full cursor-pointer transition-all duration-200 hover:border-primary/50 hover:shadow-md">
      <CardHeader className="flex-row items-center gap-3 space-y-0">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Icon className="h-4.5 w-4.5" aria-hidden="true" />
        </span>
        <CardTitle className="flex-1 text-base">{module.label}</CardTitle>
        <ArrowRight
          className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          aria-hidden="true"
        />
      </CardHeader>
      {module.kind === 'placeholder' && (
        <CardContent className="pt-0 text-xs text-muted-foreground">Em breve</CardContent>
      )}
    </Card>
  )

  if (module.kind === 'external') {
    return (
      <a href={module.href} className={LINK_CLASSNAME}>
        {content}
      </a>
    )
  }

  return (
    <Link href={module.href} className={LINK_CLASSNAME}>
      {content}
    </Link>
  )
}
