import { describe, expect, it } from 'vitest'

import { selectCandidates } from '../../scripts/trim-pics-select.js'

const NOW_MS = Date.UTC(2026, 8, 9)
const DAY_MS = 24 * 60 * 60 * 1000

const buildFile = (name, ageDays) => ({
  name,
  path: `/data/pics/${name}`,
  size: 1024,
  mtimeMs: NOW_MS - ageDays * DAY_MS,
})

describe('selectCandidates', () => {
  it('returns no candidates when no selection option is enabled', () => {
    const files = [buildFile('kept.jpg', 100)]

    expect(selectCandidates(files, new Set(), {})).toEqual([])
  })

  it('selects files whose filenames are not referenced when orphans is enabled', () => {
    const referenced = buildFile('referenced.jpg', 1)
    const orphan = buildFile('orphan.jpg', 1)

    const result = selectCandidates(
      [referenced, orphan],
      new Set(['referenced.jpg']),
      { orphans: true }
    )

    expect(result).toEqual([orphan])
  })

  it('selects only files strictly older than the configured number of days', () => {
    const older = buildFile('older.jpg', 31)
    const boundary = buildFile('boundary.jpg', 30)
    const newer = buildFile('newer.jpg', 29)

    const result = selectCandidates(
      [older, boundary, newer],
      new Set(),
      { olderThanDays: 30, nowMs: NOW_MS }
    )

    expect(result).toEqual([older])
  })

  it('selects the union of orphan and age candidates without duplicates', () => {
    const oldReferenced = buildFile('old-referenced.jpg', 60)
    const recentOrphan = buildFile('recent-orphan.jpg', 1)
    const oldOrphan = buildFile('old-orphan.jpg', 60)
    const recentReferenced = buildFile('recent-referenced.jpg', 1)
    const referenced = new Set(['old-referenced.jpg', 'recent-referenced.jpg'])

    const result = selectCandidates(
      [oldReferenced, recentOrphan, oldOrphan, recentReferenced],
      referenced,
      { orphans: true, olderThanDays: 30, nowMs: NOW_MS }
    )

    expect(result).toEqual([oldReferenced, recentOrphan, oldOrphan])
  })
})
