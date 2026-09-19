import './home-effects.css'

/** Decorative layers are separate from the homepage's readable content. */
export function HeroEffects() {
  return (
    <div className="landing-home-scene" aria-hidden="true">
      <div className="landing-scene-frame">
        <div className="landing-home-background" />
        <div className="landing-home-haze" />
        <div className="landing-home-fireflies">
          {Array.from({ length: 12 }, (_, index) => <i key={index} />)}
        </div>
      </div>
    </div>
  )
}
