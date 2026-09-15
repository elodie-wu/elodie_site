import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { scenePaths } from '../../config/site'
import {
  adjacentScenePath, isAtScrollEdge, sceneNavigationTiming,
  type SceneDirection,
} from './sceneNavigation'

/** Browser-side controller: wheel resistance, content boundaries, and route transition. */
export function useSceneNavigation() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const lastNavigation = useRef(0)
  const [transition, setTransition] = useState<SceneDirection | null>(null)
  const isScene = scenePaths.includes(pathname)

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    setTransition(null)
  }, [pathname])

  useEffect(() => {
    if (!isScene) return
    let distance = 0
    let currentDirection: SceneDirection | null = null
    let resetTimer = 0
    let navigationTimer = 0
    const reset = () => { distance = 0; currentDirection = null }

    const handleWheel = (event: WheelEvent) => {
      if (event.ctrlKey || Math.abs(event.deltaY) < 4) return
      if (Date.now() - lastNavigation.current < sceneNavigationTiming.cooldownMs) return
      const direction = event.deltaY > 0 ? 'down' : 'up'
      const scrollElement = document.scrollingElement ?? document.documentElement
      const maxScrollTop = Math.max(0, scrollElement.scrollHeight - window.innerHeight)
      if (!isAtScrollEdge(scrollElement.scrollTop, maxScrollTop, direction)) {
        reset()
        return
      }
      if (currentDirection && direction !== currentDirection) distance = 0
      currentDirection = direction
      distance += event.deltaY
      window.clearTimeout(resetTimer)
      resetTimer = window.setTimeout(reset, sceneNavigationTiming.idleResetMs)
      if (Math.abs(distance) < sceneNavigationTiming.distance) return

      const nextPath = adjacentScenePath(pathname, direction)
      reset()
      if (!nextPath) return
      lastNavigation.current = Date.now()
      setTransition(direction)
      navigationTimer = window.setTimeout(() => {
        navigate(nextPath)
        setTransition(null)
      }, sceneNavigationTiming.transitionMs)
    }

    window.addEventListener('wheel', handleWheel, { passive: true })
    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.clearTimeout(resetTimer)
      window.clearTimeout(navigationTimer)
    }
  }, [isScene, pathname, navigate])

  return { isScene, transition }
}
