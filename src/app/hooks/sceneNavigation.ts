import { scenePaths } from '../../config/site'

export type SceneDirection = 'up' | 'down'

export const sceneNavigationTiming = {
  distance: 150,
  idleResetMs: 220,
  cooldownMs: 720,
  transitionMs: 170,
} as const

export function adjacentScenePath(path: string, direction: SceneDirection): string | null {
  const index = scenePaths.indexOf(path)
  if (index === -1) return null
  return scenePaths[index + (direction === 'down' ? 1 : -1)] ?? null
}

export function isAtScrollEdge(scrollTop: number, maxScrollTop: number, direction: SceneDirection): boolean {
  return direction === 'down' ? scrollTop >= maxScrollTop - 4 : scrollTop <= 4
}
