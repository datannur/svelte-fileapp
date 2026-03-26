import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { chromium } from 'playwright'
import type { Browser, Page } from 'playwright'
import http from 'http'
import sirv from 'sirv'
import path from 'path'
import { fileURLToPath } from 'url'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const distDir = path.join(dirname, '../app')

let server: http.Server | undefined = undefined
let browser: Browser | undefined = undefined
let page: Page | undefined = undefined
const port = 3555
const baseUrl = `http://localhost:${port}`

beforeAll(async () => {
  // Start server
  const serve = sirv(distDir, { single: true, dev: true })
  server = http.createServer((req, res) => {
    serve(req, res)
  })

  await new Promise<void>(resolve => {
    server?.listen(port, () => {
      console.log(`Test server running on ${baseUrl}`)
      resolve()
    })
  })

  // Start browser
  browser = await chromium.launch({ headless: true })
  page = await browser.newPage()

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.error(`Console error: ${msg.text()}`)
    }
  })

  page.on('pageerror', error => {
    console.error(`Page error: ${error.message}`)
  })
})

afterAll(async () => {
  await browser?.close()

  if (server) {
    await new Promise<void>((resolve, reject) => {
      server?.close(err => {
        if (err) reject(err)
        else resolve()
      })
    })
  }
})

describe('E2E - svelte-fileapp Router', () => {
  it('should load homepage', async () => {
    await page?.goto(baseUrl)
    await page?.waitForSelector('div#wrapper > section.section', {
      timeout: 5000,
    })

    const heading = await page?.textContent('h1')
    expect(heading).toBe('Welcome to Test App')
  })

  it('should navigate to about page', async () => {
    await page?.goto(`${baseUrl}#/about`)
    await page?.waitForSelector('div#wrapper > section.section')

    const heading = await page?.textContent('h1')
    expect(heading).toBe('About')
  })

  it('should navigate to contact page', async () => {
    await page?.goto(`${baseUrl}#/contact`)
    await page?.waitForSelector('div#wrapper > section.section')

    const heading = await page?.textContent('h1')
    expect(heading).toBe('Contact')
  })

  it('should handle URL parameters', async () => {
    await page?.goto(`${baseUrl}#/contact?email=test@example.com`)
    await page?.waitForSelector('div#wrapper > section.section')

    const url = await page?.url()
    expect(url).toContain('email=test@example.com')
  })

  it('should show 404 error for unknown routes', async () => {
    await page?.goto(`${baseUrl}#/unknown-page`)
    await page?.waitForSelector('div#wrapper > section.section')

    const heading = await page?.textContent('h1')
    expect(heading).toContain('404')
  })
})

describe('E2E - svelte-fileapp Bootstrap', () => {
  it('should mount app in target element', async () => {
    await page?.goto(baseUrl)
    const app = await page?.locator('#app').count()
    expect(app).toBeGreaterThan(0)

    const wrapper = await page?.locator('#wrapper').count()
    expect(wrapper).toBeGreaterThan(0)
  })

  it('should initialize without errors', async () => {
    await page?.goto(baseUrl)
    await page?.waitForSelector('div#wrapper > section.section', {
      timeout: 5000,
    })

    const errors: string[] = []
    page?.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })

    expect(errors.length).toBe(0)
  })
})
