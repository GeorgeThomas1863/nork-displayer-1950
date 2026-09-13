import { beforeEach, describe, expect, it, vi } from 'vitest'

function createElement(tagName) {
  return {
    tagName: tagName.toUpperCase(),
    textContent: '',
    controls: false,
    preload: '',
    src: '',
    children: [],
    append(...items) {
      for (const item of items) this.children.push(item)
    },
  }
}

function findElement(root, tagName) {
  if (root.tagName === tagName.toUpperCase()) return root
  for (const child of root.children) {
    const match = findElement(child, tagName)
    if (match) return match
  }
  return null
}

function collectText(root) {
  let text = root.textContent
  for (const child of root.children) text += collectText(child)
  return text
}

function installDocument() {
  const status = createElement('p')
  const watchList = createElement('main')
  vi.stubGlobal('document', {
    createElement,
    querySelector(selector) {
      if (selector === '#status') return status
      if (selector === '#watch-list') return watchList
      return null
    },
  })
  return { status, watchList }
}

async function loadPage(response) {
  const elements = installDocument()
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response))
  vi.resetModules()
  await import('../../public/js/watch-smoke.js')
  await vi.dynamicImportSettled()
  return elements
}

beforeEach(() => {
  vi.unstubAllGlobals()
})

describe('watch smoke page', () => {
  it('renders returned metadata and a playable video URL', async () => {
    const { status, watchList } = await loadPage({
      ok: true,
      json: vi.fn().mockResolvedValue([{
        title: 'Evening broadcast',
        date: '2026-09-12',
        vidType: 'KCTV',
        vidName: 'evening.mp4',
        vidSize: 1024,
        mediaUrl: '/watch/evening.mp4',
      }]),
    })

    const video = findElement(watchList, 'video')
    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch).toHaveBeenCalledWith('/nork-watch-smoke-data-route', {
      method: 'POST',
      body: JSON.stringify({ howMany: 5 }),
      headers: { 'Content-Type': 'application/json' },
    })
    expect(collectText(watchList)).toContain('Evening broadcast')
    expect(collectText(watchList)).toContain('2026-09-12')
    expect(collectText(watchList)).toContain('KCTV')
    expect(video.src).toBe('/watch/evening.mp4')
    expect(video.controls).toBe(true)
    expect(video.preload).toBe('metadata')
    expect(status.textContent).toBe('')
  })

  it('shows an empty state when no videos are returned', async () => {
    const { status, watchList } = await loadPage({
      ok: true,
      json: vi.fn().mockResolvedValue([]),
    })

    expect(status.textContent).toBe('No watch videos found.')
    expect(watchList.children).toHaveLength(0)
  })

  it('shows an error state when the request fails', async () => {
    const { status, watchList } = await loadPage({
      ok: false,
      json: vi.fn(),
    })

    expect(status.textContent).toBe('Unable to load watch videos.')
    expect(watchList.children).toHaveLength(0)
  })
})
