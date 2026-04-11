import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../middleware/config.js', () => ({
  default: { pw: 'correctpw', pwAdmin: 'correctadminpw' }
}))

import { authController, adminAuthController } from '../../controllers/auth-controller.js'

function makeRes() {
  return { status: vi.fn().mockReturnThis(), json: vi.fn() }
}

function makeReq(body, regenerateErr = null) {
  const session = {
    regenerate: vi.fn((cb) => cb(regenerateErr)),
  }
  return { body, session }
}

describe('authController', () => {
  it('returns failure json when body is absent', async () => {
    const req = makeReq(undefined)
    const res = makeRes()
    await authController(req, res)
    expect(res.json).toHaveBeenCalledWith({ success: false, redirect: '/401' })
  })

  it('returns failure json when pw is missing from body', async () => {
    const req = makeReq({})
    const res = makeRes()
    await authController(req, res)
    expect(res.json).toHaveBeenCalledWith({ success: false, redirect: '/401' })
  })

  it('returns failure json when pw is wrong', async () => {
    const req = makeReq({ pw: 'wrongpw' })
    const res = makeRes()
    await authController(req, res)
    expect(res.json).toHaveBeenCalledWith({ success: false, redirect: '/401' })
  })

  it('sets session.authenticated and returns success on correct pw', async () => {
    const req = makeReq({ pw: 'correctpw' })
    const res = makeRes()
    await authController(req, res)
    expect(req.session.authenticated).toBe(true)
    expect(res.json).toHaveBeenCalledWith({ success: true, redirect: '/' })
  })

  it('returns status 500 failure when regenerate errors', async () => {
    const req = makeReq({ pw: 'correctpw' }, new Error('session error'))
    const res = makeRes()
    await authController(req, res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ success: false, redirect: '/401' })
  })
})

describe('adminAuthController', () => {
  it('returns failure json when body is absent', async () => {
    const req = makeReq(undefined)
    const res = makeRes()
    await adminAuthController(req, res)
    expect(res.json).toHaveBeenCalledWith({ success: false, redirect: '/401' })
  })

  it('returns failure json when pwAdmin is missing from body', async () => {
    const req = makeReq({})
    const res = makeRes()
    await adminAuthController(req, res)
    expect(res.json).toHaveBeenCalledWith({ success: false, redirect: '/401' })
  })

  it('returns failure json when pwAdmin is wrong', async () => {
    const req = makeReq({ pwAdmin: 'wrongpw' })
    const res = makeRes()
    await adminAuthController(req, res)
    expect(res.json).toHaveBeenCalledWith({ success: false, redirect: '/401' })
  })

  it('sets session flags and returns success on correct pwAdmin', async () => {
    const req = makeReq({ pwAdmin: 'correctadminpw' })
    const res = makeRes()
    await adminAuthController(req, res)
    expect(req.session.authenticated).toBe(true)
    expect(req.session.adminAuthenticated).toBe(true)
    expect(res.json).toHaveBeenCalledWith({ success: true, redirect: '/admin' })
  })

  it('returns status 500 failure when regenerate errors', async () => {
    const req = makeReq({ pwAdmin: 'correctadminpw' }, new Error('session error'))
    const res = makeRes()
    await adminAuthController(req, res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ success: false, redirect: '/401' })
  })
})
