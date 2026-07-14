import { describe, expect, it } from 'vitest'
import { parseDurationToMs } from './parse-duration'

describe('parseDurationToMs', () => {
  it('should parse seconds', () => {
    expect(parseDurationToMs('30s')).toBe(30 * 1000)
  })

  it('should parse minutes', () => {
    expect(parseDurationToMs('15m')).toBe(15 * 60 * 1000)
  })

  it('should parse hours', () => {
    expect(parseDurationToMs('2h')).toBe(2 * 60 * 60 * 1000)
  })

  it('should parse days', () => {
    expect(parseDurationToMs('7d')).toBe(7 * 24 * 60 * 60 * 1000)
  })

  it('should throw for an unrecognized format', () => {
    expect(() => parseDurationToMs('7 days')).toThrow()
  })

  it('should throw for a missing unit', () => {
    expect(() => parseDurationToMs('7')).toThrow()
  })
})
