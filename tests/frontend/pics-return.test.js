import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest'

vi.mock('../../public/js/util/collapse-display.js', () => ({
  buildCollapseContainer: vi.fn().mockResolvedValue(null),
  defineCollapseItems: vi.fn(),
}))
vi.mock('../../public/js/util/state-front.js', () => ({
  default: { articleType: 'fatboy', picType: 'all', vidType: 'vidPages' },
}))

import { buildPicContainerTitle, buildPicContainerDate, buildPicElement, buildPicElementServer, buildPicTypeButtonItem } from '../../public/js/pics/pics-return.js'

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

describe('buildPicContainerTitle', () => {
  it('returns an h2 with class pic-container-title and the given text', () => {
    const el = buildPicContainerTitle('My Title')
    expect(el.tagName).toBe('H2')
    expect(el.className).toBe('pic-container-title')
    expect(el.textContent).toBe('My Title')
  })
})

describe('buildPicContainerDate', () => {
  it('returns a div with class pic-container-date and non-empty textContent', () => {
    const el = buildPicContainerDate('2024-06-15')
    expect(el.tagName).toBe('DIV')
    expect(el.className).toBe('pic-container-date')
    expect(el.textContent.length).toBeGreaterThan(0)
  })
})

describe('buildPicElement', () => {
  it('returns null for null input', async () => {
    const result = await buildPicElement(null)
    expect(result).toBeNull()
  })

  it('returns null for empty string', async () => {
    const result = await buildPicElement('')
    expect(result).toBeNull()
  })

  it('returns an img with correct class, src (filename only), and alt for a path with slashes', async () => {
    const el = await buildPicElement('/some/path/file.jpg')
    expect(el.tagName).toBe('IMG')
    expect(el.className).toBe('pic-element')
    expect(el.src).toBe('/kcna-pics/file.jpg')
    expect(el.alt).toBe('KCNA PIC')
  })

  it('returns correct src for a filename with no slashes', async () => {
    const el = await buildPicElement('photo.png')
    expect(el.src).toBe('/kcna-pics/photo.png')
  })

  it('uses only the final filename segment for deeply nested paths', async () => {
    const el = await buildPicElement('/a/b/c/deep.jpg')
    expect(el.src).toBe('/kcna-pics/deep.jpg')
  })
})

describe('buildPicElementServer', () => {
  it('returns null for null input', () => {
    const result = buildPicElementServer(null)
    expect(result).toBeNull()
  })

  it('returns null when headers object has no server property', () => {
    const result = buildPicElementServer({})
    expect(result).toBeNull()
  })

  it('returns a div.pic-element-server with children when server property is present', () => {
    const el = buildPicElementServer({ server: 'nginx/1.2' })
    expect(el.tagName).toBe('DIV')
    expect(el.className).toBe('pic-element-server')
    expect(el.children.length).toBeGreaterThan(0)
  })
})

describe('buildPicTypeButtonItem', () => {
  it('returns a li with a button that has the correct id', () => {
    const li = buildPicTypeButtonItem({ buttonValue: 'all', buttonText: 'All Pics' })
    expect(li.tagName).toBe('LI')
    const button = li.children[0]
    expect(button.id).toBe('pic-type-button-all')
  })

  it('adds active class when buttonValue matches stateFront.picType', () => {
    // stateFront.picType is 'all'
    const li = buildPicTypeButtonItem({ buttonValue: 'all', buttonText: 'All Pics' })
    const button = li.children[0]
    expect(button.classList._classes.has('active')).toBe(true)
  })

  it('does not add active class when buttonValue does not match stateFront.picType', () => {
    const li = buildPicTypeButtonItem({ buttonValue: 'picSets', buttonText: 'Pic Sets' })
    const button = li.children[0]
    expect(button.classList._classes.has('active')).toBe(false)
  })
})
