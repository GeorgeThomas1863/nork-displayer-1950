const DAY_MS = 24 * 60 * 60 * 1000

export const selectCandidates = (fileList, referencedSet, opts = {}) => {
  if (!Array.isArray(fileList)) return []

  const { orphans = false, olderThanDays, nowMs = Date.now() } = opts
  const hasAgeLimit = Number.isFinite(olderThanDays) && olderThanDays >= 0
  if (!orphans && !hasAgeLimit) return []

  const candidates = []
  const ageCutoffMs = nowMs - olderThanDays * DAY_MS

  for (const file of fileList) {
    const isOrphan = orphans && !referencedSet.has(file.name)
    const isOlder = hasAgeLimit && file.mtimeMs < ageCutoffMs
    if (!isOrphan && !isOlder) continue
    candidates.push(file)
  }

  return candidates
}
