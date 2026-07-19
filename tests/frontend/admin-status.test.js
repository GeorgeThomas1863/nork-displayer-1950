import { beforeEach, describe, expect, it } from 'vitest'

import { buildAdminStatusDisplay } from '../../public/js/admin/admin-status.js'

class ElementStub {
  constructor() {
    this.children = []
    this.id = ''
    this.className = ''
    this.textContent = ''
  }

  append(...children) {
    this.children.push(...children)
  }

  remove() {}
}

describe('buildAdminStatusDisplay', () => {
  let sidebar

  beforeEach(() => {
    sidebar = new ElementStub()
    global.document = {
      createElement: () => new ElementStub(),
      getElementById: (id) => id === 'admin-sidebar' ? sidebar : null,
    }
  })

  it('renders a failed operation message as the scrape message', async () => {
    await buildAdminStatusDisplay({
      success: false,
      message: 'Scrape pipeline failed',
      data: { status: 500 },
    })

    const section = sidebar.children[0]
    const rows = section.children.slice(2)
    const messageValue = rows[0].children[1]
    expect(messageValue.textContent).toBe('Scrape pipeline failed')
  })

  it('renders status data from a successful operation result', async () => {
    await buildAdminStatusDisplay({
      success: true,
      message: 'Scrape running',
      data: { scrapeActive: true, scrapeMessage: 'Fetching articles' },
    })

    const section = sidebar.children[0]
    const rows = section.children.slice(2)
    expect(rows[0].children[1].textContent).toBe('Fetching articles')
    expect(rows[2].children[1].textContent).toBe('Active')
  })
})
