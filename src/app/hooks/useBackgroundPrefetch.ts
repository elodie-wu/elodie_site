import { useEffect } from 'react'
import { assetUrl } from '../../shared/lib/assetUrl'
import { backgroundPrefetchPlan, type ConnectionHint } from './backgroundPrefetch'

const warmed = new Set<string>()

/** Wait for the current image, then warm one neighbour at low priority while idle. */
export function useBackgroundPrefetch(pathname: string) {
  useEffect(() => {
    const connection = (navigator as Navigator & { connection?: ConnectionHint }).connection
    const plan = backgroundPrefetchPlan(pathname, connection)
    if (!plan) return
    const nextUrl = assetUrl(plan.next)
    if (warmed.has(nextUrl)) return
    let cancelled = false
    let idleId: number | undefined
    let timerId: number | undefined
    const current = new Image()
    let next: HTMLImageElement | undefined

    const prefetch = () => {
      if (cancelled || document.hidden) return
      next = new Image()
      next.fetchPriority = 'low'
      next.onload = () => { warmed.add(nextUrl) }
      next.src = nextUrl
    }
    const schedule = () => {
      if (cancelled || idleId !== undefined || timerId !== undefined) return
      if (typeof window.requestIdleCallback === 'function') idleId = window.requestIdleCallback(prefetch)
      else timerId = window.setTimeout(prefetch, 250)
    }
    current.onload = schedule
    current.src = assetUrl(plan.current)
    if (current.complete && current.naturalWidth > 0) schedule()

    return () => {
      cancelled = true
      current.onload = null
      if (next) next.onload = null
      if (idleId !== undefined) window.cancelIdleCallback(idleId)
      if (timerId !== undefined) window.clearTimeout(timerId)
    }
  }, [pathname])
}
