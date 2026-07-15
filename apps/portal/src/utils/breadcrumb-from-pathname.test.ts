import { describe, expect, it } from 'vitest'
import { breadcrumbFromPathname } from './breadcrumb-from-pathname'

describe('breadcrumbFromPathname', () => {
  it('should return a single "Início" item for the root path', () => {
    expect(breadcrumbFromPathname('/')).toEqual([{ label: 'Início' }])
  })

  it('should build a trail with Início plus one item per segment', () => {
    expect(breadcrumbFromPathname('/clients')).toEqual([
      { label: 'Início', href: '/' },
      { label: 'Clients', href: '/clients' },
    ])
  })

  it('should accumulate the href for nested segments', () => {
    expect(breadcrumbFromPathname('/clients/123')).toEqual([
      { label: 'Início', href: '/' },
      { label: 'Clients', href: '/clients' },
      { label: '123', href: '/clients/123' },
    ])
  })

  it('should ignore a trailing slash', () => {
    expect(breadcrumbFromPathname('/clients/')).toEqual([
      { label: 'Início', href: '/' },
      { label: 'Clients', href: '/clients' },
    ])
  })
})
