import type { CSSProperties } from "react";
import { Link } from "react-router-dom";

export function HomePage() {
  const assetBase = `${window.location.pathname}assets/home/`;

  return (
    <section
      className="landing-home"
      aria-labelledby="home-title"
      style={
        {
          "--landing-background": `url("${assetBase}home-bg.png")`,
        } as CSSProperties
      }
    >
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
  );
}
