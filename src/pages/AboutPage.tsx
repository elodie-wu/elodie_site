import type { CSSProperties } from 'react'

const projects = [
  {
    icon: '🐟',
    title: 'AI Aquaculture Research Demos',
    description:
      'Water-quality anomaly detection, salmon health classification with CNN + Grad-CAM, and sea turtle detection with YOLO.',
    href: 'https://github.com/elodie-wu/ai-aquaculture-research-demos',
    linkLabel: 'View repository',
  },
  {
    icon: '🌐',
    title: 'Personal Website',
    description:
      'A React + .NET portfolio website with backend and admin features — the little corner of the internet you are visiting now.',
    href: 'https://www.elodiewu.com',
    linkLabel: 'View website',
  },
  {
    icon: '📈',
    title: 'Stock Prediction & RL Trading',
    description:
      'Exploring stock-price prediction with supervised learning and a simple Q-learning trading agent.',
    href: 'https://github.com/elodie-wu/ai-stock-price-prediction',
    linkLabel: 'View repository',
  },
]

const tech = [
  'C#',
  '.NET',
  'ASP.NET Core',
  'PostgreSQL',
  'RabbitMQ',
  'Python',
  'PyTorch',
  'Scikit-learn',
  'YOLO',
  'Docker',
  'React',
  'Azure',
]

const learning = [
  'Computer Vision',
  'Deep Learning',
  'Evolutionary Computation',
  'React',
  'Azure',
]

export function AboutPage() {
  const assetBase = `${window.location.pathname}assets/pages/`

  return (
    <section
      className="scene-page about-scene-page"
      aria-labelledby="about-title"
      style={{ '--scene-background': `url("${assetBase}about-bg-v2.png")` } as CSSProperties}
    >
      <article className="about-glass-panel">
        <header className="about-intro">
          <p className="about-kicker">ABOUT / ELODIE WU</p>
          <h1 id="about-title">Hi, I&apos;m Di <span aria-hidden="true">👋</span></h1>
          <p className="about-role">
            .NET backend developer who somehow wandered into AI.
          </p>
          <p className="about-lead">
            I&apos;m studying Computer Science in Wellington and building things with
            Python, PyTorch, YOLO, React, and cloud technologies.
          </p>
          <div className="about-socials" aria-label="Social links">
            <a href="https://github.com/elodie-wu" target="_blank" rel="noreferrer">
              GitHub <span aria-hidden="true">↗</span>
            </a>
            <a
              href="https://www.linkedin.com/in/elodie-wu"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn <span aria-hidden="true">↗</span>
            </a>
          </div>
        </header>

        <div className="about-content-grid">
          <section className="about-block about-me-block" aria-labelledby="about-me-title">
            <p className="about-section-number">01</p>
            <h2 id="about-me-title">About me</h2>
            <ul className="about-facts">
              <li><span aria-hidden="true">💻</span> Mostly backend / full-stack</li>
              <li><span aria-hidden="true">🤖</span> Deep into AI, ML, and computer vision</li>
              <li><span aria-hidden="true">🐟</span> Building aquaculture and fisheries AI demos</li>
              <li><span aria-hidden="true">☁️</span> Learning Azure and cloud deployment</li>
              <li><span aria-hidden="true">🎮</span> Occasionally distracted by Apex</li>
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
                  <a href={project.href} target="_blank" rel="noreferrer">
                    {project.linkLabel} <span aria-hidden="true">↗</span>
                  </a>
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
    </section>
  )
}
