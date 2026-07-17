import { cn } from '../../lib/utils'
import { sizeConfig } from './Logo.constants'
import type { LogoProps } from './Logo.types'

function LogoMark({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className={className}
      aria-hidden="true"
    >
      <path d="M3 11.5 12 4l9 7.5" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// Framework-agnostic (nunca importa next/link — mesma regra de Header/Sidebar,
// docs/ARCHITECTURE.md seção 08): `href` gera um <a> nativo. Um app Next.js
// que queira navegação client-side compõe por fora (<Link href="/"><Logo />
// </Link>) em vez de passar href aqui — decisão do app consumidor, não do
// design system (DIP).
export function Logo({ variant = 'full', size = 'md', href, className }: LogoProps) {
  const config = sizeConfig[size]
  const sharedClassName = cn('inline-flex items-center gap-2', className)

  // Nome da marca sempre existe como texto real no DOM (a11y) — no variant
  // "icon" ele só fica visualmente oculto (sr-only), nunca ausente.
  const content = (
    <>
      <LogoMark className={cn('shrink-0 text-primary', config.icon)} />
      <span
        className={variant === 'full' ? cn('font-semibold tracking-tight', config.text) : 'sr-only'}
      >
        ImobCore
      </span>
    </>
  )

  if (href) {
    return (
      <a
        href={href}
        className={cn(
          sharedClassName,
          'rounded-sm transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        )}
      >
        {content}
      </a>
    )
  }

  return <div className={sharedClassName}>{content}</div>
}
