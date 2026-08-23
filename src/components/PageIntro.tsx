interface PageIntroProps {
  index: string
  label: string
  title: string
  accent: string
  description: string
}

export function PageIntro({ index, label, title, accent, description }: PageIntroProps) {
  return (
    <header className="page-intro">
      <div className="eyebrow"><span>{index}</span> {label}</div>
      <div className="page-intro-grid">
        <h1>{title}<br /><span>{accent}</span></h1>
        <p>{description}</p>
      </div>
    </header>
  )
}
