import './home-effects.css'

/** Decorative layers are separate from the homepage's readable content. */
export function HeroEffects() {
  return (
    <div className="landing-home-scene" aria-hidden="true">
      <div className="landing-scene-frame">
        <div className="landing-home-background" />
        <div className="landing-home-haze" />
        <div className="landing-home-stars">
          {Array.from({ length: 24 }, (_, index) => <i key={index} />)}
        </div>
        <div className="landing-home-meteors">
          <i />
          <i />
        </div>
        <div className="landing-home-fireflies">
          {Array.from({ length: 14 }, (_, index) => <i key={index} />)}
        </div>
      </div>
    </div>
  )
}
