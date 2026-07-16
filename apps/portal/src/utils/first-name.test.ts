import { describe, expect, it } from 'vitest'
import { firstName } from './first-name'

describe('firstName', () => {
  it('should return the first word of a full name', () => {
    expect(firstName('Lucas Levingston')).toBe('Lucas')
  })

  it('should return the whole string when there is only one word', () => {
    expect(firstName('Lucas')).toBe('Lucas')
  })

  it('should trim surrounding whitespace before splitting', () => {
    expect(firstName('  Lucas Levingston  ')).toBe('Lucas')
  })

  it('should collapse repeated internal spaces', () => {
    expect(firstName('Lucas   Levingston')).toBe('Lucas')
  })

  it('should return an empty string for an empty name', () => {
    expect(firstName('')).toBe('')
  })
})
