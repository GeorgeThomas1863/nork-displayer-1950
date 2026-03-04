import { describe, it, expect, beforeAll } from 'vitest'
import { buildSessionConfig } from '../../middleware/session-config.js'

beforeAll(() => {
  process.env.SESSION_SECRET = 'test-secret-xyz'
})

describe('buildSessionConfig', () => {
  it('returns secret from env', () => {
    const config = buildSessionConfig()
    expect(config.secret).toBe('test-secret-xyz')
  })

  it('resave is false', () => {
    const config = buildSessionConfig()
    expect(config.resave).toBe(false)
  })

  it('saveUninitialized is false', () => {
    const config = buildSessionConfig()
    expect(config.saveUninitialized).toBe(false)
  })

  it('proxy is true', () => {
    const config = buildSessionConfig()
    expect(config.proxy).toBe(true)
  })

  it('cookie.maxAge is 86400000', () => {
    const config = buildSessionConfig()
    expect(config.cookie.maxAge).toBe(86400000)
  })

  it('cookie.httpOnly is true', () => {
    const config = buildSessionConfig()
    expect(config.cookie.httpOnly).toBe(true)
  })

  it('cookie.secure is "auto"', () => {
    const config = buildSessionConfig()
    expect(config.cookie.secure).toBe('auto')
  })

  it('cookie.sameSite is "strict"', () => {
    const config = buildSessionConfig()
    expect(config.cookie.sameSite).toBe('strict')
  })

  it('returns a new object each call', () => {
    const a = buildSessionConfig()
    const b = buildSessionConfig()
    expect(a).not.toBe(b)
  })
})
