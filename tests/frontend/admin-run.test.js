import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../../public/js/admin.js', () => ({ updateAdminDisplay: vi.fn() }))
vi.mock('../../public/js/admin/admin-status.js', () => ({ buildAdminStatusDisplay: vi.fn() }))
vi.mock('../../public/js/util/params.js', () => ({
  getAdminAuthParams: vi.fn(),
  getAdminCommandParams: vi.fn(),
}))
vi.mock('../../public/js/util/api-front.js', () => ({ sendToBack: vi.fn() }))
vi.mock('../../public/js/util/collapse-display.js', () => ({ hideArray: vi.fn(), unhideArray: vi.fn() }))

import { updateAdminDisplay } from '../../public/js/admin.js'
import { runAdminCommand } from '../../public/js/admin/admin-run.js'
import { buildAdminStatusDisplay } from '../../public/js/admin/admin-status.js'
import { getAdminCommandParams } from '../../public/js/util/params.js'
import { sendToBack } from '../../public/js/util/api-front.js'

describe('frontend runAdminCommand', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
    getAdminCommandParams.mockResolvedValue({
      command: 'admin-start-scrape',
      site: 'kcna',
      scrapeId: null,
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders the initial command failure instead of ignoring it', async () => {
    const failure = {
      success: false,
      message: 'Scraper service is unavailable',
      data: { status: 503 },
    }
    sendToBack.mockResolvedValue(failure)

    const result = await runAdminCommand()

    expect(buildAdminStatusDisplay).toHaveBeenCalledWith(failure)
    expect(result).toEqual(failure)
  })

  it('polls status while the initial command request remains pending', async () => {
    const commandRequest = buildDeferredPromise()
    const statusResult = { success: true, message: 'Running', data: { scrapeActive: true } }
    sendToBack.mockImplementation((params) => {
      if (params.route === '/nork-admin-command-route') return commandRequest.promise
      return Promise.resolve(statusResult)
    })

    const commandPromise = runAdminCommand()
    await vi.advanceTimersByTimeAsync(1000)

    expect(sendToBack).toHaveBeenCalledWith({ route: '/nork-admin-polling-route', scrapeId: null })
    expect(buildAdminStatusDisplay).toHaveBeenCalledWith(statusResult)

    commandRequest.resolve({ success: true, message: 'Started', data: {} })
    await commandPromise
  })

  it('prevents an older polling response from overwriting a newer command result', async () => {
    const staleStatusRequest = buildDeferredPromise()
    const firstCommand = { success: true, message: 'First', data: {} }
    const secondCommand = { success: true, message: 'Second', data: {} }
    sendToBack
      .mockResolvedValueOnce(firstCommand)
      .mockReturnValueOnce(staleStatusRequest.promise)
      .mockResolvedValueOnce(secondCommand)

    await runAdminCommand()
    await vi.advanceTimersByTimeAsync(1000)
    await runAdminCommand()
    staleStatusRequest.resolve({ success: true, message: 'Stale', data: {} })
    await Promise.resolve()

    expect(buildAdminStatusDisplay).toHaveBeenCalledWith(secondCommand)
    expect(buildAdminStatusDisplay).not.toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Stale' }),
    )
  })

  it('renders polling callback rejections as safe failures', async () => {
    sendToBack
      .mockResolvedValueOnce({ success: true, message: 'Started', data: {} })
      .mockRejectedValueOnce(new Error('network detail'))

    await runAdminCommand()
    await vi.advanceTimersByTimeAsync(1000)

    expect(buildAdminStatusDisplay).toHaveBeenCalledWith({
      success: false,
      message: 'Unable to retrieve scraper status',
      data: { status: 503 },
    })
  })

  it('refreshes admin data again after a long command completes', async () => {
    const commandRequest = buildDeferredPromise()
    sendToBack.mockImplementation((params) => {
      if (params.route === '/nork-admin-command-route') return commandRequest.promise
      return Promise.resolve({ success: true, message: 'Running', data: {} })
    })

    const commandPromise = runAdminCommand()
    await vi.advanceTimersByTimeAsync(3000)

    expect(updateAdminDisplay).toHaveBeenCalledTimes(1)

    commandRequest.resolve({ success: true, message: 'Complete', data: {} })
    await commandPromise

    expect(updateAdminDisplay).toHaveBeenCalledTimes(2)
    expect(updateAdminDisplay).toHaveBeenLastCalledWith(expect.any(Function))
  })

  it('prevents an in-flight older refresh from committing after a newer command starts', async () => {
    const staleRefresh = buildDeferredPromise()
    let hasStaleCommit = false
    updateAdminDisplay
      .mockImplementationOnce(async (isCurrentGeneration) => {
        await staleRefresh.promise
        if (isCurrentGeneration()) hasStaleCommit = true
      })
      .mockResolvedValue(undefined)
    sendToBack.mockResolvedValue({ success: true, message: 'Started', data: {} })

    const firstCommandPromise = runAdminCommand()
    for (let i = 0; i < 20; i += 1) await Promise.resolve()
    expect(updateAdminDisplay).toHaveBeenCalledTimes(1)

    await runAdminCommand()
    staleRefresh.resolve()
    await firstCommandPromise

    expect(updateAdminDisplay).toHaveBeenCalledWith(expect.any(Function))
    expect(hasStaleCommit).toBe(false)
  })
})

const buildDeferredPromise = () => {
  let resolve
  const promise = new Promise((resolvePromise) => {
    resolve = resolvePromise
  })
  return { promise, resolve }
}

