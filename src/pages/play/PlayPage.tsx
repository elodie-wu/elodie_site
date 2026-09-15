import { ScenePage } from '../../components/scene/ScenePage'
import { siteConfig } from '../../config/site'
import { SnakeGame } from '../../features/snake/SnakeGame'
import './play.css'

export function PlayPage() {
  return (
    <ScenePage
      className="play-scene-page"
      label="Play"
      background={siteConfig.backgrounds.play}
    >
      <div className="play-game-panel">
        <SnakeGame />
      </div>
    </ScenePage>
  )
}
