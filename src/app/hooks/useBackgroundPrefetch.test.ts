import { useEffect } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useBackgroundPrefetch } from './useBackgroundPrefetch'

vi.mock('react', () => ({ useEffect: vi.fn() }))

class TestImage {
  static instances: TestImage[] = []
  onload: (() => void) | null = null
  src = ''
  complete = false
  naturalWidth = 0
  fetchPriority = 'auto'
  constructor() { TestImage.instances.push(this) }
}

let testId = 0
const idle = vi.fn<(callback: () => void) => number>(() => 7)
const cancelIdle = vi.fn()
const timer = vi.fn<(callback: () => void, delay: number) => number>(() => 8)
const clearTimer = vi.fn()

function mount(pathname = '/') {
  useBackgroundPrefetch(pathname)
  return vi.mocked(useEffect).mock.calls.at(-1)![0]()
}

beforeEach(() => {
  vi.clearAllMocks()
  TestImage.instances = []
  vi.stubGlobal('Image', TestImage)
  vi.stubGlobal('document', { baseURI: `https://test-${++testId}.example/`, hidden: false })
  vi.stubGlobal('navigator', { connection: { effectiveType: '4g' } })
  vi.stubGlobal('window', {
    requestIdleCallback: idle, cancelIdleCallback: cancelIdle,
    setTimeout: timer, clearTimeout: clearTimer,
  })
})
afterEach(() => vi.unstubAllGlobals())

describe('background prefetch lifecycle', () => {
  it('waits for the current image and an idle callback before requesting the next image', () => {
    mount()
    expect(TestImage.instances).toHaveLength(1)
    expect(idle).not.toHaveBeenCalled()
    TestImage.instances[0].onload?.()
    expect(idle).toHaveBeenCalledOnce()
    expect(TestImage.instances).toHaveLength(1)
    idle.mock.calls[0][0]()
    expect(TestImage.instances).toHaveLength(2)
    expect(TestImage.instances[1].src).toContain('work-bg-v2-')
    expect(TestImage.instances[1].fetchPriority).toBe('low')
  })
  it('cancels scheduled work when the route is unmounted', () => {
    const cleanup = mount()
    TestImage.instances[0].onload?.()
    if (typeof cleanup === 'function') cleanup()
    expect(cancelIdle).toHaveBeenCalledWith(7)
    expect(TestImage.instances[0].onload).toBeNull()
    idle.mock.calls[0][0]()
    expect(TestImage.instances).toHaveLength(1)
  })
  it('falls back to a cancellable timer when idle callbacks are unavailable', () => {
    vi.stubGlobal('window', { setTimeout: timer, clearTimeout: clearTimer })
    const cleanup = mount()
    TestImage.instances[0].onload?.()
    expect(timer.mock.calls[0][1]).toBe(250)
    if (typeof cleanup === 'function') cleanup()
    expect(clearTimer).toHaveBeenCalledWith(8)
  })
  it('does not request speculative images with data saver or while hidden', () => {
    vi.stubGlobal('navigator', { connection: { saveData: true } })
    mount()
    expect(TestImage.instances).toHaveLength(0)
    vi.stubGlobal('navigator', {})
    mount()
    TestImage.instances[0].onload?.()
    vi.stubGlobal('document', { hidden: true })
    idle.mock.calls[0][0]()
    expect(TestImage.instances).toHaveLength(1)
  })
  it('does not warm the same successfully loaded URL again', () => {
    mount()
    TestImage.instances[0].onload?.()
    idle.mock.calls[0][0]()
    TestImage.instances[1].onload?.()
    mount()
    expect(TestImage.instances).toHaveLength(2)
  })
})
