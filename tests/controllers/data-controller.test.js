import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../src/main-back.js', () => ({ runUpdateDisplayData: vi.fn() }))
vi.mock('../../src/admin-back.js', () => ({ runAdminCommand: vi.fn(), runGetAdminData: vi.fn() }))

import { runUpdateDisplayData } from '../../src/main-back.js'
import { runAdminCommand, runGetAdminData } from '../../src/admin-back.js'
import {
  updateDisplayDataController,
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

describe('adminCommandController', () => {
  it('calls runAdminCommand with req.body and passes result to res.json', async () => {
    const body = { command: 'scrape' }
    const result = { ok: true }
    runAdminCommand.mockResolvedValue(result)
    const req = { body }
    const res = makeRes()
    await adminCommandController(req, res)
    expect(runAdminCommand).toHaveBeenCalledWith(body)
    expect(res.json).toHaveBeenCalledWith(result)
  })

  it('returns null without calling res.json when req.body is null', async () => {
    const req = { body: null }
    const res = makeRes()
    const returnVal = await adminCommandController(req, res)
    expect(returnVal).toBeNull()
    expect(res.json).not.toHaveBeenCalled()
  })
})

describe('adminDataController', () => {
  it('calls runGetAdminData and passes result to res.json', async () => {
    const result = { collections: [] }
    runGetAdminData.mockResolvedValue(result)
    const req = {}
    const res = makeRes()
    await adminDataController(req, res)
    expect(runGetAdminData).toHaveBeenCalledOnce()
    expect(res.json).toHaveBeenCalledWith(result)
  })
})

describe('adminPollingController', () => {
  it('responds with status 501 and not-implemented error', async () => {
    const req = {}
    const res = makeRes()
    await adminPollingController(req, res)
    expect(res.status).toHaveBeenCalledWith(501)
    expect(res.json).toHaveBeenCalledWith({ error: 'Not implemented' })
  })
})
