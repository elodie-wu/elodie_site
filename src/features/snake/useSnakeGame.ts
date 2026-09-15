import { useCallback, useEffect, useRef, useState } from 'react'
import { TICK_MS, keyDirections } from './constants'
import { advanceSnake, createFood, createInitialSnake, isOppositeDirection } from './engine'
import { loadSnakeSession, saveSnakeSession } from './session'
import type { Direction, Food, GameStatus, Point } from './types'

/** React controller: state, timers, keyboard, automatic pause, and session restoration. */
export function useSnakeGame() {
  const restoredSessionRef = useRef(loadSnakeSession())
  const gameRef = useRef<HTMLElement>(null)
  const snakeRef = useRef<readonly Point[]>(restoredSessionRef.current?.snake ?? createInitialSnake())
  const foodRef = useRef<Food>(restoredSessionRef.current?.food ?? createFood(snakeRef.current))
  const scoreRef = useRef(restoredSessionRef.current?.score ?? 0)
  const statusRef = useRef<GameStatus>(
    restoredSessionRef.current
      ? restoredSessionRef.current.status === 'running' ? 'paused' : restoredSessionRef.current.status
      : 'ready',
  )
  const lastMoveDirectionRef = useRef<Direction>(restoredSessionRef.current?.direction ?? 'right')
  const queuedDirectionRef = useRef<Direction>(restoredSessionRef.current?.direction ?? 'right')
  const [snake, setSnake] = useState(snakeRef.current)
  const [food, setFood] = useState(foodRef.current)
  const [score, setScore] = useState(scoreRef.current)
  const [status, setStatus] = useState(statusRef.current)
  const [direction, setDirection] = useState(queuedDirectionRef.current)

  const updateStatus = useCallback((next: GameStatus) => {
    statusRef.current = next
    setStatus(next)
  }, [])
  const pauseGame = useCallback(() => {
    if (statusRef.current === 'running') updateStatus('paused')
  }, [updateStatus])
  const startGame = useCallback(() => {
    const nextSnake = createInitialSnake()
    const nextFood = createFood(nextSnake)
    snakeRef.current = nextSnake
    foodRef.current = nextFood
    scoreRef.current = 0
    lastMoveDirectionRef.current = 'right'
    queuedDirectionRef.current = 'right'
    setSnake(nextSnake)
    setFood(nextFood)
    setScore(0)
    setDirection('right')
    updateStatus('running')
  }, [updateStatus])
  const togglePause = useCallback(() => {
    if (statusRef.current === 'running') updateStatus('paused')
    else if (statusRef.current === 'paused') updateStatus('running')
  }, [updateStatus])
  const queueDirection = useCallback((next: Direction) => {
    if (isOppositeDirection(lastMoveDirectionRef.current, next)) return
    queuedDirectionRef.current = next
    setDirection(next)
  }, [])
  const moveSnake = useCallback(() => {
    const move = advanceSnake(snakeRef.current, foodRef.current, queuedDirectionRef.current)
    if (!move) { updateStatus('game-over'); return }
    if (move.direction !== queuedDirectionRef.current) {
      queuedDirectionRef.current = move.direction
      setDirection(move.direction)
    }
    lastMoveDirectionRef.current = move.direction
    snakeRef.current = move.snake
    setSnake(move.snake)
    if (move.ateFood) {
      scoreRef.current += 10
      foodRef.current = createFood(move.snake)
      setScore(scoreRef.current)
      setFood(foodRef.current)
    }
  }, [updateStatus])

  useEffect(() => {
    if (status !== 'running') return
    const interval = window.setInterval(moveSnake, TICK_MS)
    return () => window.clearInterval(interval)
  }, [moveSnake, status])
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        if (statusRef.current === 'running' || statusRef.current === 'paused') {
          event.preventDefault()
          togglePause()
        }
        return
      }
      const nextDirection = keyDirections[event.key]
      if (!nextDirection || statusRef.current !== 'running') return
      event.preventDefault()
      queueDirection(nextDirection)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [queueDirection, togglePause])
  useEffect(() => {
    const onVisibilityChange = () => { if (document.hidden) pauseGame() }
    window.addEventListener('blur', pauseGame)
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => {
      window.removeEventListener('blur', pauseGame)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [pauseGame])
  useEffect(() => {
    const element = gameRef.current
    if (!element || !('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || entry.intersectionRatio < 0.35) pauseGame()
    }, { threshold: [0, 0.35] })
    observer.observe(element)
    return () => observer.disconnect()
  }, [pauseGame])
  useEffect(() => () => {
    saveSnakeSession({
      snake: snakeRef.current, food: foodRef.current, score: scoreRef.current,
      direction: queuedDirectionRef.current,
      status: statusRef.current === 'running' ? 'paused' : statusRef.current,
    })
  }, [])

  return { gameRef, snake, food, score, status, direction, startGame }
}
