import type { BreadcrumbItem } from '@microfrontends/ui'

function capitalize(segment: string): string {
  return segment.charAt(0).toUpperCase() + segment.slice(1)
}

// Pura — sem next/navigation, testável isolada. PortalBreadcrumb chama com o
// valor de usePathname() e passa o resultado direto pro Breadcrumb de packages/ui.
export function breadcrumbFromPathname(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean)

  if (segments.length === 0) {
    return [{ label: 'Início' }]
  }

  const items: BreadcrumbItem[] = [{ label: 'Início', href: '/' }]
  let accumulated = ''
  for (const segment of segments) {
    accumulated += `/${segment}`
    items.push({ label: capitalize(segment), href: accumulated })
  }
  return items
}
