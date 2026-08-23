import type { CSSProperties } from 'react'
import { SnakeGame } from '../features/snake/SnakeGame'

export function PlayPage() {
  const assetBase = `${window.location.pathname}assets/pages/`

  return (
    <section
      className="scene-page play-scene-page"
      aria-label="Play"
      style={{ '--scene-background': `url("${assetBase}play-bg.png")` } as CSSProperties}
    >
      <div className="play-game-panel">
        <SnakeGame />
      </div>
    </section>
  )
}
