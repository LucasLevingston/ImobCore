import { describe, expect, it } from 'vitest'
import { getPaginationRange } from './getPaginationRange'
import { ELLIPSIS } from './pagination.constants'

describe('getPaginationRange', () => {
  it('should return every page when totalPages fits within the visible window', () => {
    expect(getPaginationRange(1, 5)).toEqual([1, 2, 3, 4, 5])
  })

  it('should return an empty range when totalPages is 0', () => {
    expect(getPaginationRange(1, 0)).toEqual([])
  })

  it('should show only a right ellipsis when current page is near the start', () => {
    expect(getPaginationRange(1, 20)).toEqual([1, 2, 3, 4, 5, ELLIPSIS, 20])
  })

  it('should show only a left ellipsis when current page is near the end', () => {
    expect(getPaginationRange(20, 20)).toEqual([1, ELLIPSIS, 16, 17, 18, 19, 20])
  })

  it('should show both ellipses when current page is in the middle', () => {
    expect(getPaginationRange(10, 20)).toEqual([1, ELLIPSIS, 9, 10, 11, ELLIPSIS, 20])
  })

  it('should respect a custom siblingCount', () => {
    expect(getPaginationRange(10, 20, 2)).toEqual([1, ELLIPSIS, 8, 9, 10, 11, 12, ELLIPSIS, 20])
  })
})
