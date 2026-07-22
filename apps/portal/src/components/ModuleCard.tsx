import { Card, CardContent, CardHeader, CardTitle } from '@microfrontends/ui'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { iconMap } from '../lib/icon-map'
import type { ModuleKind } from '../routes/modules.types'
import type { ModuleCardProps } from './ModuleCard.types'

const LINK_CLASSNAME =
  'group block rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'

interface LinkWrapperProps {
  href: string
  className: string
  children: ReactNode
}

function InternalLink({ href, className, children }: LinkWrapperProps) {
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  )
}

function ExternalLink({ href, className, children }: LinkWrapperProps) {
  return (
    <a href={href} className={className}>
      {children}
    </a>
  )
}

// Config por kind, não if/else no corpo do componente — um novo ModuleKind
// (ex. um 'federated' quando Module Federation entrar de fato) só precisa de
// uma nova entrada aqui, sem tocar no JSX abaixo.
const KIND_CONFIG: Record<ModuleKind, { Wrapper: typeof InternalLink; showComingSoon: boolean }> = {
  internal: { Wrapper: InternalLink, showComingSoon: false },
  external: { Wrapper: ExternalLink, showComingSoon: false },
  placeholder: { Wrapper: InternalLink, showComingSoon: true },
}

export function ModuleCard({ module }: ModuleCardProps) {
  const Icon = iconMap[module.iconName]
  const { Wrapper, showComingSoon } = KIND_CONFIG[module.kind]

  return (
    <Wrapper href={module.href} className={LINK_CLASSNAME}>
      <Card className="h-full cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-md">
        <CardHeader className="flex-row items-center gap-3 space-y-0">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
            <Icon className="h-4.5 w-4.5" aria-hidden="true" />
          </span>
          <CardTitle className="flex-1 text-base">{module.label}</CardTitle>
          <ArrowRight
            className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            aria-hidden="true"
          />
        </CardHeader>
        {showComingSoon && (
          <CardContent className="pt-0 text-xs text-muted-foreground">Em breve</CardContent>
        )}
      </Card>
    </Wrapper>
  )
}
