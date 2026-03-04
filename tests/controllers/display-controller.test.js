import { describe, it, expect, vi } from 'vitest'
import {
  mainDisplay,
  adminDisplay,
  display401,
  display404,
  display500,
} from '../../controllers/display-controller.js'

function makeRes() {
  return { status: vi.fn().mockReturnThis(), sendFile: vi.fn() }
}

describe('display-controller', () => {
  it('mainDisplay calls sendFile with a path ending in index.html', async () => {
    const req = {}
    const res = makeRes()
    await mainDisplay(req, res)
    expect(res.sendFile).toHaveBeenCalledOnce()
    expect(res.sendFile.mock.calls[0][0]).toMatch(/index\.html$/)
  })

  it('adminDisplay calls sendFile with a path ending in admin.html', () => {
    const req = {}
    const res = makeRes()
    adminDisplay(req, res)
    expect(res.sendFile).toHaveBeenCalledOnce()
    expect(res.sendFile.mock.calls[0][0]).toMatch(/admin\.html$/)
  })

  it('display401 calls status(401) then sendFile with a path ending in 401.html', () => {
    const req = {}
    const res = makeRes()
    display401(req, res)
    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.sendFile).toHaveBeenCalledOnce()
    expect(res.sendFile.mock.calls[0][0]).toMatch(/401\.html$/)
  })

  it('display404 calls status(404) then sendFile with a path ending in 404.html', () => {
    const req = {}
    const res = makeRes()
    display404(req, res)
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.sendFile).toHaveBeenCalledOnce()
    expect(res.sendFile.mock.calls[0][0]).toMatch(/404\.html$/)
  })

  it('display500 calls status(500) then sendFile with a path ending in 500.html', () => {
    const error = new Error('server error')
    const req = {}
    const res = makeRes()
    const next = vi.fn()
    display500(error, req, res, next)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.sendFile).toHaveBeenCalledOnce()
    expect(res.sendFile.mock.calls[0][0]).toMatch(/500\.html$/)
  })
})
