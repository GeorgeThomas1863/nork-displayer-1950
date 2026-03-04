import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import debounce from '../../public/js/util/debounce.js'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('debounce', () => {
  it('does not call fn immediately after invocation', () => {
    const fn = vi.fn().mockResolvedValue('x')
    const dbFn = debounce(fn)
    dbFn()
    expect(fn).not.toHaveBeenCalled()
  })

  it('calls fn after 500ms', async () => {
    const fn = vi.fn().mockResolvedValue('x')
    const dbFn = debounce(fn)
    const p = dbFn()
    vi.advanceTimersByTime(500)
    await p
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('does not call fn before 500ms (at 499ms)', () => {
    const fn = vi.fn().mockResolvedValue('x')
    const dbFn = debounce(fn)
    dbFn()
    vi.advanceTimersByTime(499)
    expect(fn).not.toHaveBeenCalled()
  })

  it('cancels earlier call when called again within 500ms — fn called only once', async () => {
    const fn = vi.fn().mockResolvedValue('ok')
    const dbFn = debounce(fn)
    dbFn('first')
    vi.advanceTimersByTime(200)
    const p = dbFn('second')
    vi.advanceTimersByTime(500)
    const result = await p
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith('second')
  })

  it('resolves with the return value of fn', async () => {
    const fn = vi.fn().mockResolvedValue('expected-value')
    const dbFn = debounce(fn)
    const p = dbFn()
    vi.advanceTimersByTime(500)
    const result = await p
    expect(result).toBe('expected-value')
  })

  it('rejects if fn throws', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('boom'))
    const dbFn = debounce(fn)
    const p = dbFn()
    vi.advanceTimersByTime(500)
    await expect(p).rejects.toThrow('boom')
  })

  it('passes arguments correctly to fn', async () => {
    const fn = vi.fn().mockResolvedValue('ok')
    const dbFn = debounce(fn)
    const p = dbFn('arg1', 'arg2', 42)
    vi.advanceTimersByTime(500)
    await p
    expect(fn).toHaveBeenCalledWith('arg1', 'arg2', 42)
  })
})
