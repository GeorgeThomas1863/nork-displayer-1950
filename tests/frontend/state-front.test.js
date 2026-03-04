import { describe, it, expect, beforeEach } from 'vitest'
import stateFront, { updateStateFront, resetDataObj, dataObjExistsCheck } from '../../public/js/util/state-front.js'

beforeEach(async () => {
  await resetDataObj()
  stateFront.typeTrigger = 'articles'
  stateFront.articleType = 'fatboy'
  stateFront.isFirstLoad = true
})

describe('updateStateFront', () => {
  it('returns null when called with null', async () => {
    const result = await updateStateFront(null)
    expect(result).toBeNull()
  })

  it('returns null when called with empty array', async () => {
    const result = await updateStateFront([])
    expect(result).toBeNull()
  })

  it('typeTrigger articles, articleType fatboy, array of 3 — returns true, sets fatboy=3, all others null, isFirstLoad=false', async () => {
    stateFront.typeTrigger = 'articles'
    stateFront.articleType = 'fatboy'
    const result = await updateStateFront([1, 2, 3])
    expect(result).toBe(true)
    expect(stateFront.dataObj.articles.fatboy).toBe(3)
    expect(stateFront.dataObj.articles.topNews).toBeNull()
    expect(stateFront.dataObj.articles.latestNews).toBeNull()
    expect(stateFront.dataObj.articles.externalNews).toBeNull()
    expect(stateFront.dataObj.articles.anecdote).toBeNull()
    expect(stateFront.dataObj.articles.people).toBeNull()
    expect(stateFront.dataObj.articles.all).toBeNull()
    expect(stateFront.isFirstLoad).toBe(false)
  })

  it('typeTrigger articles, articleType topNews, array of 5 — sets topNews=5, fatboy=null', async () => {
    stateFront.typeTrigger = 'articles'
    stateFront.articleType = 'topNews'
    const result = await updateStateFront([1, 2, 3, 4, 5])
    expect(result).toBe(true)
    expect(stateFront.dataObj.articles.topNews).toBe(5)
    expect(stateFront.dataObj.articles.fatboy).toBeNull()
  })

  it('typeTrigger pics, array of 7 — returns true, sets dataObj.pics=7', async () => {
    stateFront.typeTrigger = 'pics'
    const result = await updateStateFront([1, 2, 3, 4, 5, 6, 7])
    expect(result).toBe(true)
    expect(stateFront.dataObj.pics).toBe(7)
  })

  it('typeTrigger vids, array of 2 — returns true, sets dataObj.vids=2', async () => {
    stateFront.typeTrigger = 'vids'
    const result = await updateStateFront([1, 2])
    expect(result).toBe(true)
    expect(stateFront.dataObj.vids).toBe(2)
  })
})

describe('resetDataObj', () => {
  it('resets articles.fatboy to null after it was set', async () => {
    stateFront.dataObj.articles.fatboy = 5
    await resetDataObj()
    expect(stateFront.dataObj.articles.fatboy).toBeNull()
  })

  it('resets pics to null after it was set', async () => {
    stateFront.dataObj.pics = 3
    await resetDataObj()
    expect(stateFront.dataObj.pics).toBeNull()
  })

  it('resets howMany to null after it was set', async () => {
    stateFront.howMany = 10
    await resetDataObj()
    expect(stateFront.howMany).toBeNull()
  })

  it('returns undefined (no explicit return value)', async () => {
    const result = await resetDataObj()
    expect(result).toBeUndefined()
  })
})

describe('dataObjExistsCheck', () => {
  it('returns false when all fields are null (fresh state)', async () => {
    const result = await dataObjExistsCheck()
    expect(result).toBe(false)
  })

  it('returns true when articles.fatboy=5', async () => {
    stateFront.dataObj.articles.fatboy = 5
    const result = await dataObjExistsCheck()
    expect(result).toBe(true)
  })

  it('returns false when articles.fatboy=0 (falsy)', async () => {
    stateFront.dataObj.articles.fatboy = 0
    const result = await dataObjExistsCheck()
    expect(result).toBe(false)
  })

  it('returns true when pics=3', async () => {
    stateFront.dataObj.pics = 3
    const result = await dataObjExistsCheck()
    expect(result).toBe(true)
  })

  it('returns true when vids=2', async () => {
    stateFront.dataObj.vids = 2
    const result = await dataObjExistsCheck()
    expect(result).toBe(true)
  })

  it('returns false when pics=null, vids=null, all articles null', async () => {
    stateFront.dataObj.pics = null
    stateFront.dataObj.vids = null
    for (const key in stateFront.dataObj.articles) {
      stateFront.dataObj.articles[key] = null
    }
    const result = await dataObjExistsCheck()
    expect(result).toBe(false)
  })
})
