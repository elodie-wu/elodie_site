import type { CSSProperties } from 'react'
import { ShellStackGame } from '../features/shell-stack/ShellStackGame'

export function PlayPage() {
  const assetBase = `${import.meta.env.BASE_URL}assets/pages/`

  return (
    <section
      className="scene-page play-scene-page"
      aria-label="Play"
      style={{ '--scene-background': `url("${assetBase}play-bg.png")` } as CSSProperties}
    >
      <div className="play-game-panel">
        <ShellStackGame />
      </div>
    </section>
  )
}
