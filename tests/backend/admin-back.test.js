import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

vi.mock('axios', () => ({ default: { post: vi.fn() } }))
vi.mock('../../models/db-model.js', () => ({ default: vi.fn() }))

import { runAdminCommand, runGetAdminData } from '../../src/admin-back.js'
import axios from 'axios'
import dbModel from '../../models/db-model.js'

describe('runAdminCommand', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    delete process.env.SCRAPER_HOST
    process.env.SCRAPE_PORT = '3001'
    process.env.API_SCRAPER = '/api/scrape'
    process.env.API_PASSWORD = 'testpass'
  })

  afterEach(() => {
    delete process.env.SCRAPER_HOST
    delete process.env.SCRAPE_PORT
    delete process.env.API_SCRAPER
    delete process.env.API_PASSWORD
  })

  it('returns a structured success result with scraper data', async () => {
    const data = { scrapeActive: true, scrapeMessage: 'Scrape started' }
    axios.post.mockResolvedValue({ data })

    const result = await runAdminCommand({ command: 'admin-start-scrape' })

    expect(result).toEqual({ success: true, message: 'Scrape started', data })
  })

  it('unwraps a structured successful scraper result', async () => {
    const scraperState = { scrapeActive: false, scrapeMessage: 'Scrape complete' }
    axios.post.mockResolvedValue({
      data: { success: true, message: 'Status returned', data: scraperState },
    })

    const result = await runAdminCommand({ command: 'scrape-status' })

    expect(result).toEqual({ success: true, message: 'Status returned', data: scraperState })
  })

  it('returns a safe failure when the scraper is offline', async () => {
    axios.post.mockRejectedValue(new Error('connect ECONNREFUSED 127.0.0.1'))

    const result = await runAdminCommand({ command: 'admin-start-scrape' })

    expect(result).toEqual({
      success: false,
      message: 'Scraper service is unavailable',
      data: { status: 503 },
    })
  })

  it.each([
    [401, 'unauthorized'],
    [400, 'Invalid scraper command'],
    [500, 'Scrape pipeline failed'],
  ])('preserves safe scraper failure status %s and message', async (status, message) => {
    axios.post.mockRejectedValue({
      message: 'Request failed',
      response: { status, data: { error: message } },
    })

    const result = await runAdminCommand({ command: 'admin-start-scrape' })

    expect(result).toEqual({ success: false, message, data: { status } })
  })

  it('uses localhost when SCRAPER_HOST is unset', async () => {
    axios.post.mockResolvedValue({ data: {} })
    await runAdminCommand({ command: 'scrape' })
    expect(axios.post).toHaveBeenCalledWith(
      'http://localhost:3001/api/scrape',
      expect.any(Object),
      { timeout: 15000 }
    )
  })

  it('uses SCRAPER_HOST when it is set', async () => {
    process.env.SCRAPER_HOST = 'scraper'
    axios.post.mockResolvedValue({ data: {} })

    await runAdminCommand({ command: 'scrape' })

    expect(axios.post).toHaveBeenCalledWith(
      'http://scraper:3001/api/scrape',
      expect.any(Object),
      { timeout: 15000 }
    )
  })

  it('spreads inputParams and appends apiPassword in the request body', async () => {
    axios.post.mockResolvedValue({ data: {} })
    await runAdminCommand({ command: 'scrape', target: 'kcna' })
    expect(axios.post).toHaveBeenCalledWith(
      'http://localhost:3001/api/scrape',
      { command: 'scrape', target: 'kcna', password: 'testpass' },
      { timeout: 15000 }
    )
  })
})

describe('runGetAdminData', () => {
  const buildLogModel = (overrides = {}) => ({
    countAll: vi.fn().mockResolvedValue(overrides.count ?? 5),
    getSortedItemsArray: vi.fn().mockResolvedValue(overrides.data ?? []),
    getLogStatsSummary: vi.fn().mockResolvedValue(
      overrides.stats ?? { activeScrapes: 0, finishedScrapes: 0, errorScrapes: 0, avgDuration: 0 }
    ),
  })

  // scrapeIdCounts backs both the count-only collection loop (countAll) and the
  // per-scrapeId stat aggregation (getScrapeIdCounts) used to build each log row's scrapeStats
  const buildCountModel = (count, scrapeIdCounts = {}) => ({
    countAll: vi.fn().mockResolvedValue(count),
    getScrapeIdCounts: vi.fn().mockResolvedValue(scrapeIdCounts),
  })

  // wires dbModel so only the "log" collection gets the sorted/stats mock; captures
  // the dataObject passed to `new dbModel(dataObject, "log")` for assertions below
  const mockDbModelCapturingLogDataObject = (logModel = buildLogModel()) => {
    let capturedDataObject
    dbModel.mockImplementation(function (dataObject, collection) {
      if (collection === 'log') {
        capturedDataObject = dataObject
        return logModel
      }
      return buildCountModel(1)
    })
    return () => capturedDataObject
  }

  beforeEach(() => {
    vi.clearAllMocks()
    delete process.env.DEFAULT_LOAD_LOG
  })

  afterEach(() => {
    delete process.env.DEFAULT_LOAD_LOG
  })

  it('returns sorted+capped log data with stats, and count-only entries for the other collections', async () => {
    const logRows = [{ _id: '1', scrapeId: 's1' }, { _id: '2', scrapeId: 's2' }]
    const stats = { activeScrapes: 1, finishedScrapes: 2, errorScrapes: 0, avgDuration: 42 }
    dbModel.mockImplementation(function (_, collection) {
      if (collection === 'log') return buildLogModel({ count: 2, data: logRows, stats })
      if (collection === 'articles') return buildCountModel(725, { s1: 3, s2: 1 })
      if (collection === 'pics') return buildCountModel(1, { s1: 10 })
      return buildCountModel(1)
    })

    const result = await runGetAdminData({ sortColumn: 'endTime', sortDir: 'desc' })

    expect(result[0]).toEqual({
      collection: 'log',
      count: 2,
      data: [
        { _id: '1', scrapeId: 's1', scrapeStats: { articles: 3, pics: 10, picSets: 0 } },
        { _id: '2', scrapeId: 's2', scrapeStats: { articles: 1, pics: 0, picSets: 0 } },
      ],
      stats,
    })
    expect(result.find((item) => item.collection === 'articles')).toEqual({ collection: 'articles', count: 725 })
    expect(result.find((item) => item.collection === 'pics')).toEqual({ collection: 'pics', count: 1 })
    expect(result.find((item) => item.collection === 'picSets')).toEqual({ collection: 'picSets', count: 1 })
    expect(result.find((item) => item.collection === 'vidPages')).toEqual({ collection: 'vidPages', count: 1 })
    expect(result.find((item) => item.collection === 'articles')).not.toHaveProperty('data')
  })

  it('caps the log query at DEFAULT_LOAD_LOG when it is set to a valid number', async () => {
    process.env.DEFAULT_LOAD_LOG = '50'
    const getCapturedDataObject = mockDbModelCapturingLogDataObject()

    await runGetAdminData({})

    expect(getCapturedDataObject().howMany).toBe(50)
  })

  it.each([undefined, 'not-a-number', '0'])(
    'falls back to a cap of 100 when DEFAULT_LOAD_LOG is %s',
    async (envValue) => {
      if (envValue === undefined) delete process.env.DEFAULT_LOAD_LOG
      else process.env.DEFAULT_LOAD_LOG = envValue
      const getCapturedDataObject = mockDbModelCapturingLogDataObject()

      await runGetAdminData({})

      expect(getCapturedDataObject().howMany).toBe(100)
    }
  )

  it('defaults to the endTime/desc sort when called without sort params', async () => {
    const getCapturedDataObject = mockDbModelCapturingLogDataObject()

    await runGetAdminData()

    expect(getCapturedDataObject().sortObj).toEqual({ scrapeEndTime: -1, _id: -1 })
  })

  it('builds the compound status sort across scrapeError, scrapeActive, and _id', async () => {
    const getCapturedDataObject = mockDbModelCapturingLogDataObject()

    await runGetAdminData({ sortColumn: 'status', sortDir: 'desc' })

    expect(getCapturedDataObject().sortObj).toEqual({ scrapeError: -1, scrapeActive: -1, _id: -1 })
  })

  it.each([
    ['id', 'asc', { _id: 1 }],
    ['startTime', 'desc', { scrapeStartTime: -1, _id: -1 }],
    ['endTime', 'asc', { scrapeEndTime: 1, _id: 1 }],
    ['duration', 'asc', { scrapeLengthSeconds: 1, _id: 1 }],
    ['step', 'desc', { scrapeStep: -1, _id: -1 }],
    ['message', 'asc', { scrapeMessage: 1, _id: 1 }],
    ['active', 'desc', { scrapeActive: -1, _id: -1 }],
    ['status', 'asc', { scrapeError: 1, scrapeActive: 1, _id: 1 }],
  ])('maps sortColumn=%s sortDir=%s to sort object %j', async (sortColumn, sortDir, expected) => {
    const getCapturedDataObject = mockDbModelCapturingLogDataObject()

    await runGetAdminData({ sortColumn, sortDir })

    expect(getCapturedDataObject().sortObj).toEqual(expected)
  })

  it.each(['articles', 'pics', 'picSets'])(
    'falls back to the default endTime mongo sort for stat column %s (the mongo doc has no such field; it is sorted in JS afterward)',
    async (sortColumn) => {
      const getCapturedDataObject = mockDbModelCapturingLogDataObject()

      await runGetAdminData({ sortColumn, sortDir: 'asc' })

      expect(getCapturedDataObject().sortObj).toEqual({ scrapeEndTime: 1, _id: 1 })
    }
  )

  it('keeps an empty log collection with zero count, empty data, and zeroed stats', async () => {
    const zeroedStats = { activeScrapes: 0, finishedScrapes: 0, errorScrapes: 0, avgDuration: 0 }
    dbModel.mockImplementation(function (_, collection) {
      if (collection === 'log') return buildLogModel({ count: 0, data: [], stats: zeroedStats })
      return buildCountModel(0)
    })

    const result = await runGetAdminData({})

    expect(result).toHaveLength(5)
    expect(result[0]).toEqual({ collection: 'log', count: 0, data: [], stats: zeroedStats })
  })

  it('returns null when the log count fails', async () => {
    dbModel.mockImplementation(function (_, collection) {
      if (collection === 'log') {
        return { ...buildLogModel(), countAll: vi.fn().mockRejectedValue(new Error('db error')) }
      }
      return buildCountModel(1)
    })

    const result = await runGetAdminData({})

    expect(result).toBeNull()
  })

  it('returns null when the sorted log read fails', async () => {
    dbModel.mockImplementation(function (_, collection) {
      if (collection === 'log') {
        return { ...buildLogModel(), getSortedItemsArray: vi.fn().mockRejectedValue(new Error('read failed')) }
      }
      return buildCountModel(1)
    })

    const result = await runGetAdminData({})

    expect(result).toBeNull()
  })

  it('returns null when the log stats aggregation fails', async () => {
    dbModel.mockImplementation(function (_, collection) {
      if (collection === 'log') {
        return { ...buildLogModel(), getLogStatsSummary: vi.fn().mockRejectedValue(new Error('agg failed')) }
      }
      return buildCountModel(1)
    })

    const result = await runGetAdminData({})

    expect(result).toBeNull()
  })

  it('returns null when a count-only collection fails', async () => {
    dbModel.mockImplementation(function (_, collection) {
      if (collection === 'log') return buildLogModel()
      if (collection === 'picSets') {
        return { countAll: vi.fn().mockRejectedValue(new Error('db error')), getScrapeIdCounts: vi.fn().mockResolvedValue({}) }
      }
      return buildCountModel(1)
    })

    const result = await runGetAdminData({})

    expect(result).toBeNull()
  })
})

describe('runGetAdminData scrapeStats', () => {
  const buildLogModel = (overrides = {}) => ({
    countAll: vi.fn().mockResolvedValue(overrides.count ?? 5),
    getSortedItemsArray: vi.fn().mockResolvedValue(overrides.data ?? []),
    getLogStatsSummary: vi.fn().mockResolvedValue(
      overrides.stats ?? { activeScrapes: 0, finishedScrapes: 0, errorScrapes: 0, avgDuration: 0 }
    ),
  })

  const buildCountModel = (count, scrapeIdCounts = {}) => ({
    countAll: vi.fn().mockResolvedValue(count),
    getScrapeIdCounts: vi.fn().mockResolvedValue(scrapeIdCounts),
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('attaches articles/pics/picSets doc counts by scrapeId, defaulting missing scrapeIds/collections to 0', async () => {
    const logRows = [{ _id: '1', scrapeId: 'a' }, { _id: '2', scrapeId: 'b' }]
    dbModel.mockImplementation(function (_, collection) {
      if (collection === 'log') return buildLogModel({ data: logRows })
      if (collection === 'articles') return buildCountModel(1, { a: 5 })
      if (collection === 'pics') return buildCountModel(1, { a: 2, b: 7 })
      if (collection === 'picSets') return buildCountModel(1, {})
      return buildCountModel(1)
    })

    const result = await runGetAdminData({})

    expect(result[0].data).toEqual([
      { _id: '1', scrapeId: 'a', scrapeStats: { articles: 5, pics: 2, picSets: 0 } },
      { _id: '2', scrapeId: 'b', scrapeStats: { articles: 0, pics: 7, picSets: 0 } },
    ])
  })

  it('sorts rows by a stat column ascending and descending after attaching scrapeStats', async () => {
    const logRows = [{ _id: '1', scrapeId: 'a' }, { _id: '2', scrapeId: 'b' }, { _id: '3', scrapeId: 'c' }]
    dbModel.mockImplementation(function (_, collection) {
      if (collection === 'log') return buildLogModel({ data: logRows })
      if (collection === 'articles') return buildCountModel(1, { a: 5, b: 1, c: 9 })
      return buildCountModel(1, {})
    })

    const asc = await runGetAdminData({ sortColumn: 'articles', sortDir: 'asc' })
    expect(asc[0].data.map((row) => row._id)).toEqual(['2', '1', '3'])

    const desc = await runGetAdminData({ sortColumn: 'articles', sortDir: 'desc' })
    expect(desc[0].data.map((row) => row._id)).toEqual(['3', '1', '2'])
  })

  it('returns null when a stat aggregation fails', async () => {
    dbModel.mockImplementation(function (_, collection) {
      if (collection === 'log') return buildLogModel()
      if (collection === 'articles') {
        return { countAll: vi.fn().mockResolvedValue(1), getScrapeIdCounts: vi.fn().mockRejectedValue(new Error('agg failed')) }
      }
      return buildCountModel(1)
    })

    const result = await runGetAdminData({})

    expect(result).toBeNull()
  })
})
