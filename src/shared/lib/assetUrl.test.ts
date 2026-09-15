import { describe, expect, it } from 'vitest'
import { assetUrl } from './assetUrl'

describe('assetUrl', () => {
  it('supports a custom-domain root', () => {
    expect(assetUrl('assets/home/home-bg.png', '/')).toBe('/assets/home/home-bg.png')
  })
  it('supports a GitHub Pages project path', () => {
    expect(assetUrl('/assets/home/home-bg.png', '/portfolio')).toBe('/portfolio/assets/home/home-bg.png')
  })
  it('supports a portable relative base', () => {
    expect(assetUrl('assets/pages/logs-bg-v2.png', './')).toBe('./assets/pages/logs-bg-v2.png')
  })
  it('keeps CSS background URLs independent of the production stylesheet directory', () => {
    const background = assetUrl('assets/home/home-bg.png', './', 'https://elodiewu.com/#/')
    expect(background).toBe('https://elodiewu.com/assets/home/home-bg.png')
    expect(new URL(background, 'https://elodiewu.com/assets/index.css').href).toBe(background)
  })
  it('resolves relative assets under a project directory even on hash routes', () => {
    expect(assetUrl('assets/pages/logs-bg-v2.png', './', 'https://example.com/portfolio/#/logs'))
      .toBe('https://example.com/portfolio/assets/pages/logs-bg-v2.png')
  })
  it('respects an explicit root or project base regardless of the current document path', () => {
    expect(assetUrl('assets/home/home-bg.png', '/', 'https://elodiewu.com/#/about'))
      .toBe('https://elodiewu.com/assets/home/home-bg.png')
    expect(assetUrl('assets/home/home-bg.png', '/portfolio/', 'https://example.com/other/#/about'))
      .toBe('https://example.com/portfolio/assets/home/home-bg.png')
  })
})
