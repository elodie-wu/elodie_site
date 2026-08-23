import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react'

const BOARD_SIZE = 20
const TICK_MS = 155
const GRID_CELLS = Array.from({ length: BOARD_SIZE * BOARD_SIZE }, (_, index) => index)
const FOOD_EMOJIS = ['🍓', '🍒', '🍉', '🍋', '🍑', '🍇', '🥝', '🍄', '🌙', '⭐', '💎', '🧁'] as const

type Direction = 'up' | 'down' | 'left' | 'right'
type GameStatus = 'ready' | 'running' | 'paused' | 'game-over'

interface Point {
  readonly x: number
  readonly y: number
}

interface Food extends Point {
  readonly emoji: string
}

interface SavedSnakeSession {
  readonly snake: readonly Point[]
  readonly food: Food
  readonly score: number
  readonly direction: Direction
  readonly status: GameStatus
}

let savedSnakeSession: SavedSnakeSession | null = null

const directionVectors: Record<Direction, Point> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
}

const oppositeDirections: Record<Direction, Direction> = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
}

const keyDirections: Record<string, Direction | undefined> = {
  ArrowUp: 'up',
  w: 'up',
  W: 'up',
  ArrowDown: 'down',
  s: 'down',
  S: 'down',
  ArrowLeft: 'left',
  a: 'left',
  A: 'left',
  ArrowRight: 'right',
  d: 'right',
  D: 'right',
}

function createInitialSnake(): readonly Point[] {
  return [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ]
}

function pointKey(point: Point): string {
  return `${point.x}:${point.y}`
}

function createFood(snake: readonly Point[]): Food {
  const occupied = new Set(snake.map(pointKey))
  const openCells: Point[] = []

  for (let y = 0; y < BOARD_SIZE; y += 1) {
    for (let x = 0; x < BOARD_SIZE; x += 1) {
      if (!occupied.has(`${x}:${y}`)) openCells.push({ x, y })
    }
  }

  const cell = openCells[Math.floor(Math.random() * openCells.length)] ?? { x: 3, y: 3 }
  const emoji = FOOD_EMOJIS[Math.floor(Math.random() * FOOD_EMOJIS.length)] ?? '🍓'
  return { ...cell, emoji }
}

function isSamePoint(first: Point, second: Point): boolean {
  return first.x === second.x && first.y === second.y
}

export function SnakeGame() {
  const restoredSessionRef = useRef(savedSnakeSession)
  const gameRef = useRef<HTMLElement>(null)
  const snakeRef = useRef<readonly Point[]>(
    restoredSessionRef.current?.snake ?? createInitialSnake(),
  )
  const foodRef = useRef<Food>(
    restoredSessionRef.current?.food ?? createFood(snakeRef.current),
  )
  const scoreRef = useRef(restoredSessionRef.current?.score ?? 0)
  const statusRef = useRef<GameStatus>(
    restoredSessionRef.current
      ? restoredSessionRef.current.status === 'running'
        ? 'paused'
        : restoredSessionRef.current.status
      : 'ready',
  )
  const lastMoveDirectionRef = useRef<Direction>(restoredSessionRef.current?.direction ?? 'right')
  const queuedDirectionRef = useRef<Direction>(restoredSessionRef.current?.direction ?? 'right')

  const [snake, setSnake] = useState<readonly Point[]>(snakeRef.current)
  const [food, setFood] = useState<Food>(foodRef.current)
  const [score, setScore] = useState(scoreRef.current)
  const [status, setStatus] = useState<GameStatus>(statusRef.current)
  const [direction, setDirection] = useState<Direction>(queuedDirectionRef.current)

  const updateStatus = useCallback((nextStatus: GameStatus) => {
    statusRef.current = nextStatus
    setStatus(nextStatus)
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
    if (statusRef.current === 'running') {
      updateStatus('paused')
    } else if (statusRef.current === 'paused') {
      updateStatus('running')
    }
  }, [updateStatus])

  const queueDirection = useCallback((nextDirection: Direction) => {
    if (oppositeDirections[lastMoveDirectionRef.current] === nextDirection) return
    queuedDirectionRef.current = nextDirection
    setDirection(nextDirection)
  }, [])

  const moveSnake = useCallback(() => {
    const currentSnake = snakeRef.current
    const nextDirection = queuedDirectionRef.current
    const movement = directionVectors[nextDirection]
    const currentHead = currentSnake[0]
    const nextHead = {
      x: currentHead.x + movement.x,
      y: currentHead.y + movement.y,
    }
    const ateFood = isSamePoint(nextHead, foodRef.current)
    const bodyToCheck = ateFood ? currentSnake : currentSnake.slice(0, -1)
    const hitWall =
      nextHead.x < 0 ||
      nextHead.x >= BOARD_SIZE ||
      nextHead.y < 0 ||
      nextHead.y >= BOARD_SIZE
    const hitSnake = bodyToCheck.some((segment) => isSamePoint(segment, nextHead))

    if (hitWall || hitSnake) {
      updateStatus('game-over')
      return
    }

    lastMoveDirectionRef.current = nextDirection
    const nextSnake = ateFood
      ? [nextHead, ...currentSnake]
      : [nextHead, ...currentSnake.slice(0, -1)]

    snakeRef.current = nextSnake
    setSnake(nextSnake)

    if (ateFood) {
      const nextScore = scoreRef.current + 10
      const nextFood = createFood(nextSnake)
      scoreRef.current = nextScore
      foodRef.current = nextFood
      setScore(nextScore)
      setFood(nextFood)
    }
  }, [updateStatus])

  useEffect(() => {
    if (status !== 'running') return
    const intervalId = window.setInterval(moveSnake, TICK_MS)
    return () => window.clearInterval(intervalId)
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
    const handleVisibilityChange = () => {
      if (document.hidden) pauseGame()
    }
    window.addEventListener('blur', pauseGame)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      window.removeEventListener('blur', pauseGame)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [pauseGame])

  useEffect(() => {
    const gameElement = gameRef.current
    if (!gameElement || !('IntersectionObserver' in window)) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || entry.intersectionRatio < 0.35) pauseGame()
      },
      { threshold: [0, 0.35] },
    )
    observer.observe(gameElement)
    return () => observer.disconnect()
  }, [pauseGame])

  useEffect(() => () => {
    savedSnakeSession = {
      snake: snakeRef.current,
      food: foodRef.current,
      score: scoreRef.current,
      direction: queuedDirectionRef.current,
      status: statusRef.current === 'running' ? 'paused' : statusRef.current,
    }
  }, [])

  const statusLabel = {
    ready: 'Ready',
    running: 'Running',
    paused: 'Paused',
    'game-over': 'Game over',
  }[status]

  return (
    <section ref={gameRef} className="snake-game" aria-labelledby="snake-title">
      <header className="snake-game-header">
        <div>
          <p className="mono-label">Experiment / SK-020</p>
          <h2 id="snake-title">Neon Snake</h2>
        </div>
        <div className="snake-live-status" data-status={status}>
          <i /> {statusLabel}
        </div>
      </header>

      <div className="snake-game-layout">
        <div className="snake-board-frame">
          <div className="snake-board-labels" aria-hidden="true">
            <span>01 / Neon grid</span><span>20 × 20</span>
          </div>
          <div className="snake-board" aria-label="20 by 20 snake game board">
            <div className="snake-grid" aria-hidden="true">
              {GRID_CELLS.map((cell) => <span key={cell} />)}
            </div>

            <div className="snake-piece-layer">
              {snake.map((segment, index) => (
                <div
                  key={`${pointKey(segment)}:${index}`}
                  className={`snake-segment${index === 0 ? ' snake-head' : ''}`}
                  data-direction={index === 0 ? direction : undefined}
                  style={{ gridColumn: segment.x + 1, gridRow: segment.y + 1 } as CSSProperties}
                >
                  {index === 0 && <><i /><i /></>}
                </div>
              ))}
              <div
                className="snake-food"
                style={{ gridColumn: food.x + 1, gridRow: food.y + 1 } as CSSProperties}
                role="img"
                aria-label="Food"
              >
                {food.emoji}
              </div>
            </div>

            {status === 'ready' && (
              <div className="snake-board-overlay">
                <p>Feed the signal. Grow the glow.</p>
                <button className="snake-start-button" type="button" onClick={startGame}>Start</button>
              </div>
            )}

            {status === 'paused' && (
              <div className="snake-board-overlay snake-pause-overlay" aria-live="polite">
                <strong>Paused</strong>
                <span>Press Space to continue</span>
              </div>
            )}

            {status === 'game-over' && (
              <div className="snake-board-overlay snake-game-over-overlay" aria-live="polite">
                <strong>Game over</strong>
                <span>Final score / {score}</span>
                <button className="snake-start-button" type="button" onClick={startGame}>Restart</button>
              </div>
            )}
          </div>
        </div>

        <aside className="snake-console" aria-label="Score and game instructions">
          <div className="snake-score-card">
            <span>Score</span>
            <strong>{String(score).padStart(4, '0')}</strong>
            <small>+10 per emoji</small>
          </div>

          <div className="snake-console-card">
            <span>Movement</span>
            <div className="snake-key-row" aria-label="W A S D and arrow keys">
              <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd>
            </div>
            <p>Use WASD or the arrow keys to steer.</p>
          </div>

          <div className="snake-console-card">
            <span>Pause protocol</span>
            <div className="snake-space-key">Space</div>
            <p>Space pauses or resumes. Leaving this page pauses the current run.</p>
          </div>

          <div className="snake-console-card snake-objective-card">
            <span>Objective</span>
            <ol>
              <li>Collect the random emoji food.</li>
              <li>Each snack grows the pink snake.</li>
              <li>Avoid the walls and your own trail.</li>
            </ol>
          </div>
        </aside>
      </div>
    </section>
  )
}
