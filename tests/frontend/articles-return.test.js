import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest'

vi.mock('../../public/js/util/collapse-display.js', () => ({
  buildCollapseContainer: vi.fn().mockResolvedValue(null),
  defineCollapseItems: vi.fn(),
}))
vi.mock('../../public/js/pics/pics-container.js', () => ({
  buildPicsCollapseContainer: vi.fn().mockResolvedValue(null),
}))
vi.mock('../../public/js/util/state-front.js', () => ({
  default: { articleType: 'fatboy', picType: 'all', vidType: 'vidPages' },
}))

import { buildArticleTitle, buildArticleDate, buildArticleText, buildArticleTypeButtonItem } from '../../public/js/articles/articles-return.js'

function createEl(tag) {
  const el = {
    tagName: tag.toUpperCase(),
    className: '',
    id: '',
    textContent: '',
    innerHTML: '',
    src: '',
    alt: '',
    type: '',
    controls: false,
    children: [],
    _attrs: {},
    classList: {
      _classes: new Set(),
      add(...names) { names.forEach(n => this._classes.add(n)) },
      remove(...names) { names.forEach(n => this._classes.delete(n)) },
      toggle(name) { this._classes.has(name) ? this._classes.delete(name) : this._classes.add(name) },
      contains(name) { return this._classes.has(name) },
    },
    setAttribute(k, v) { this._attrs[k] = v },
    getAttribute(k) { return this._attrs[k] },
    append(...items) { items.forEach(i => this.children.push(i)) },
    appendChild(item) { this.children.push(item); return item },
    addEventListener: vi.fn(),
    querySelector(sel) {
      for (const child of this.children) {
        if (!child) continue
        if (child._matchSel && child._matchSel(sel)) return child
        if (child.querySelector) { const f = child.querySelector(sel); if (f) return f }
      }
      return null
    },
    _matchSel(sel) {
      if (sel.startsWith('.')) return this.className.split(' ').filter(Boolean).includes(sel.slice(1))
      if (sel.startsWith('#')) return this.id === sel.slice(1)
      return this.tagName.toLowerCase() === sel.toLowerCase()
    },
  }
  return el
}

beforeAll(() => {
  vi.stubGlobal('document', {
    createElement: (tag) => createEl(tag),
    createTextNode: (text) => ({ textContent: String(text), nodeType: 3 }),
  })
})

beforeEach(() => {
  vi.clearAllMocks()
})

describe('buildArticleTitle', () => {
  it('returns an h2 with class article-title and the given text', () => {
    const el = buildArticleTitle('Hello World')
    expect(el.tagName).toBe('H2')
    expect(el.className).toBe('article-title')
    expect(el.textContent).toBe('Hello World')
  })
})

describe('buildArticleDate', () => {
  it('returns a div with class article-date and a non-empty textContent', () => {
    const el = buildArticleDate('2024-01-15')
    expect(el.tagName).toBe('DIV')
    expect(el.className).toBe('article-date')
    expect(el.textContent.length).toBeGreaterThan(0)
  })

  it('formatted date textContent contains the year 2024', () => {
    const el = buildArticleDate('2024-01-15')
    expect(el.textContent).toContain('2024')
  })
})

describe('buildArticleText', () => {
  it('returns null for null input', () => {
    expect(buildArticleText(null)).toBeNull()
  })

  it('returns null for empty string', () => {
    expect(buildArticleText('')).toBeNull()
  })

  it('returns a div.article-text with 1 text node child for a single-line string', () => {
    const el = buildArticleText('hello')
    expect(el.tagName).toBe('DIV')
    expect(el.className).toBe('article-text')
    expect(el.children.length).toBe(1)
    expect(el.children[0].textContent).toBe('hello')
  })

  it('returns 3 children (textNode, br, textNode) for a two-line string', () => {
    const el = buildArticleText('line1\nline2')
    // 2 text nodes + 1 br
    expect(el.children.length).toBe(3)
    expect(el.children[0].textContent).toBe('line1')
    expect(el.children[1].tagName).toBe('BR')
    expect(el.children[2].textContent).toBe('line2')
  })

  it('returns 5 children (3 text nodes, 2 br elements) for a three-line string', () => {
    const el = buildArticleText('a\nb\nc')
    expect(el.children.length).toBe(5)
    expect(el.children[0].textContent).toBe('a')
    expect(el.children[1].tagName).toBe('BR')
    expect(el.children[2].textContent).toBe('b')
    expect(el.children[3].tagName).toBe('BR')
    expect(el.children[4].textContent).toBe('c')
  })
})

describe('buildArticleTypeButtonItem', () => {
  it('returns a li with one child button with correct id, className, and data-update', () => {
    const li = buildArticleTypeButtonItem({ buttonValue: 'fatboy', buttonText: 'KJU stuff' })
    expect(li.tagName).toBe('LI')
    expect(li.children.length).toBe(1)
    const button = li.children[0]
    expect(button.id).toBe('article-type-button-fatboy')
    expect(button.className).toBe('button-type-item')
    expect(button._attrs['data-update']).toBe('article-type-button-fatboy')
  })

  it('adds active class when buttonValue matches stateFront.articleType', () => {
    // stateFront.articleType is 'fatboy'
    const li = buildArticleTypeButtonItem({ buttonValue: 'fatboy', buttonText: 'KJU stuff' })
    const button = li.children[0]
    expect(button.classList._classes.has('active')).toBe(true)
  })

  it('does not add active class when buttonValue does not match stateFront.articleType', () => {
    const li = buildArticleTypeButtonItem({ buttonValue: 'topNews', buttonText: 'Top News' })
    const button = li.children[0]
    expect(button.classList._classes.has('active')).toBe(false)
  })
})
