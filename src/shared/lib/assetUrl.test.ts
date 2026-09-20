import { describe, expect, it } from 'vitest'
import { assetUrl } from './assetUrl'

describe('assetUrl', () => {
  it('supports a custom-domain root', () => {
    expect(assetUrl('assets/home/home-bunny-crt-hd.webp', '/')).toBe('/assets/home/home-bunny-crt-hd.webp')
  })
  it('supports a GitHub Pages project path', () => {
    expect(assetUrl('/assets/home/home-bunny-crt-hd.webp', '/portfolio')).toBe('/portfolio/assets/home/home-bunny-crt-hd.webp')
  })
  it('supports a portable relative base', () => {
    expect(assetUrl('assets/pages/logs-bunny-reading.webp', './')).toBe('./assets/pages/logs-bunny-reading.webp')
  })
  it('keeps CSS background URLs independent of the production stylesheet directory', () => {
    const background = assetUrl('assets/home/home-bunny-crt-hd.webp', './', 'https://elodiewu.com/#/')
    expect(background).toBe('https://elodiewu.com/assets/home/home-bunny-crt-hd.webp')
    expect(new URL(background, 'https://elodiewu.com/assets/index.css').href).toBe(background)
  })
  it('resolves relative assets under a project directory even on hash routes', () => {
    expect(assetUrl('assets/pages/logs-bunny-reading.webp', './', 'https://example.com/portfolio/#/logs'))
      .toBe('https://example.com/portfolio/assets/pages/logs-bunny-reading.webp')
  })
  it('respects an explicit root or project base regardless of the current document path', () => {
    expect(assetUrl('assets/home/home-bunny-crt-hd.webp', '/', 'https://elodiewu.com/#/about'))
      .toBe('https://elodiewu.com/assets/home/home-bunny-crt-hd.webp')
    expect(assetUrl('assets/home/home-bunny-crt-hd.webp', '/portfolio/', 'https://example.com/other/#/about'))
      .toBe('https://example.com/portfolio/assets/home/home-bunny-crt-hd.webp')
  })
})
