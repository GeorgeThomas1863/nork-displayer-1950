import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

vi.mock('../../src/main-back.js', () => ({
  dataLookup: vi.fn()
}))

import { buildArticleParams, getNewArticles } from '../../src/kcna/articles.js'
import { dataLookup } from '../../src/main-back.js'

beforeEach(() => {
  vi.clearAllMocks()
  process.env.DEFAULT_LOAD_ARTICLES = '3'
})

afterEach(() => {
  delete process.env.DEFAULT_LOAD_ARTICLES
})

describe('buildArticleParams', () => {
  it('returns null when given null', () => {
    expect(buildArticleParams(null)).toBeNull()
  })

  it('returns correct params for articleType "all" with no howMany', () => {
    expect(buildArticleParams({ articleType: 'all' })).toEqual({
      sortKey: 'date',
      sortKey2: 'articleId',
      howMany: 3
    })
  })

  it('uses provided howMany for articleType "all"', () => {
    const result = buildArticleParams({ articleType: 'all', howMany: 50 })
    expect(result.howMany).toBe(50)
  })

  it('caps howMany at 100 for articleType "all"', () => {
    const result = buildArticleParams({ articleType: 'all', howMany: 200 })
    expect(result.howMany).toBe(100)
  })

  it('coerces string howMany to number for articleType "all"', () => {
    const result = buildArticleParams({ articleType: 'all', howMany: '10' })
    expect(result.howMany).toBe(10)
  })

  it('returns filter params for articleType "fatboy"', () => {
    expect(buildArticleParams({ articleType: 'fatboy' })).toEqual({
      filterKey: 'articleType',
      filterValue: 'fatboy',
      howMany: 3,
      sortKey: 'date'
    })
  })

  it('uses provided howMany for non-all articleType', () => {
    const result = buildArticleParams({ articleType: 'topNews', howMany: 25 })
    expect(result.howMany).toBe(25)
  })

  it('uses default when howMany is 0 (falsy)', () => {
    const result = buildArticleParams({ articleType: 'anecdote', howMany: 0 })
    expect(result.howMany).toBe(3)
  })

  it('sets filterValue to "people" for articleType "people"', () => {
    const result = buildArticleParams({ articleType: 'people' })
    expect(result.filterValue).toBe('people')
  })
})

describe('getNewArticles', () => {
  it('returns null when given null', async () => {
    expect(await getNewArticles(null)).toBeNull()
  })

  it('calls dataLookup with correct args for articleType "all"', async () => {
    dataLookup.mockResolvedValue([])
    await getNewArticles({ articleType: 'all', orderBy: 'newest-to-oldest' })
    expect(dataLookup).toHaveBeenCalledWith(
      { sortKey: 'date', sortKey2: 'articleId', howMany: 3 },
      'articles',
      'newest-to-oldest',
      false
    )
  })

  it('calls dataLookup with true for non-all articleType', async () => {
    dataLookup.mockResolvedValue([])
    await getNewArticles({ articleType: 'fatboy', orderBy: 'newest-to-oldest' })
    expect(dataLookup).toHaveBeenCalledWith(
      { filterKey: 'articleType', filterValue: 'fatboy', howMany: 3, sortKey: 'date' },
      'articles',
      'newest-to-oldest',
      true
    )
  })

  it('returns the value from dataLookup', async () => {
    dataLookup.mockResolvedValue([1, 2, 3])
    const result = await getNewArticles({ articleType: 'all', orderBy: 'newest-to-oldest' })
    expect(result).toEqual([1, 2, 3])
  })

  it('returns null when dataLookup returns null', async () => {
    dataLookup.mockResolvedValue(null)
    const result = await getNewArticles({ articleType: 'all', orderBy: 'newest-to-oldest' })
    expect(result).toBeNull()
  })
})
