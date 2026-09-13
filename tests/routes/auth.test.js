import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../controllers/display-controller.js', () => ({
  mainDisplay: function mainDisplay() {},
  watchSmokeDisplay: function watchSmokeDisplay() {},
  adminDisplay: function adminDisplay() {},
  display401: function display401() {},
  display404: function display404() {},
  display500: function display500() {},
}))

vi.mock('../../controllers/data-controller.js', () => ({
  updateDisplayDataController: function updateDisplayDataController() {},
  watchSmokeDataController: function watchSmokeDataController() {},
  adminCommandController: function adminCommandController() {},
  adminDataController: function adminDataController() {},
  adminPollingController: function adminPollingController() {},
}))

vi.mock('../../controllers/auth-controller.js', () => ({
  authController: function authController() {},
  adminAuthController: function adminAuthController() {},
}))

import { requireAuth, requireAdminAuth } from '../../routes/auth.js'
import router from '../../routes/router.js'

function makeReq(session = {}, method = 'GET') {
  return { session, method }
}

function makeRes() {
  const res = {
    setHeader: vi.fn(),
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
    sendFile: vi.fn(),
  }
  return res
}

describe('requireAuth', () => {
  let next

  beforeEach(() => {
    next = vi.fn()
  })

  it('calls next() when session.authenticated is true', () => {
    const req = makeReq({ authenticated: true })
    const res = makeRes()
    requireAuth(req, res, next)
    expect(next).toHaveBeenCalledOnce()
    expect(res.sendFile).not.toHaveBeenCalled()
    expect(res.status).not.toHaveBeenCalled()
  })

  it('sends auth.html on GET when not authenticated', () => {
    const req = makeReq({ authenticated: false }, 'GET')
    const res = makeRes()
    requireAuth(req, res, next)
    expect(res.sendFile).toHaveBeenCalledOnce()
    expect(res.sendFile.mock.calls[0][0]).toMatch(/auth\.html$/)
    expect(next).not.toHaveBeenCalled()
  })

  it('returns 401 JSON on POST when not authenticated', () => {
    const req = makeReq({ authenticated: false }, 'POST')
    const res = makeRes()
    requireAuth(req, res, next)
    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' })
    expect(next).not.toHaveBeenCalled()
  })

  it('returns 401 JSON on DELETE when not authenticated', () => {
    const req = makeReq({ authenticated: false }, 'DELETE')
    const res = makeRes()
    requireAuth(req, res, next)
    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' })
    expect(next).not.toHaveBeenCalled()
  })
})

describe('requireAdminAuth', () => {
  let next

  beforeEach(() => {
    next = vi.fn()
  })

  it('sends auth.html on GET when not authenticated at all', () => {
    const req = makeReq({ authenticated: false }, 'GET')
    const res = makeRes()
    requireAdminAuth(req, res, next)
    expect(res.sendFile).toHaveBeenCalledOnce()
    expect(res.sendFile.mock.calls[0][0]).toMatch(/auth\.html$/)
    expect(next).not.toHaveBeenCalled()
  })

  it('returns 401 JSON on POST when not authenticated at all', () => {
    const req = makeReq({ authenticated: false }, 'POST')
    const res = makeRes()
    requireAdminAuth(req, res, next)
    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' })
    expect(next).not.toHaveBeenCalled()
  })

  it('sends admin-auth.html on GET when authenticated but not adminAuthenticated', () => {
    const req = makeReq({ authenticated: true, adminAuthenticated: false }, 'GET')
    const res = makeRes()
    requireAdminAuth(req, res, next)
    expect(res.sendFile).toHaveBeenCalledOnce()
    expect(res.sendFile.mock.calls[0][0]).toMatch(/admin-auth\.html$/)
    expect(next).not.toHaveBeenCalled()
  })

  it('returns 401 JSON on POST when authenticated but not adminAuthenticated', () => {
    const req = makeReq({ authenticated: true, adminAuthenticated: false }, 'POST')
    const res = makeRes()
    requireAdminAuth(req, res, next)
    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' })
    expect(next).not.toHaveBeenCalled()
  })

  it('calls next() when authenticated AND adminAuthenticated', () => {
    const req = makeReq({ authenticated: true, adminAuthenticated: true }, 'GET')
    const res = makeRes()
    requireAdminAuth(req, res, next)
    expect(next).toHaveBeenCalledOnce()
    expect(res.sendFile).not.toHaveBeenCalled()
    expect(res.status).not.toHaveBeenCalled()
  })
})

describe('watch smoke routes', () => {
  it.each([
    ['/watch-smoke', 'get', 'watchSmokeDisplay'],
    ['/nork-watch-smoke-data-route', 'post', 'watchSmokeDataController'],
  ])('protects %s with requireAuth before its controller', (path, method, controllerName) => {
    const route = router.stack.find((layer) => layer.route?.path === path && layer.route.methods[method])
    const handlerNames = route?.route.stack.map((layer) => layer.handle.name)

    expect(handlerNames).toEqual(['requireAuth', controllerName])
  })
})
