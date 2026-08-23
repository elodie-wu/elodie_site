import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { BOARD_COLUMNS, BOARD_ROWS } from '../../game/constants'
import {
  createInitialGame,
  getTopMovableBlockIds,
  moveBlock,
} from '../../game/engine'
import type { Block, GameState, MoveFailureReason } from '../../game/types'
import { createBrowserBestScoreService } from '../../services/bestScore'
import { getSnappedCell } from './drag'

const GRID_CELLS = Array.from({ length: BOARD_COLUMNS * BOARD_ROWS }, (_, index) => index)
const DRAG_THRESHOLD = 4

interface DragState {
  readonly blockId: string
  readonly pointerId: number
  readonly startX: number
  readonly startY: number
  readonly grabOffsetX: number
  readonly grabOffsetY: number
  readonly deltaX: number
}

const failureMessages: Record<MoveFailureReason, string> = {
  'game-over': 'The run is over. Restart to open a new board.',
  'block-not-found': 'That block is no longer on the board.',
  'block-not-top-movable': 'Another block is holding that piece down.',
  'target-out-of-bounds': 'Drop rejected: the whole block must stay inside the grid.',
  'target-row-blocked': 'Move rejected: another block occupies the horizontal path.',
  'no-legal-drop-position': 'Drop rejected: that column has no legal entry position.',
}

const BLOCK_HUES = [190, 275, 320, 32, 150] as const

function blockHue(block: Block): number {
  const colorIndex = [...block.id]
    .reduce((value, character) => value + character.charCodeAt(0) * 7, 0) % BLOCK_HUES.length
  return BLOCK_HUES[colorIndex]
}

export function ShellStackGame() {
  const boardRef = useRef<HTMLDivElement>(null)
  const clearGlowTimeoutRef = useRef<number | null>(null)
  const bestScoreService = useMemo(() => createBrowserBestScoreService(), [])
  const [storedBestScore, setStoredBestScore] = useState(() => bestScoreService.load())
  const [game, setGame] = useState<GameState>(() => createInitialGame(undefined, storedBestScore))
  const [drag, setDrag] = useState<DragState | null>(null)
  const [rejectedBlockId, setRejectedBlockId] = useState<string | null>(null)
  const [clearedRowGlows, setClearedRowGlows] = useState<readonly number[]>([])
  const [message, setMessage] = useState('Drag any glowing top block left or right.')

  const movableBlockIds = useMemo(
    () => new Set(getTopMovableBlockIds(game.blocks)),
    [game],
  )

  useEffect(() => {
    if (!rejectedBlockId) return
    const timeoutId = window.setTimeout(() => setRejectedBlockId(null), 360)
    return () => window.clearTimeout(timeoutId)
  }, [rejectedBlockId])

  useEffect(() => () => {
    if (clearGlowTimeoutRef.current !== null) {
      window.clearTimeout(clearGlowTimeoutRef.current)
    }
  }, [])

  const showClearedRowGlow = (rows: readonly number[]) => {
    if (rows.length === 0) return
    if (clearGlowTimeoutRef.current !== null) {
      window.clearTimeout(clearGlowTimeoutRef.current)
    }
    setClearedRowGlows(rows)
    clearGlowTimeoutRef.current = window.setTimeout(() => {
      setClearedRowGlows([])
      clearGlowTimeoutRef.current = null
    }, 3_000)
  }

  const restartRun = () => {
    const bestScore = bestScoreService.load()
    setStoredBestScore(bestScore)
    setGame(createInitialGame(undefined, bestScore))
    setDrag(null)
    setRejectedBlockId(null)
    setClearedRowGlows([])
    if (clearGlowTimeoutRef.current !== null) {
      window.clearTimeout(clearGlowTimeoutRef.current)
      clearGlowTimeoutRef.current = null
    }
    setMessage('Board rebuilt with three rows. The stack is live again.')
  }

  const handlePointerDown = (event: ReactPointerEvent<HTMLButtonElement>, block: Block) => {
    if (game.status !== 'playing' || !movableBlockIds.has(block.id)) return
    if (event.button !== 0) return

    const blockRectangle = event.currentTarget.getBoundingClientRect()
    event.currentTarget.setPointerCapture(event.pointerId)
    event.preventDefault()

    setDrag({
      blockId: block.id,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      grabOffsetX: event.clientX - blockRectangle.left,
      grabOffsetY: event.clientY - blockRectangle.top,
      deltaX: 0,
    })
    setMessage('Move left or right, then release to let gravity place the block.')
  }

  const handlePointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    setDrag((current) => {
      if (!current || current.pointerId !== event.pointerId) return current
      return {
        ...current,
        deltaX: event.clientX - current.startX,
      }
    })
  }

  const finishDrag = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!drag || drag.pointerId !== event.pointerId || !boardRef.current) return

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }

    const travelled = Math.abs(event.clientX - drag.startX)
    if (travelled < DRAG_THRESHOLD) {
      setDrag(null)
      setMessage('Drag a glowing block to move it.')
      return
    }

    const boardRectangle = boardRef.current.getBoundingClientRect()
    const target = getSnappedCell(
      event.clientX,
      event.clientY,
      drag.grabOffsetX,
      drag.grabOffsetY,
      boardRectangle,
    )
    const result = moveBlock(game, {
      blockId: drag.blockId,
      targetX: target.column,
    })

    setDrag(null)

    if (!result.ok) {
      setRejectedBlockId(drag.blockId)
      setMessage(failureMessages[result.reason])
      return
    }

    const persistedBestScore = bestScoreService.save(result.state.bestScore)
    const nextGame =
      persistedBestScore === result.state.bestScore
        ? result.state
        : { ...result.state, bestScore: persistedBestScore }
    const clearedRowCount = nextGame.lastTurn?.clearedRows.length ?? 0
    showClearedRowGlow(nextGame.lastTurn?.clearedRows ?? [])

    setStoredBestScore(persistedBestScore)
    setGame(nextGame)
    setMessage(
      nextGame.status === 'game-over'
        ? 'Signal lost: a block crossed the ninth row.'
        : clearedRowCount > 0
          ? `${clearedRowCount} row${clearedRowCount === 1 ? '' : 's'} cleared. +${clearedRowCount * 100}.`
          : 'Move accepted. A new bottom row has entered the board.',
    )
  }

  const cancelDrag = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!drag || drag.pointerId !== event.pointerId) return
    setDrag(null)
    setRejectedBlockId(drag.blockId)
    setMessage('Move cancelled. The block returned to its original cells.')
  }

  const status = game.status === 'game-over' ? 'Game over' : 'Running'
  const visibleBestScore = game.bestScore ?? storedBestScore

  return (
    <section className="shell-game" aria-labelledby="shell-stack-title">
      <header className="shell-game-header">
        <div>
          <p className="mono-label">Experiment / SS-001</p>
          <h2 id="shell-stack-title">Shell Stack</h2>
        </div>
        <div className="shell-game-controls">
          <button
            className="shell-control shell-control-primary"
            type="button"
            onClick={restartRun}
          >
            Restart
          </button>
        </div>
      </header>

      <div className="shell-game-layout">
        <div className="shell-board-frame">
          <div className="shell-board-labels" aria-hidden="true">
            <span>01 / Stack chamber</span><span>9 × 9</span>
          </div>
          <div
            ref={boardRef}
            className={`shell-board${drag ? ' shell-board-dragging' : ''}`}
            aria-label="Shell Stack 9 by 9 game board"
          >
            <div className="shell-board-cells" aria-hidden="true">
              {GRID_CELLS.map((cell) => <span key={cell} />)}
            </div>

            {clearedRowGlows.map((row) => (
              <div
                key={row}
                className="shell-cleared-row-glow"
                style={{ '--cleared-row': row } as CSSProperties}
                aria-hidden="true"
              />
            ))}

            {game.blocks.map((block) => {
              const isMovable = movableBlockIds.has(block.id) && game.status === 'playing'
              const isDragging = drag?.blockId === block.id
              const isRejected = rejectedBlockId === block.id
              const style = {
                '--block-row': block.row,
                '--block-column': block.column,
                '--block-width': block.width,
                '--block-hue': blockHue(block),
                transform: isDragging
                  ? `translate3d(${drag.deltaX}px, 0, 0)`
                  : undefined,
              } as CSSProperties

              return (
                <button
                  key={block.id}
                  type="button"
                  className={[
                    'shell-game-block',
                    isMovable ? 'shell-game-block-movable' : 'shell-game-block-locked',
                    isDragging ? 'shell-game-block-dragging' : '',
                    isRejected ? 'shell-game-block-rejected' : '',
                  ].filter(Boolean).join(' ')}
                  style={style}
                  disabled={!isMovable}
                  aria-label={`${isMovable ? 'Movable' : 'Locked'} block, width ${block.width}, row ${block.row + 1}, column ${block.column + 1}`}
                  onPointerDown={(event) => handlePointerDown(event, block)}
                  onPointerMove={handlePointerMove}
                  onPointerUp={finishDrag}
                  onPointerCancel={cancelDrag}
                >
                  <span className="shell-game-block-core"><i /><b>{block.width}</b></span>
                </button>
              )
            })}

            {game.status === 'game-over' && (
              <div className="shell-board-overlay shell-board-game-over">
                <span>Stack breach detected</span>
                <strong>Game over</strong>
                <button type="button" onClick={restartRun}>Restart run</button>
              </div>
            )}
          </div>
        </div>

        <aside className="shell-console" aria-label="Game information">
          <div className="shell-console-status" data-status={status.toLowerCase().replace(' ', '-')}>
            <span>System status</span>
            <strong><i /> {status}</strong>
          </div>

          <dl className="shell-stats">
            <div><dt>Score</dt><dd>{game.score}</dd></div>
            <div><dt>Best</dt><dd>{visibleBestScore}</dd></div>
            <div><dt>Turn</dt><dd>{game.turn}</dd></div>
            <div><dt>Movable</dt><dd>{game.status === 'playing' ? movableBlockIds.size : 0}</dd></div>
          </dl>

          <div className="shell-message" aria-live="polite">
            <span>Console</span>
            <p>{message}</p>
          </div>

          <div className="shell-rules">
            <span>Quick protocol</span>
            <ol>
              <li>Drag only a clear top block left or right.</li>
              <li>Release it; gravity finds the lowest legal row.</li>
              <li>Clear a full row for 100 points.</li>
            </ol>
          </div>
        </aside>
      </div>
    </section>
  )
}
