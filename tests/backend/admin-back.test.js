import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

vi.mock('axios', () => ({ default: { post: vi.fn() } }))
vi.mock('../../models/db-model.js', () => ({ default: vi.fn() }))

import { runAdminCommand, runGetAdminData } from '../../src/admin-back.js'
import axios from 'axios'
import dbModel from '../../models/db-model.js'

describe('runAdminCommand', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.SCRAPE_PORT = '3001'
    process.env.API_SCRAPER = '/api/scrape'
    process.env.API_PASSWORD = 'testpass'
  })

  afterEach(() => {
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

  it('calls axios.post with the correct URL', async () => {
    axios.post.mockResolvedValue({ data: {} })
    await runAdminCommand({ command: 'scrape' })
    expect(axios.post).toHaveBeenCalledWith(
      'http://localhost:3001/api/scrape',
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

  const buildCountModel = (count) => ({ countAll: vi.fn().mockResolvedValue(count) })

  // wires dbModel so only the "log" collection gets the sorted/stats mock; captures
  // the dataObject passed to `new dbModel(dataObject, "log")` for assertions below
  const mockDbModelCapturingLogDataObject = (logModel = buildLogModel()) => {
    let capturedDataObject
    dbModel.mockImplementation((dataObject, collection) => {
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
    const logRows = [{ _id: '1' }, { _id: '2' }]
    const stats = { activeScrapes: 1, finishedScrapes: 2, errorScrapes: 0, avgDuration: 42 }
    dbModel.mockImplementation((_, collection) => {
      if (collection === 'log') return buildLogModel({ count: 2, data: logRows, stats })
      return buildCountModel(collection === 'articles' ? 725 : 1)
    })

    const result = await runGetAdminData({ sortColumn: 'endTime', sortDir: 'desc' })

    expect(result[0]).toEqual({ collection: 'log', count: 2, data: logRows, stats })
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

  it('keeps an empty log collection with zero count, empty data, and zeroed stats', async () => {
    const zeroedStats = { activeScrapes: 0, finishedScrapes: 0, errorScrapes: 0, avgDuration: 0 }
    dbModel.mockImplementation((_, collection) => {
      if (collection === 'log') return buildLogModel({ count: 0, data: [], stats: zeroedStats })
      return buildCountModel(0)
    })

    const result = await runGetAdminData({})

    expect(result).toHaveLength(5)
    expect(result[0]).toEqual({ collection: 'log', count: 0, data: [], stats: zeroedStats })
  })

  it('returns null when the log count fails', async () => {
    dbModel.mockImplementation((_, collection) => {
      if (collection === 'log') {
        return { ...buildLogModel(), countAll: vi.fn().mockRejectedValue(new Error('db error')) }
      }
      return buildCountModel(1)
    })

    const result = await runGetAdminData({})

    expect(result).toBeNull()
  })

  it('returns null when the sorted log read fails', async () => {
    dbModel.mockImplementation((_, collection) => {
      if (collection === 'log') {
        return { ...buildLogModel(), getSortedItemsArray: vi.fn().mockRejectedValue(new Error('read failed')) }
      }
      return buildCountModel(1)
    })

    const result = await runGetAdminData({})

    expect(result).toBeNull()
  })

  it('returns null when the log stats aggregation fails', async () => {
    dbModel.mockImplementation((_, collection) => {
      if (collection === 'log') {
        return { ...buildLogModel(), getLogStatsSummary: vi.fn().mockRejectedValue(new Error('agg failed')) }
      }
      return buildCountModel(1)
    })

    const result = await runGetAdminData({})

    expect(result).toBeNull()
  })

  it('returns null when a count-only collection fails', async () => {
    dbModel.mockImplementation((_, collection) => {
      if (collection === 'log') return buildLogModel()
      if (collection === 'picSets') return { countAll: vi.fn().mockRejectedValue(new Error('db error')) }
      return buildCountModel(1)
    })

    const result = await runGetAdminData({})

    expect(result).toBeNull()
  })
})
