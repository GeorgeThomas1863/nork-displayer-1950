import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

vi.mock('../../src/main-back.js', () => ({
  dataLookup: vi.fn()
}))

import { buildPicParams, getNewPics } from '../../src/kcna/pics.js'
import { dataLookup } from '../../src/main-back.js'

beforeEach(() => {
  vi.clearAllMocks()
  process.env.DEFAULT_LOAD_PICS = '5'
  process.env.DEFAULT_LOAD_PICSETS = '3'
})

afterEach(() => {
  delete process.env.DEFAULT_LOAD_PICS
  delete process.env.DEFAULT_LOAD_PICSETS
})

describe('buildPicParams', () => {
  it('returns null when given null', () => {
    expect(buildPicParams(null)).toBeNull()
  })

  it('returns correct params for picType "all" with no howMany', () => {
    expect(buildPicParams({ picType: 'all' })).toEqual({
      sortKey: 'date',
      sortKey2: 'picId',
      howMany: 5
    })
  })

  it('uses provided howMany for picType "all"', () => {
    const result = buildPicParams({ picType: 'all', howMany: 50 })
    expect(result.howMany).toBe(50)
  })

  it('caps howMany at 100 for picType "all"', () => {
    const result = buildPicParams({ picType: 'all', howMany: 200 })
    expect(result.howMany).toBe(100)
  })

  it('returns correct params for picType "picSets" with no howMany', () => {
    expect(buildPicParams({ picType: 'picSets' })).toEqual({
      sortKey: 'date',
      sortKey2: 'picSetId',
      howMany: 3
    })
  })

  it('uses provided howMany for picType "picSets"', () => {
    const result = buildPicParams({ picType: 'picSets', howMany: 25 })
    expect(result.howMany).toBe(25)
  })

  it('returns null for invalid picType', () => {
    expect(buildPicParams({ picType: 'invalid' })).toBeNull()
  })

  it('returns null when picType is undefined', () => {
    expect(buildPicParams({ picType: undefined })).toBeNull()
  })
})

describe('getNewPics', () => {
  it('returns null when given null', async () => {
    expect(await getNewPics(null)).toBeNull()
  })

  it('calls dataLookup with "pics" collection for picType "all"', async () => {
    dataLookup.mockResolvedValue([])
    await getNewPics({ picType: 'all', orderBy: 'newest-to-oldest' })
    expect(dataLookup).toHaveBeenCalledWith(
      { sortKey: 'date', sortKey2: 'picId', howMany: 5 },
      'pics',
      'newest-to-oldest',
      false
    )
  })

  it('calls dataLookup with "picSets" collection for picType "picSets"', async () => {
    dataLookup.mockResolvedValue([])
    await getNewPics({ picType: 'picSets', orderBy: 'newest-to-oldest' })
    expect(dataLookup).toHaveBeenCalledWith(
      { sortKey: 'date', sortKey2: 'picSetId', howMany: 3 },
      'picSets',
      'newest-to-oldest',
      false
    )
  })

  it('returns null when buildPicParams returns null (invalid picType)', async () => {
    const result = await getNewPics({ picType: 'invalid', orderBy: 'newest-to-oldest' })
    expect(result).toBeNull()
    expect(dataLookup).not.toHaveBeenCalled()
  })

  it('propagates the result from dataLookup', async () => {
    dataLookup.mockResolvedValue([{ id: 1 }, { id: 2 }])
    const result = await getNewPics({ picType: 'all', orderBy: 'newest-to-oldest' })
    expect(result).toEqual([{ id: 1 }, { id: 2 }])
  })
})
