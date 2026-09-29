import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('express', () => ({
  default: { static: vi.fn((dirPath, options) => ({ dirPath, options })) },
}))
vi.mock('../../routes/auth.js', () => ({ requireAuth: vi.fn() }))

import express from 'express'
import { requireAuth } from '../../routes/auth.js'
import { mountAuthStatic, mountRequiredAuthStatic, resolveListenHost } from '../../middleware/static-media.js'

describe('mountAuthStatic', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it.each([
    [undefined, '/media'],
    ['', '/media'],
    ['/media', undefined],
    ['/media', ''],
  ])('skips the mount when either path is missing (%s, %s)', (urlPrefix, dirPath) => {
    const app = { use: vi.fn() }

    mountAuthStatic(app, urlPrefix, dirPath)

    expect(app.use).not.toHaveBeenCalled()
    expect(express.static).not.toHaveBeenCalled()
  })

  it('mounts configured media behind authentication', () => {
    const app = { use: vi.fn() }

    mountAuthStatic(app, '/media', '/data/media')

    expect(express.static).toHaveBeenCalledWith('/data/media', expect.objectContaining({ setHeaders: expect.any(Function) }))
    const [urlPrefix, authMiddleware, staticResult] = app.use.mock.calls[0]
    expect(urlPrefix).toBe('/media')
    expect(authMiddleware).toBe(requireAuth)
    expect(staticResult.dirPath).toBe('/data/media')

    const res = { setHeader: vi.fn() }
    staticResult.options.setHeaders(res)
    expect(res.setHeader).toHaveBeenCalledWith('Cache-Control', 'private, max-age=604800, immutable')
  })
})

describe('mountRequiredAuthStatic', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it.each([
    [undefined, '/data/pics'],
    ['', '/data/pics'],
    ['/kcna-pics', undefined],
    ['/kcna-pics', ''],
  ])('throws when either path is missing (%s, %s)', (urlPrefix, dirPath) => {
    const app = { use: vi.fn() }

    expect(() => mountRequiredAuthStatic(app, urlPrefix, dirPath, 'pics')).toThrow(/required media config for pics/)
    expect(app.use).not.toHaveBeenCalled()
  })

  it('mounts required media behind authentication', () => {
    const app = { use: vi.fn() }

    mountRequiredAuthStatic(app, '/kcna-pics', '/data/pics', 'pics')

    expect(express.static).toHaveBeenCalledWith('/data/pics', expect.objectContaining({ setHeaders: expect.any(Function) }))
    const [urlPrefix, authMiddleware, staticResult] = app.use.mock.calls[0]
    expect(urlPrefix).toBe('/kcna-pics')
    expect(authMiddleware).toBe(requireAuth)
    expect(staticResult.dirPath).toBe('/data/pics')

    const res = { setHeader: vi.fn() }
    staticResult.options.setHeaders(res)
    expect(res.setHeader).toHaveBeenCalledWith('Cache-Control', 'private, max-age=604800, immutable')
  })
})

describe('resolveListenHost', () => {
  it.each([[undefined], ['']])('falls back to loopback for HOST=%s', (host) => {
    expect(resolveListenHost(host)).toBe('127.0.0.1')
  })

  it('uses the configured host', () => {
    expect(resolveListenHost('0.0.0.0')).toBe('0.0.0.0')
  })
})
