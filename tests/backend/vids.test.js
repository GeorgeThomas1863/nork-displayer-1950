import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const getNewestWatchVidsArray = vi.fn()
const getOldestWatchVidsArray = vi.fn()

vi.mock('../../models/db-model.js', () => ({
  default: vi.fn(function () {
    return { getNewestWatchVidsArray, getOldestWatchVidsArray }
  }),
}))

import dbModel from '../../models/db-model.js'
import { buildVidParams, getNewVids } from '../../src/kcna/vids.js'

beforeEach(() => {
  vi.clearAllMocks()
  process.env.DEFAULT_LOAD_VIDS = '3'
  process.env.DEFAULT_LOAD_VIDPAGES = '4'
  process.env.EXPRESS_WATCH_PATH = '/watch/'
})

afterEach(() => {
  delete process.env.DEFAULT_LOAD_VIDS
  delete process.env.DEFAULT_LOAD_VIDPAGES
  delete process.env.EXPRESS_WATCH_PATH
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

  it('returns correct params for vidType "watch" with no howMany', () => {
    expect(buildVidParams({ vidType: 'watch' })).toEqual({
      sortKey: 'date',
      sortKey2: 'vidPageId',
      howMany: 4
    })
  })

  it('uses provided howMany for vidType "watch"', () => {
    const result = buildVidParams({ vidType: 'watch', howMany: 10 })
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

  it('queries the "watch" collection with the filtered newest query', async () => {
    getNewestWatchVidsArray.mockResolvedValue([])
    await getNewVids({ vidType: 'watch', orderBy: 'newest-to-oldest' })
    expect(dbModel).toHaveBeenCalledWith(
      { sortKey: 'date', sortKey2: 'vidPageId', howMany: 4 },
      'watch'
    )
    expect(getNewestWatchVidsArray).toHaveBeenCalledTimes(1)
    expect(getOldestWatchVidsArray).not.toHaveBeenCalled()
  })

  it('uses the filtered oldest query for oldest-to-newest', async () => {
    getOldestWatchVidsArray.mockResolvedValue([])
    await getNewVids({ vidType: 'watch', orderBy: 'oldest-to-newest' })
    expect(getOldestWatchVidsArray).toHaveBeenCalledTimes(1)
    expect(getNewestWatchVidsArray).not.toHaveBeenCalled()
  })

  it('returns null for an unknown orderBy without querying', async () => {
    const result = await getNewVids({ vidType: 'watch', orderBy: 'sideways' })
    expect(result).toBeNull()
    expect(getNewestWatchVidsArray).not.toHaveBeenCalled()
    expect(getOldestWatchVidsArray).not.toHaveBeenCalled()
  })

  it('returns null for invalid vidType (buildVidParams returns null)', async () => {
    const result = await getNewVids({ vidType: 'invalid', orderBy: 'newest-to-oldest' })
    expect(result).toBeNull()
    expect(dbModel).not.toHaveBeenCalled()
  })

  it('returns DTOs with mediaUrl built from EXPRESS_WATCH_PATH', async () => {
    getNewestWatchVidsArray.mockResolvedValue([
      {
        title: 'Evening broadcast',
        date: '2026-09-13',
        vidType: 'broadcast',
        vidName: 'clip.mp4',
        vidSize: 12345,
        savePath: 'C:/private/video.mp4',
      },
    ])

    const result = await getNewVids({ vidType: 'watch', orderBy: 'newest-to-oldest' })

    expect(result).toEqual([
      {
        title: 'Evening broadcast',
        date: '2026-09-13',
        vidType: 'broadcast',
        vidName: 'clip.mp4',
        vidSize: 12345,
        mediaUrl: '/watch/clip.mp4',
        posterUrl: null,
      },
    ])
    expect(result[0]).not.toHaveProperty('savePath')
  })

  it('returns posterUrl built from EXPRESS_WATCH_PATH when thumbName is present', async () => {
    getNewestWatchVidsArray.mockResolvedValue([
      {
        title: 'Evening broadcast',
        date: '2026-09-13',
        vidType: 'broadcast',
        vidName: 'clip.mp4',
        vidSize: 12345,
        thumbName: 'clip.jpg',
      },
    ])

    const result = await getNewVids({ vidType: 'watch', orderBy: 'newest-to-oldest' })

    expect(result[0].posterUrl).toBe('/watch/clip.jpg')
  })

  it('drops records with a missing, null, or empty vidName', async () => {
    getNewestWatchVidsArray.mockResolvedValue([
      { title: 'no name', date: '2026-09-13', vidSize: 10 },
      { title: 'null name', date: '2026-09-12', vidName: null, vidSize: 10 },
      { title: 'empty name', date: '2026-09-11', vidName: '  ', vidSize: 10 },
      { title: 'ok', date: '2026-09-10', vidName: 'ok.mp4', vidSize: 10 },
    ])

    const result = await getNewVids({ vidType: 'watch', orderBy: 'newest-to-oldest' })

    expect(result).toHaveLength(1)
    expect(result[0].mediaUrl).toBe('/watch/ok.mp4')
  })

  it('returns null and logs when the query throws', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    getNewestWatchVidsArray.mockRejectedValue(new Error('database unavailable'))

    const result = await getNewVids({ vidType: 'watch', orderBy: 'newest-to-oldest' })

    expect(result).toBeNull()
    expect(consoleError).toHaveBeenCalledWith('WATCH VIDEO QUERY ERROR:', 'database unavailable')
    consoleError.mockRestore()
  })

  it('returns null without querying when EXPRESS_WATCH_PATH is unset', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    delete process.env.EXPRESS_WATCH_PATH

    const result = await getNewVids({ vidType: 'watch', orderBy: 'newest-to-oldest' })

    expect(result).toBeNull()
    expect(dbModel).not.toHaveBeenCalled()
    consoleError.mockRestore()
  })
})
