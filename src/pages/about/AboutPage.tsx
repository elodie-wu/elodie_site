import { ScenePage } from '../../components/scene/ScenePage'
import { ExternalLink } from '../../components/ui/ExternalLink'
import { siteConfig } from '../../config/site'
import { learning, profile, projects, tech } from './about.data'
import './about.css'

export function AboutPage() {
  return (
    <ScenePage
      className="about-scene-page"
      label="About"
      labelledBy="about-title"
      background={siteConfig.backgrounds.about}
    >
      <article className="about-glass-panel">
        <header className="about-intro">
          <p className="about-kicker">ABOUT / ELODIE WU</p>
          <h1 id="about-title">{profile.greeting} <span aria-hidden="true">👋</span></h1>
          <p className="about-role">{profile.role}</p>
          <p className="about-lead">{profile.description}</p>
          <div className="about-socials" aria-label="Social links">
            {siteConfig.socialLinks.map((link) => (
              <ExternalLink key={link.label} href={link.href}>
                {link.label} <span aria-hidden="true">↗</span>
              </ExternalLink>
            ))}
          </div>
        </header>

        <div className="about-content-grid">
          <section className="about-block about-me-block" aria-labelledby="about-me-title">
            <p className="about-section-number">01</p>
            <h2 id="about-me-title">About me</h2>
            <ul className="about-facts">
              {profile.facts.map((fact) => (
                <li key={fact.text}><span aria-hidden="true">{fact.icon}</span> {fact.text}</li>
              ))}
            </ul>
          </section>

          <section className="about-block about-projects-block" aria-labelledby="projects-title">
            <p className="about-section-number">02</p>
            <h2 id="projects-title">Things I&apos;ve been building</h2>
            <div className="about-project-list">
              {projects.map((project) => (
                <article className="about-project" key={project.title}>
                  <div className="about-project-heading">
                    <span aria-hidden="true">{project.icon}</span>
                    <h3>{project.title}</h3>
                  </div>
                  <p>{project.description}</p>
                  <ExternalLink href={project.href}>
                    {project.linkLabel} <span aria-hidden="true">↗</span>
                  </ExternalLink>
                </article>
              ))}
            </div>
          </section>

          <section className="about-block about-tech-block" aria-labelledby="tech-title">
            <p className="about-section-number">03</p>
            <h2 id="tech-title">Tech I use</h2>
            <div className="about-tags">
              {tech.map((item) => <span key={item}>{item}</span>)}
            </div>
          </section>

          <section className="about-block about-learning-block" aria-labelledby="learning-title">
            <p className="about-section-number">04</p>
            <h2 id="learning-title">Currently learning</h2>
            <div className="about-learning-list">
              {learning.map((item) => <span key={item}>{item}</span>)}
            </div>
          </section>
        </div>
      </article>
    </ScenePage>
  )
}
