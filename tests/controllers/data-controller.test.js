import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../src/main-back.js', () => ({ runUpdateDisplayData: vi.fn() }))
vi.mock('../../src/admin-back.js', () => ({ runAdminCommand: vi.fn(), runGetAdminData: vi.fn() }))
vi.mock('../../src/watch/watch-vids.js', () => ({ getWatchVids: vi.fn() }))

import { runUpdateDisplayData } from '../../src/main-back.js'
import { runAdminCommand, runGetAdminData } from '../../src/admin-back.js'
import { getWatchVids } from '../../src/watch/watch-vids.js'
import {
  updateDisplayDataController,
  watchSmokeDataController,
  adminCommandController,
  adminDataController,
  adminPollingController,
} from '../../controllers/data-controller.js'

function makeRes() {
  return { status: vi.fn().mockReturnThis(), json: vi.fn() }
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('updateDisplayDataController', () => {
  it('extracts stateFront from req.body and passes it to runUpdateDisplayData', async () => {
    const stateFront = { typeTrigger: 'articles' }
    runUpdateDisplayData.mockResolvedValue([])
    const req = { body: { stateFront } }
    const res = makeRes()
    await updateDisplayDataController(req, res)
    expect(runUpdateDisplayData).toHaveBeenCalledWith(stateFront)
  })

  it('calls res.json with the array returned by runUpdateDisplayData', async () => {
    const result = [{ id: 1 }, { id: 2 }]
    runUpdateDisplayData.mockResolvedValue(result)
    const req = { body: { stateFront: {} } }
    const res = makeRes()
    await updateDisplayDataController(req, res)
    expect(res.json).toHaveBeenCalledWith(result)
  })

  it('calls res.json with null when runUpdateDisplayData returns null', async () => {
    runUpdateDisplayData.mockResolvedValue(null)
    const req = { body: { stateFront: {} } }
    const res = makeRes()
    await updateDisplayDataController(req, res)
    expect(res.json).toHaveBeenCalledWith(null)
  })
})

describe('watchSmokeDataController', () => {
  it('returns the watch video array as JSON', async () => {
    const result = [{ title: 'Evening broadcast', mediaUrl: '/watch/evening.mp4' }]
    getWatchVids.mockResolvedValue(result)
    const req = { body: { howMany: 5 } }
    const res = makeRes()

    await watchSmokeDataController(req, res)

    expect(getWatchVids).toHaveBeenCalledWith(5)
    expect(res.json).toHaveBeenCalledWith(result)
  })

  it('falls back to the default count when the request has no body', async () => {
    const result = []
    getWatchVids.mockResolvedValue(result)
    const req = { body: undefined }
    const res = makeRes()

    await watchSmokeDataController(req, res)

    expect(getWatchVids).toHaveBeenCalledWith(undefined)
    expect(res.json).toHaveBeenCalledWith(result)
  })

  it('returns 500 JSON when watch videos cannot be loaded', async () => {
    getWatchVids.mockResolvedValue(null)
    const req = { body: { howMany: 5 } }
    const res = makeRes()

    await watchSmokeDataController(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'Unable to load watch videos' })
  })
})

describe('adminCommandController', () => {
  it('calls runAdminCommand with req.body and passes a success result to res.json', async () => {
    const body = { command: 'admin-start-scrape' }
    const result = { success: true, message: 'done', data: { ok: true } }
    runAdminCommand.mockResolvedValue(result)
    const req = { body }
    const res = makeRes()
    await adminCommandController(req, res)
    expect(runAdminCommand).toHaveBeenCalledWith(body)
    expect(res.json).toHaveBeenCalledWith(result)
  })

  it('maps scraper operation failures to their non-2xx status', async () => {
    const result = { success: false, message: 'unauthorized', data: { status: 401 } }
    runAdminCommand.mockResolvedValue(result)
    const req = { body: { command: 'admin-start-scrape' } }
    const res = makeRes()

    await adminCommandController(req, res)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith(result)
  })

  it.each([
    null,
    {},
    { command: '' },
    { command: 123 },
    { command: 'scrape' },
    { command: 'not-a-real-command' },
  ])('returns a structured 400 for malformed command body %#', async (body) => {
    const req = { body }
    const res = makeRes()

    await adminCommandController(req, res)

    expect(runAdminCommand).not.toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Invalid admin command request',
      data: { status: 400 },
    })
  })
})

describe('adminDataController', () => {
  it('calls runGetAdminData and passes result to res.json', async () => {
    const result = []
    runGetAdminData.mockResolvedValue(result)
    const req = {}
    const res = makeRes()
    await adminDataController(req, res)
    expect(runGetAdminData).toHaveBeenCalledOnce()
    expect(res.json).toHaveBeenCalledWith(result)
  })

  it('passes a valid whitelisted sortColumn/sortDir pair through unchanged', async () => {
    runGetAdminData.mockResolvedValue([])
    const req = { body: { sortColumn: 'duration', sortDir: 'asc' } }
    const res = makeRes()

    await adminDataController(req, res)

    expect(runGetAdminData).toHaveBeenCalledWith({ sortColumn: 'duration', sortDir: 'asc' })
  })

  it.each(['articles', 'pics', 'picSets'])(
    'passes the scrape-stat sortColumn %s through to runGetAdminData',
    async (sortColumn) => {
      runGetAdminData.mockResolvedValue([])
      const req = { body: { sortColumn, sortDir: 'asc' } }
      const res = makeRes()

      await adminDataController(req, res)

      expect(runGetAdminData).toHaveBeenCalledWith({ sortColumn, sortDir: 'asc' })
    }
  )

  it.each([
    [{}, { sortColumn: 'endTime', sortDir: 'desc' }],
    [{ sortColumn: 'bogus', sortDir: 'asc' }, { sortColumn: 'endTime', sortDir: 'asc' }],
    [{ sortColumn: 'status', sortDir: 'bogus' }, { sortColumn: 'status', sortDir: 'desc' }],
    [{ sortColumn: 123, sortDir: null }, { sortColumn: 'endTime', sortDir: 'desc' }],
  ])('falls back invalid/missing sort params %j to %j', async (body, expected) => {
    runGetAdminData.mockResolvedValue([])
    const req = { body }
    const res = makeRes()

    await adminDataController(req, res)

    expect(runGetAdminData).toHaveBeenCalledWith(expected)
  })

  it.each([null, [], 'not-an-object', undefined])(
    'falls back to endTime/desc when req.body is not a plain object (%#)',
    async (body) => {
      runGetAdminData.mockResolvedValue([])
      const req = { body }
      const res = makeRes()

      await adminDataController(req, res)

      expect(runGetAdminData).toHaveBeenCalledWith({ sortColumn: 'endTime', sortDir: 'desc' })
    }
  )

  it('returns a structured 503 when admin collection data cannot be loaded', async () => {
    runGetAdminData.mockResolvedValue(null)
    const req = {}
    const res = makeRes()

    await adminDataController(req, res)

    expect(res.status).toHaveBeenCalledWith(503)
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Unable to load admin data',
      data: { status: 503 },
    })
  })
})

describe('adminPollingController', () => {
  it('retrieves live status through the scraper status command', async () => {
    const result = {
      success: true,
      message: 'Scrape running',
      data: { scrapeActive: true },
    }
    runAdminCommand.mockResolvedValue(result)
    const req = { body: { scrapeId: 'scrape-1' } }
    const res = makeRes()

    await adminPollingController(req, res)

    expect(runAdminCommand).toHaveBeenCalledWith({
      command: 'admin-scrape-status',
      scrapeId: 'scrape-1',
    })
    expect(res.json).toHaveBeenCalledWith(result)
  })

  it.each([
    null,
    [],
    { scrapeId: 123 },
    { scrapeId: {} },
  ])('returns a structured 400 for malformed polling body %#', async (body) => {
    const req = { body }
    const res = makeRes()

    await adminPollingController(req, res)

    expect(runAdminCommand).not.toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Invalid admin polling request',
      data: { status: 400 },
    })
  })
})
