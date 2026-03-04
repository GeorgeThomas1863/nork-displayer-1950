import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest'
import { hideArray, unhideArray, buildCollapseContainer, defineCollapseItems } from '../../public/js/util/collapse-display.js'

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

describe('hideArray', () => {
  it('adds hidden class to an element', () => {
    const el = createEl('div')
    hideArray([el])
    expect(el.classList._classes.has('hidden')).toBe(true)
  })

  it('skips null entries and processes valid element', () => {
    const el = createEl('div')
    hideArray([null, el])
    expect(el.classList._classes.has('hidden')).toBe(true)
  })

  it('does not throw on empty array', () => {
    expect(() => hideArray([])).not.toThrow()
  })
})

describe('unhideArray', () => {
  it('removes hidden class from an element', () => {
    const el = createEl('div')
    el.classList._classes.add('hidden')
    unhideArray([el])
    expect(el.classList._classes.has('hidden')).toBe(false)
  })

  it('skips null entries and processes valid element', () => {
    const el = createEl('div')
    el.classList._classes.add('hidden')
    unhideArray([null, el])
    expect(el.classList._classes.has('hidden')).toBe(false)
  })

  it('does not throw on empty array', () => {
    expect(() => unhideArray([])).not.toThrow()
  })
})

describe('buildCollapseContainer', () => {
  it('returns null when inputObj is null', async () => {
    const result = await buildCollapseContainer(null)
    expect(result).toBeNull()
  })

  it('returns null when titleElement is missing', async () => {
    const el = createEl('div')
    const result = await buildCollapseContainer({ contentElement: el })
    expect(result).toBeNull()
  })

  it('returns null when contentElement is missing', async () => {
    const el = createEl('div')
    const result = await buildCollapseContainer({ titleElement: el })
    expect(result).toBeNull()
  })

  it('returns a container element when both titleElement and contentElement are provided', async () => {
    const title = createEl('div')
    const content = createEl('div')
    const result = await buildCollapseContainer({ titleElement: title, contentElement: content })
    expect(result).not.toBeNull()
  })

  it('container className contains collapse-container', async () => {
    const title = createEl('div')
    const content = createEl('div')
    const result = await buildCollapseContainer({ titleElement: title, contentElement: content })
    expect(result.className).toContain('collapse-container')
  })

  it('isExpanded=false: contentElement className contains hidden, arrow className is collapse-arrow', async () => {
    const title = createEl('div')
    const content = createEl('div')
    const result = await buildCollapseContainer({ titleElement: title, contentElement: content, isExpanded: false })
    expect(content.className).toContain('hidden')
    // arrow is first child of header (first child of container)
    const header = result.children[0]
    const arrow = header.children[0]
    expect(arrow.className).toBe('collapse-arrow')
    expect(arrow.className).not.toContain('expanded')
  })

  it('isExpanded=true: contentElement className does not contain hidden, arrow className contains expanded', async () => {
    const title = createEl('div')
    const content = createEl('div')
    const result = await buildCollapseContainer({ titleElement: title, contentElement: content, isExpanded: true })
    expect(content.className).not.toContain('hidden')
    const header = result.children[0]
    const arrow = header.children[0]
    expect(arrow.className).toContain('expanded')
  })

  it('custom className is included in container className', async () => {
    const title = createEl('div')
    const content = createEl('div')
    const result = await buildCollapseContainer({ titleElement: title, contentElement: content, className: 'my-class' })
    expect(result.className).toContain('my-class')
  })

  it('dataAttribute is set as data-update on the header', async () => {
    const title = createEl('div')
    const content = createEl('div')
    const result = await buildCollapseContainer({ titleElement: title, contentElement: content, dataAttribute: 'foo' })
    const header = result.children[0]
    expect(header._attrs['data-update']).toBe('foo')
  })

  it('titleElement gets collapse-title added to classList', async () => {
    const title = createEl('div')
    const content = createEl('div')
    await buildCollapseContainer({ titleElement: title, contentElement: content })
    expect(title.classList._classes.has('collapse-title')).toBe(true)
  })

  it('existing contentElement className is preserved and combined with collapse classes', async () => {
    const title = createEl('div')
    const content = createEl('div')
    content.className = 'existing-class'
    await buildCollapseContainer({ titleElement: title, contentElement: content, isExpanded: false })
    expect(content.className).toContain('existing-class')
    expect(content.className).toContain('collapse-content')
    expect(content.className).toContain('hidden')
  })
})

describe('defineCollapseItems', () => {
  it('returns null when input is null', () => {
    const result = defineCollapseItems(null)
    expect(result).toBeNull()
  })

  it('returns null when input is empty array', () => {
    const result = defineCollapseItems([])
    expect(result).toBeNull()
  })

  it('does not throw when querySelector returns null for all selectors', () => {
    const el = createEl('div')
    // querySelector will return null since there are no children
    expect(() => defineCollapseItems([el])).not.toThrow()
  })
})
