import { describe, expect, it } from 'vitest'
import { advanceSnake, createFood, createInitialSnake, isOppositeDirection } from './engine'
import type { Food } from './types'

const food: Food = { x: 0, y: 0, emoji: '🍓' }

describe('snake engine', () => {
  it('starts with a three-cell snake', () => {
    expect(createInitialSnake()).toHaveLength(3)
  })
  it('moves without changing the original snake', () => {
    const snake = createInitialSnake()
    const move = advanceSnake(snake, food, 'right')
    expect(move?.snake[0]).toEqual({ x: 11, y: 10 })
    expect(move?.snake).toHaveLength(3)
    expect(snake[0]).toEqual({ x: 10, y: 10 })
  })
  it('grows when it eats food', () => {
    const move = advanceSnake(createInitialSnake(), { ...food, x: 11, y: 10 }, 'right')
    expect(move?.ateFood).toBe(true)
    expect(move?.snake).toHaveLength(4)
  })
  it('turns clockwise at a wall', () => {
    const move = advanceSnake([{ x: 19, y: 10 }, { x: 18, y: 10 }], food, 'right')
    expect(move?.direction).toBe('down')
    expect(move?.snake[0]).toEqual({ x: 19, y: 11 })
  })
  it('uses the other turn when the first is blocked', () => {
    const move = advanceSnake([
      { x: 19, y: 10 }, { x: 19, y: 11 }, { x: 18, y: 11 }, { x: 18, y: 10 },
    ], food, 'right')
    expect(move?.direction).toBe('up')
  })
  it('ends when a wall has no safe turn', () => {
    expect(advanceSnake([
      { x: 19, y: 10 }, { x: 19, y: 11 }, { x: 18, y: 11 },
      { x: 18, y: 10 }, { x: 18, y: 9 }, { x: 19, y: 9 }, { x: 19, y: 8 },
    ], food, 'right')).toBeNull()
  })
  it('ends on body collision', () => {
    expect(advanceSnake(createInitialSnake(), food, 'left')).toBeNull()
  })
  it('allows the head into a cell vacated by the tail', () => {
    const move = advanceSnake([
      { x: 1, y: 1 }, { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 2, y: 1 },
    ], food, 'right')
    expect(move?.snake[0]).toEqual({ x: 2, y: 1 })
  })
  it('never places food on an occupied cell', () => {
    expect(createFood([{ x: 0, y: 0 }], () => 0)).toEqual({ x: 1, y: 0, emoji: '🍓' })
  })
  it('identifies prohibited reverse turns', () => {
    expect(isOppositeDirection('right', 'left')).toBe(true)
    expect(isOppositeDirection('right', 'up')).toBe(false)
  })
})
