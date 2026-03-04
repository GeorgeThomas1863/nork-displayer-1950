import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../src/kcna/articles.js', () => ({ getNewArticles: vi.fn() }))
vi.mock('../../src/kcna/pics.js', () => ({ getNewPics: vi.fn() }))
vi.mock('../../src/kcna/vids.js', () => ({ getNewVids: vi.fn() }))
vi.mock('../../models/db-model.js', () => ({ default: vi.fn() }))

import { runUpdateDisplayData, dataLookup } from '../../src/main-back.js'
import { getNewArticles } from '../../src/kcna/articles.js'
import { getNewPics } from '../../src/kcna/pics.js'
import { getNewVids } from '../../src/kcna/vids.js'
import dbModel from '../../models/db-model.js'

describe('runUpdateDisplayData', () => {
  const mockMethods = {
    getNewestItemsArray: vi.fn(),
    getOldestItemsArray: vi.fn(),
    getNewestItemsByTypeArray: vi.fn(),
    getOldestItemsByTypeArray: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    dbModel.mockImplementation(() => mockMethods)
  })

  it('returns null when inputParams is null', async () => {
    const result = await runUpdateDisplayData(null)
    expect(result).toBeNull()
  })

  it('returns data from getNewArticles when typeTrigger is articles', async () => {
    getNewArticles.mockResolvedValue(['a'])
    const result = await runUpdateDisplayData({ typeTrigger: 'articles' })
    expect(result).toEqual(['a'])
  })

  it('calls getNewPics when typeTrigger is pics', async () => {
    getNewPics.mockResolvedValue(['pic1'])
    await runUpdateDisplayData({ typeTrigger: 'pics' })
    expect(getNewPics).toHaveBeenCalledWith({ typeTrigger: 'pics' })
  })

  it('calls getNewVids when typeTrigger is vids', async () => {
    getNewVids.mockResolvedValue(['vid1'])
    await runUpdateDisplayData({ typeTrigger: 'vids' })
    expect(getNewVids).toHaveBeenCalledWith({ typeTrigger: 'vids' })
  })

  it('returns null for unknown typeTrigger', async () => {
    const result = await runUpdateDisplayData({ typeTrigger: 'unknown' })
    expect(result).toBeNull()
  })

  it('returns null when getNewArticles returns null', async () => {
    getNewArticles.mockResolvedValue(null)
    const result = await runUpdateDisplayData({ typeTrigger: 'articles' })
    expect(result).toBeNull()
  })

  it('returns null when getNewArticles returns empty array', async () => {
    getNewArticles.mockResolvedValue([])
    const result = await runUpdateDisplayData({ typeTrigger: 'articles' })
    expect(result).toBeNull()
  })

  it('returns array when getNewArticles returns multiple items', async () => {
    const items = [{ id: 1 }, { id: 2 }]
    getNewArticles.mockResolvedValue(items)
    const result = await runUpdateDisplayData({ typeTrigger: 'articles' })
    expect(result).toEqual(items)
  })
})

describe('dataLookup', () => {
  const mockMethods = {
    getNewestItemsArray: vi.fn(),
    getOldestItemsArray: vi.fn(),
    getNewestItemsByTypeArray: vi.fn(),
    getOldestItemsByTypeArray: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    dbModel.mockImplementation(() => mockMethods)
  })

  it('returns null when params is null', async () => {
    const result = await dataLookup(null, 'col', 'newest-to-oldest')
    expect(result).toBeNull()
  })

  it('returns null when collection is null', async () => {
    const result = await dataLookup({ q: 1 }, null, 'newest-to-oldest')
    expect(result).toBeNull()
  })

  it('returns null when orderBy is null', async () => {
    const result = await dataLookup({ q: 1 }, 'col', null)
    expect(result).toBeNull()
  })

  it('calls getNewestItemsArray when typeIncluded is false and orderBy is newest-to-oldest', async () => {
    const expected = [{ id: 1 }]
    mockMethods.getNewestItemsArray.mockResolvedValue(expected)
    const result = await dataLookup({ q: 1 }, 'col', 'newest-to-oldest', false)
    expect(mockMethods.getNewestItemsArray).toHaveBeenCalled()
    expect(result).toEqual(expected)
  })

  it('calls getOldestItemsArray when typeIncluded is false and orderBy is oldest-to-newest', async () => {
    const expected = [{ id: 2 }]
    mockMethods.getOldestItemsArray.mockResolvedValue(expected)
    const result = await dataLookup({ q: 1 }, 'col', 'oldest-to-newest', false)
    expect(mockMethods.getOldestItemsArray).toHaveBeenCalled()
    expect(result).toEqual(expected)
  })

  it('calls getNewestItemsByTypeArray when typeIncluded is true and orderBy is newest-to-oldest', async () => {
    const expected = [{ id: 3 }]
    mockMethods.getNewestItemsByTypeArray.mockResolvedValue(expected)
    const result = await dataLookup({ q: 1 }, 'col', 'newest-to-oldest', true)
    expect(mockMethods.getNewestItemsByTypeArray).toHaveBeenCalled()
    expect(result).toEqual(expected)
  })

  it('calls getOldestItemsByTypeArray when typeIncluded is true and orderBy is oldest-to-newest', async () => {
    const expected = [{ id: 4 }]
    mockMethods.getOldestItemsByTypeArray.mockResolvedValue(expected)
    const result = await dataLookup({ q: 1 }, 'col', 'oldest-to-newest', true)
    expect(mockMethods.getOldestItemsByTypeArray).toHaveBeenCalled()
    expect(result).toEqual(expected)
  })

  it('returns null for bad orderBy when typeIncluded is false', async () => {
    const result = await dataLookup({ q: 1 }, 'col', 'bad-order', false)
    expect(result).toBeNull()
  })

  it('returns null for bad orderBy when typeIncluded is true', async () => {
    const result = await dataLookup({ q: 1 }, 'col', 'bad-order', true)
    expect(result).toBeNull()
  })

  it('constructs dbModel with correct params and collection', async () => {
    mockMethods.getNewestItemsArray.mockResolvedValue([{ id: 5 }])
    const params = { howMany: 10 }
    await dataLookup(params, 'articles', 'newest-to-oldest', false)
    expect(dbModel).toHaveBeenCalledWith(params, 'articles')
  })
})
