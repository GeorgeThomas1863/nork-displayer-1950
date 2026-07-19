import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest'

vi.mock('../../public/js/util/collapse-display.js', () => ({
  buildCollapseContainer: vi.fn().mockResolvedValue(null),
  defineCollapseItems: vi.fn(),
}))
vi.mock('../../public/js/util/state-front.js', () => ({
  default: { articleType: 'fatboy', picType: 'all', vidType: 'vidPages' },
}))

import { buildVidTitle, buildVidDate, buildVidElement, buildVidListItem, buildVidPagesDisplay, buildVidTypeButtonItem, buildVidsReturnDisplay } from '../../public/js/vids/vids-return.js'
import { buildCollapseContainer } from '../../public/js/util/collapse-display.js'

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

describe('buildVidTitle', () => {
  it('returns null for null input', () => {
    expect(buildVidTitle(null)).toBeNull()
  })

  it('returns null for empty string', () => {
    expect(buildVidTitle('')).toBeNull()
  })

  it('returns an h2 with class vid-title and the given textContent', () => {
    const el = buildVidTitle('My Video')
    expect(el.tagName).toBe('H2')
    expect(el.className).toBe('vid-title')
    expect(el.textContent).toBe('My Video')
  })
})

describe('buildVidDate', () => {
  it('returns null for null input', () => {
    expect(buildVidDate(null)).toBeNull()
  })

  it('returns null for empty string', () => {
    expect(buildVidDate('')).toBeNull()
  })

  it('returns a div with class vid-date and non-empty textContent', () => {
    const el = buildVidDate('2024-06-15')
    expect(el.tagName).toBe('DIV')
    expect(el.className).toBe('vid-date')
    expect(el.textContent.length).toBeGreaterThan(0)
  })
})

describe('buildVidElement', () => {
  it('returns null for null input', () => {
    expect(buildVidElement(null)).toBeNull()
  })

  it('returns null for empty string', () => {
    expect(buildVidElement('')).toBeNull()
  })

  it('returns a video element with class vid-element and controls=true', () => {
    const el = buildVidElement('/path/to/video.mp4')
    expect(el.tagName).toBe('VIDEO')
    expect(el.className).toBe('vid-element')
    expect(el.controls).toBe(true)
  })

  it('video has 1 child source element with correct src and type', () => {
    const el = buildVidElement('/path/to/video.mp4')
    expect(el.children.length).toBe(1)
    const source = el.children[0]
    expect(source.src).toBe('/kcna-vids/video.mp4')
    expect(source.type).toBe('video/mp4')
  })
})

describe('video record validation', () => {
  const validRecord = {
    title: 'Valid video',
    date: '2024-06-15',
    vidData: { savePath: '/videos/test.mp4' },
  }

  it.each([
    ['title', { date: validRecord.date, vidData: validRecord.vidData }],
    ['date', { title: validRecord.title, vidData: validRecord.vidData }],
    ['vidData', { title: validRecord.title, date: validRecord.date }],
    ['savePath', { title: validRecord.title, date: validRecord.date, vidData: {} }],
  ])('skips a record missing %s', async (_, record) => {
    expect(await buildVidListItem(record, true)).toBeNull()
  })

  it('renders valid records from a mixed valid and invalid array', async () => {
    const display = await buildVidPagesDisplay([
      { title: 'Missing video data', date: validRecord.date },
      validRecord,
      { title: validRecord.title, vidData: validRecord.vidData },
    ])

    expect(display.children).toHaveLength(1)
  })

  it('returns null when every video record is invalid', async () => {
    const display = await buildVidsReturnDisplay([
      { title: 'Missing date', vidData: validRecord.vidData },
      { date: validRecord.date, vidData: validRecord.vidData },
    ])

    expect(display).toBeNull()
  })
})

describe('buildVidListItem', () => {
  it('keeps untrusted video titles as text instead of HTML', async () => {
    await buildVidListItem({
      title: '<img src=x onerror=alert(1)>',
      date: '2024-06-15',
      vidData: { savePath: '/videos/test.mp4' },
    }, true)

    const collapseParams = buildCollapseContainer.mock.calls[0][0]
    expect(collapseParams.titleElement.innerHTML).toBe('')
    expect(collapseParams.titleElement.textContent).toBe('<img src=x onerror=alert(1)>')
    expect(collapseParams.titleElement.children[1].textContent).toContain('June')
  })
})

describe('buildVidTypeButtonItem', () => {
  it('returns a li with a button that has the correct id', () => {
    const li = buildVidTypeButtonItem({ buttonValue: 'vidPages', buttonText: 'KCNA Vids' })
    expect(li.tagName).toBe('LI')
    const button = li.children[0]
    expect(button.id).toBe('vid-type-button-vidPages')
  })

  it('adds active class when buttonValue matches stateFront.vidType', () => {
    // stateFront.vidType is 'vidPages'
    const li = buildVidTypeButtonItem({ buttonValue: 'vidPages', buttonText: 'KCNA Vids' })
    const button = li.children[0]
    expect(button.classList._classes.has('active')).toBe(true)
  })

  it('does not add active class when buttonValue does not match stateFront.vidType', () => {
    const li = buildVidTypeButtonItem({ buttonValue: 'other', buttonText: 'Other' })
    const button = li.children[0]
    expect(button.classList._classes.has('active')).toBe(false)
  })
})
