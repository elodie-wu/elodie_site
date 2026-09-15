import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { siteConfig } from '../../config/site'
import { assetUrl } from '../../shared/lib/assetUrl'
import { HeroEffects } from './HeroEffects'
import './home.css'

export function HomePage() {
  return (
    <section
      className="landing-home"
      aria-labelledby="home-title"
      style={{ '--landing-background': `url("${assetUrl(siteConfig.backgrounds.home)}")` } as CSSProperties}
    >
      <HeroEffects />
      <div className="landing-home-shade" aria-hidden="true" />
      <div className="landing-home-content">
        <h1 id="home-title" className="landing-home-title">
          ELODIE WU
        </h1>
        <p className="landing-home-role">SOFTWARE ENGINEER</p>
        <p className="landing-home-tagline">
          Building systems, stories and
          <br />
          strange little worlds.
        </p>
        <Link className="landing-home-enter" to="/play">
          ENTER THE TAVERN
        </Link>
        <Link
          className="landing-home-scroll"
          to="/work"
          aria-label="Scroll to explore Work"
        >
          <span aria-hidden="true">↓</span> Scroll to explore
        </Link>
      </div>
    </section>
  )
}
