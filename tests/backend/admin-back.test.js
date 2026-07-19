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
      expect.any(Object)
    )
  })

  it('spreads inputParams and appends apiPassword in the request body', async () => {
    axios.post.mockResolvedValue({ data: {} })
    await runAdminCommand({ command: 'scrape', target: 'kcna' })
    expect(axios.post).toHaveBeenCalledWith(
      'http://localhost:3001/api/scrape',
      { command: 'scrape', target: 'kcna', password: 'testpass' }
    )
  })
})

describe('runGetAdminData', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns exact counts above the bounded record limit', async () => {
    dbModel.mockImplementation((_, collection) => ({
      countAll: vi.fn().mockResolvedValue(collection === 'articles' ? 725 : 1),
      getAll: vi.fn().mockResolvedValue([{ _id: collection + '-1' }]),
    }))

    const result = await runGetAdminData()

    expect(result.find((item) => item.collection === 'articles').count).toBe(725)
    expect(dbModel.mock.results[0].value.getAll).toHaveBeenCalledWith(500)
  })

  it('includes video page counts in the admin result', async () => {
    dbModel.mockImplementation((_, collection) => ({
      countAll: vi.fn().mockResolvedValue(collection === 'vidPages' ? 612 : 1),
      getAll: vi.fn().mockResolvedValue([{ _id: collection + '-1' }]),
    }))

    const result = await runGetAdminData()

    expect(result).toContainEqual({
      collection: 'vidPages',
      count: 612,
      data: [{ _id: 'vidPages-1' }],
    })
  })

  it('keeps empty collections so their exact zero count remains visible', async () => {
    dbModel.mockImplementation(() => ({
      countAll: vi.fn().mockResolvedValue(0),
      getAll: vi.fn().mockResolvedValue([]),
    }))

    const result = await runGetAdminData()

    expect(result).toHaveLength(5)
    expect(result[0]).toMatchObject({ count: 0, data: [] })
  })

  it('returns null when a collection count fails', async () => {
    dbModel.mockImplementation((_, collection) => ({
      countAll: collection === 'picSets'
        ? vi.fn().mockRejectedValue(new Error('db error'))
        : vi.fn().mockResolvedValue(1),
      getAll: vi.fn().mockResolvedValue([{ _id: collection + '-1' }]),
    }))

    const result = await runGetAdminData()

    expect(result).toBeNull()
  })

  it('returns null when a bounded collection read fails', async () => {
    dbModel.mockImplementation((_, collection) => ({
      countAll: vi.fn().mockResolvedValue(1),
      getAll: collection === 'pics'
        ? vi.fn().mockRejectedValue(new Error('read failed'))
        : vi.fn().mockResolvedValue([{ _id: collection + '-1' }]),
    }))

    const result = await runGetAdminData()

    expect(result).toBeNull()
  })
})
