import { PageIntro } from '../../components/ui/PageIntro'
import './architecture.css'

const decisions = [
  ['Static first', 'The portfolio ships as files on GitHub Pages. There is no server runtime in V1.'],
  ['Rules stay pure', 'Snake rules live in features/snake/engine.ts, independent from React and browser APIs.'],
  ['Features stay local', 'Pages compose reusable components. Hooks connect pure rules to browser events.'],
]

export function ArchitecturePage() {
  return (
    <div className="page-shell inner-page">
      <PageIntro
        index="06"
        label="System map"
        title="Simple on"
        accent="purpose."
        description="V1 uses the smallest architecture that serves the experience today, with clear seams for the ideas that may arrive later."
      />

      <section className="system-map" aria-label="V1 static site architecture">
        <div className="system-node node-wide"><span>Delivery</span><strong>GitHub Pages</strong><small>Static assets</small></div>
        <div className="system-flow" aria-hidden="true"><i /></div>
        <div className="system-tier">
          <div className="system-node"><span>Interface</span><strong>React</strong><small>Pages + components</small></div>
          <div className="system-node"><span>Navigation</span><strong>Hash routing</strong><small>Static-safe URLs</small></div>
          <div className="system-node"><span>Style</span><strong>Plain CSS</strong><small>Tokens + local styles</small></div>
        </div>
        <div className="system-flow" aria-hidden="true"><i /></div>
        <div className="system-tier future-tier">
          <div className="system-node"><span>Game engine</span><strong>features/snake</strong><small>Rules + controller + view</small></div>
          <div className="system-node"><span>Shared tools</span><strong>shared/lib</strong><small>Public asset resolution</small></div>
        </div>
        <p className="system-caption">Everything above runs in the browser. No backend connection exists in V1.</p>
      </section>

      <section className="decision-grid" aria-label="Architecture decisions">
        {decisions.map(([title, text], index) => (
          <article key={title}><span>ADR-00{index + 1}</span><h2>{title}</h2><p>{text}</p></article>
        ))}
      </section>
    </div>
  )
}
