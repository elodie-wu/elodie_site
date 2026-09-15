import { describe, expect, it } from 'vitest'
import { siteConfig } from '../../config/site'
import { backgroundPrefetchPlan } from './backgroundPrefetch'

describe('background prefetch policy', () => {
  it('warms just Work after Home, and follows the configured scene order', () => {
    expect(backgroundPrefetchPlan('/')).toEqual({ current: siteConfig.backgrounds.home, next: siteConfig.backgrounds.work })
    expect(backgroundPrefetchPlan('/play')).toEqual({ current: siteConfig.backgrounds.play, next: siteConfig.backgrounds.logs })
  })
  it('does not wrap after About or prefetch on ordinary or unknown pages', () => {
    expect(backgroundPrefetchPlan('/about')).toBeNull()
    expect(backgroundPrefetchPlan('/architecture')).toBeNull()
    expect(backgroundPrefetchPlan('/unknown')).toBeNull()
  })
  it('respects data saver and slow connections', () => {
    expect(backgroundPrefetchPlan('/', { saveData: true })).toBeNull()
    expect(backgroundPrefetchPlan('/', { effectiveType: '2g' })).toBeNull()
    expect(backgroundPrefetchPlan('/', { effectiveType: 'slow-2g' })).toBeNull()
    expect(backgroundPrefetchPlan('/', { effectiveType: '4g' })).not.toBeNull()
  })
})
