import type { CSSProperties } from 'react'
import { BOARD_SIZE } from './constants'
import { pointKey } from './engine'
import { useSnakeGame } from './useSnakeGame'
import './snake.css'

const GRID_CELLS = Array.from({ length: BOARD_SIZE * BOARD_SIZE }, (_, index) => index)

export function SnakeGame() {
  const {
    gameRef,
    snake,
    food,
    score,
    status,
    direction,
    startGame,
    queueDirection,
    togglePause,
  } = useSnakeGame()

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
                <span>Press Space or tap Resume below</span>
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
            <div className="snake-key-row" aria-label="Touch direction controls">
              <button
                className="snake-control-key snake-control-up"
                type="button"
                aria-label="Move up"
                data-active={direction === 'up' ? 'true' : undefined}
                disabled={status !== 'running'}
                onClick={() => queueDirection('up')}
              >
                W
              </button>
              <button
                className="snake-control-key snake-control-left"
                type="button"
                aria-label="Move left"
                data-active={direction === 'left' ? 'true' : undefined}
                disabled={status !== 'running'}
                onClick={() => queueDirection('left')}
              >
                A
              </button>
              <button
                className="snake-control-key snake-control-down"
                type="button"
                aria-label="Move down"
                data-active={direction === 'down' ? 'true' : undefined}
                disabled={status !== 'running'}
                onClick={() => queueDirection('down')}
              >
                S
              </button>
              <button
                className="snake-control-key snake-control-right"
                type="button"
                aria-label="Move right"
                data-active={direction === 'right' ? 'true' : undefined}
                disabled={status !== 'running'}
                onClick={() => queueDirection('right')}
              >
                D
              </button>
            </div>
            <p>Tap the controls or use WASD / arrow keys to steer.</p>
          </div>

          <div className="snake-console-card">
            <span>Pause protocol</span>
            <button
              className="snake-space-key"
              type="button"
              disabled={status === 'ready' || status === 'game-over'}
              onClick={togglePause}
            >
              {status === 'paused' ? 'Resume' : 'Space / Pause'}
            </button>
            <p>Tap the button or press Space. Leaving this page pauses the current run.</p>
          </div>

          <div className="snake-console-card snake-objective-card">
            <span>Objective</span>
            <ol>
              <li>Collect the random emoji food.</li>
              <li>Each snack grows the signal trail.</li>
              <li>Walls turn the snake; avoid your own trail.</li>
            </ol>
          </div>
        </aside>
      </div>
    </section>
  )
}
