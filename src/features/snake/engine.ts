import { BOARD_SIZE, FOOD_EMOJIS } from './constants'
import type { Direction, Food, Point, SnakeMove } from './types'

const directionVectors: Record<Direction, Point> = {
  up: { x: 0, y: -1 }, down: { x: 0, y: 1 },
  left: { x: -1, y: 0 }, right: { x: 1, y: 0 },
}
const oppositeDirections: Record<Direction, Direction> = {
  up: 'down', down: 'up', left: 'right', right: 'left',
}
const clockwiseTurns: Record<Direction, Direction> = {
  up: 'right', right: 'down', down: 'left', left: 'up',
}
const counterClockwiseTurns: Record<Direction, Direction> = {
  up: 'left', left: 'down', down: 'right', right: 'up',
}

export function createInitialSnake(): readonly Point[] {
  return [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }]
}
export function pointKey(point: Point): string { return `${point.x}:${point.y}` }
export function isSamePoint(a: Point, b: Point): boolean { return a.x === b.x && a.y === b.y }
export function isOppositeDirection(a: Direction, b: Direction): boolean { return oppositeDirections[a] === b }

/** Inject random for reproducible tests; gameplay uses Math.random. */
export function createFood(snake: readonly Point[], random = Math.random): Food {
  const occupied = new Set(snake.map(pointKey))
  const openCells: Point[] = []
  for (let y = 0; y < BOARD_SIZE; y += 1) {
    for (let x = 0; x < BOARD_SIZE; x += 1) {
      if (!occupied.has(`${x}:${y}`)) openCells.push({ x, y })
    }
  }
  const cell = openCells[Math.floor(random() * openCells.length)] ?? { x: 3, y: 3 }
  const emoji = FOOD_EMOJIS[Math.floor(random() * FOOD_EMOJIS.length)] ?? '🍓'
  return { ...cell, emoji }
}
function movePoint(point: Point, direction: Direction): Point {
  const vector = directionVectors[direction]
  return { x: point.x + vector.x, y: point.y + vector.y }
}
function isOutsideBoard(point: Point): boolean {
  return point.x < 0 || point.x >= BOARD_SIZE || point.y < 0 || point.y >= BOARD_SIZE
}

/** One pure game tick. null means collision; no React or browser APIs here. */
export function advanceSnake(snake: readonly Point[], food: Food, direction: Direction): SnakeMove | null {
  const head = snake[0]
  if (!head) return null
  let nextDirection = direction
  let nextHead = movePoint(head, direction)

  if (isOutsideBoard(nextHead)) {
    const safeTurn = [clockwiseTurns[direction], counterClockwiseTurns[direction]].find((turn) => {
      const candidate = movePoint(head, turn)
      if (isOutsideBoard(candidate)) return false
      const body = isSamePoint(candidate, food) ? snake : snake.slice(0, -1)
      return !body.some((segment) => isSamePoint(segment, candidate))
    })
    if (!safeTurn) return null
    nextDirection = safeTurn
    nextHead = movePoint(head, safeTurn)
  }

  const ateFood = isSamePoint(nextHead, food)
  const body = ateFood ? snake : snake.slice(0, -1)
  if (body.some((segment) => isSamePoint(segment, nextHead))) return null
  return {
    snake: ateFood ? [nextHead, ...snake] : [nextHead, ...snake.slice(0, -1)],
    direction: nextDirection,
    ateFood,
  }
}
