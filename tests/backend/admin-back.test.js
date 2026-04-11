import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

vi.mock('axios', () => ({ default: { post: vi.fn() } }))
vi.mock('../../middleware/config.js', () => ({
  default: {
    scrapePort: 3001,
    apiScraper: '/api/scrape',
    collectionsArr: ['articles', 'pics', 'vidPages'],
  }
}))
vi.mock('../../models/db-model.js', () => ({ default: vi.fn() }))

import { runAdminCommand, runGetAdminData } from '../../src/admin-back.js'
import axios from 'axios'
import dbModel from '../../models/db-model.js'

describe('runAdminCommand', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.API_PASSWORD = 'testpass'
  })

  afterEach(() => {
    delete process.env.API_PASSWORD
  })

  it('returns data when axios.post resolves with data', async () => {
    axios.post.mockResolvedValue({ data: { ok: true } })
    const result = await runAdminCommand({ command: 'scrape' })
    expect(result).toEqual({ ok: true })
  })

  it('returns null when axios.post resolves with null data', async () => {
    axios.post.mockResolvedValue({ data: null })
    const result = await runAdminCommand({ command: 'scrape' })
    expect(result).toBeNull()
  })

  it('returns null when axios.post throws', async () => {
    axios.post.mockRejectedValue(new Error('network error'))
    const result = await runAdminCommand({ command: 'scrape' })
    expect(result).toBeNull()
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
  const makeGetAll = (returnValue) => vi.fn().mockResolvedValue(returnValue)

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns an array with 3 items when all collections return data', async () => {
    dbModel.mockImplementation((_, collection) => ({
      getAll: makeGetAll([{ _id: collection + '-1' }]),
    }))
    const result = await runGetAdminData()
    expect(result).toHaveLength(3)
    result.forEach((item) => {
      expect(item).toHaveProperty('collection')
      expect(item).toHaveProperty('data')
    })
  })

  it('skips a collection that returns an empty array', async () => {
    dbModel.mockImplementation((_, collection) => ({
      getAll: collection === 'pics'
        ? makeGetAll([])
        : makeGetAll([{ _id: collection + '-1' }]),
    }))
    const result = await runGetAdminData()
    expect(result).toHaveLength(2)
    expect(result.map((r) => r.collection)).not.toContain('pics')
  })

  it('skips a collection that throws and continues with the rest', async () => {
    dbModel.mockImplementation((_, collection) => ({
      getAll: collection === 'vidPages'
        ? vi.fn().mockRejectedValue(new Error('db error'))
        : makeGetAll([{ _id: collection + '-1' }]),
    }))
    const result = await runGetAdminData()
    expect(result).toHaveLength(2)
    expect(result.map((r) => r.collection)).not.toContain('vidPages')
  })

  it('returns empty array when all collections return empty data', async () => {
    dbModel.mockImplementation(() => ({
      getAll: makeGetAll([]),
    }))
    const result = await runGetAdminData()
    expect(result).toEqual([])
  })

  it('returns correct structure with collection name and data', async () => {
    const articlesData = [{ _id: 'a1' }, { _id: 'a2' }]
    dbModel.mockImplementation((_, collection) => ({
      getAll: collection === 'articles'
        ? makeGetAll(articlesData)
        : makeGetAll([{ _id: collection + '-1' }]),
    }))
    const result = await runGetAdminData()
    const articlesResult = result.find((r) => r.collection === 'articles')
    expect(articlesResult.collection).toBe('articles')
    expect(articlesResult.data).toEqual(articlesData)
  })
})
