import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../middleware/config.js', () => ({
  default: { defaultDataLoad: { vids: 3, vidPages: 4 } }
}))

vi.mock('../../src/main-back.js', () => ({
  dataLookup: vi.fn()
}))

import { buildVidParams, getNewVids } from '../../src/kcna/vids.js'
import { dataLookup } from '../../src/main-back.js'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('buildVidParams', () => {
  it('returns null when given null', () => {
    expect(buildVidParams(null)).toBeNull()
  })

  it('returns correct params for vidType "all" with no howMany', () => {
    expect(buildVidParams({ vidType: 'all' })).toEqual({
      sortKey: 'date',
      sortKey2: 'vidId',
      howMany: 3
    })
  })

  it('caps howMany at 100 for vidType "all"', () => {
    const result = buildVidParams({ vidType: 'all', howMany: 150 })
    expect(result.howMany).toBe(100)
  })

  it('returns correct params for vidType "vidPages" with no howMany', () => {
    expect(buildVidParams({ vidType: 'vidPages' })).toEqual({
      sortKey: 'date',
      sortKey2: 'vidPageId',
      howMany: 4
    })
  })

  it('uses provided howMany for vidType "vidPages"', () => {
    const result = buildVidParams({ vidType: 'vidPages', howMany: 10 })
    expect(result.howMany).toBe(10)
  })

  it('returns null for invalid vidType', () => {
    expect(buildVidParams({ vidType: 'invalid' })).toBeNull()
  })

  it('returns null when vidType is undefined', () => {
    expect(buildVidParams({ vidType: undefined })).toBeNull()
  })
})

describe('getNewVids', () => {
  it('returns null when given null', async () => {
    expect(await getNewVids(null)).toBeNull()
  })

  it('always calls dataLookup with "vidPages" collection and false', async () => {
    dataLookup.mockResolvedValue([])
    await getNewVids({ vidType: 'vidPages', orderBy: 'newest-to-oldest' })
    expect(dataLookup).toHaveBeenCalledWith(
      { sortKey: 'date', sortKey2: 'vidPageId', howMany: 4 },
      'vidPages',
      'newest-to-oldest',
      false
    )
  })

  it('returns null for invalid vidType (buildVidParams returns null)', async () => {
    const result = await getNewVids({ vidType: 'invalid', orderBy: 'newest-to-oldest' })
    expect(result).toBeNull()
    expect(dataLookup).not.toHaveBeenCalled()
  })

  it('propagates the result from dataLookup', async () => {
    dataLookup.mockResolvedValue([{ id: 'v1' }, { id: 'v2' }])
    const result = await getNewVids({ vidType: 'vidPages', orderBy: 'newest-to-oldest' })
    expect(result).toEqual([{ id: 'v1' }, { id: 'v2' }])
  })
})
