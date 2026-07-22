import { describe, expect, it } from 'vitest'
import { getInitials } from './ProfileCard.utils'

describe('getInitials', () => {
  it('should return the first letter of each of the first two words, uppercased', () => {
    expect(getInitials('Lucas Levingston')).toBe('LL')
  })

  it('should return a single letter for a one-word name', () => {
    expect(getInitials('Lucas')).toBe('L')
  })

  it('should ignore extra whitespace between words', () => {
    expect(getInitials('  Lucas   Levingston  ')).toBe('LL')
  })
})
