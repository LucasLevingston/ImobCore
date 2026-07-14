import { describe, expect, it } from 'vitest'
import { cn } from './utils'

describe('cn', () => {
  it('should join multiple class strings', () => {
    expect(cn('a', 'b')).toBe('a b')
  })

  it('should ignore falsy values', () => {
    expect(cn('a', false, undefined, null, 'b')).toBe('a b')
  })

  it('should apply conditional classes via object syntax', () => {
    expect(cn('base', { active: true, hidden: false })).toBe('base active')
  })

  it('should merge conflicting tailwind classes keeping the last one', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4')
  })
})
