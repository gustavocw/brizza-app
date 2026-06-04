import { extractList, extractMeta } from './api.utils'

describe('extractList', () => {
  it('returns a bare array as-is', () => {
    expect(extractList<number>([1, 2, 3])).toEqual([1, 2, 3])
  })
  it('unwraps { data: [] }', () => {
    expect(extractList<number>({ data: [1, 2] })).toEqual([1, 2])
  })
  it('falls back to [] on junk', () => {
    expect(extractList(null)).toEqual([])
    expect(extractList(42)).toEqual([])
  })
})

describe('extractMeta', () => {
  it('reads a flat { total } and derives totalPages', () => {
    expect(extractMeta({ total: 40 }, 20)).toMatchObject({ total: 40, totalPages: 2 })
  })
  it('reads a nested { meta }', () => {
    expect(extractMeta({ meta: { total: 9, limit: 3, page: 2 } })).toMatchObject({
      total: 9,
      limit: 3,
      page: 2,
      totalPages: 3,
    })
  })
})
