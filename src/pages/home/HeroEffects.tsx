import './home-effects.css'

/** Decorative layers are separate from the homepage's readable content. */
export function HeroEffects() {
  return (
    <div className="landing-home-scene" aria-hidden="true">
      <div className="landing-scene-frame">
        <div className="landing-home-background" />
        <div className="landing-rain" />
        <div className="landing-sign-glow landing-sign-after-midnight" />
        <div className="landing-sign-glow landing-sign-last-drop" />
        <div className="landing-lamp-glow" />
        <div className="landing-city-lights">
          {Array.from({ length: 12 }, (_, index) => <i key={index} />)}
        </div>
        <div className="landing-bar-fog"><i /><i /><i /></div>
        <div className="landing-cocktail-glow" />
      </div>
    </div>
  )
}
