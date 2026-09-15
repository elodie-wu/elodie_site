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
})
