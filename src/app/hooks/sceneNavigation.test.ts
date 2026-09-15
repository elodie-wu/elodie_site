import { describe, expect, it } from 'vitest'
import { adjacentScenePath, isAtScrollEdge } from './sceneNavigation'

describe('scene navigation', () => {
  it('follows the same order as navigation configuration', () => {
    expect(adjacentScenePath('/', 'down')).toBe('/work')
    expect(adjacentScenePath('/play', 'down')).toBe('/logs')
    expect(adjacentScenePath('/about', 'up')).toBe('/logs')
  })
  it('does not move past either end or from a non-scene page', () => {
    expect(adjacentScenePath('/', 'up')).toBeNull()
    expect(adjacentScenePath('/about', 'down')).toBeNull()
    expect(adjacentScenePath('/architecture', 'up')).toBeNull()
  })
  it('allows long content to scroll before changing pages', () => {
    expect(isAtScrollEdge(200, 800, 'up')).toBe(false)
    expect(isAtScrollEdge(200, 800, 'down')).toBe(false)
    expect(isAtScrollEdge(0, 800, 'up')).toBe(true)
    expect(isAtScrollEdge(800, 800, 'down')).toBe(true)
    expect(isAtScrollEdge(0, 0, 'down')).toBe(true)
  })
})
