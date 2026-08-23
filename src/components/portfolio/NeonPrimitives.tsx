import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Accent = 'cyan' | 'magenta' | 'amber' | 'violet'

interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly accent?: Accent
  readonly children: ReactNode
}

export function NeonButton({ accent = 'cyan', className = '', children, ...props }: NeonButtonProps) {
  return (
    <button className={`neon-button neon-button-${accent} ${className}`.trim()} type="button" {...props}>
      <span>{children}</span><b aria-hidden="true">↗</b>
    </button>
  )
}

interface NeonPanelProps {
  readonly children: ReactNode
  readonly className?: string
  readonly accent?: Accent
}

export function NeonPanel({ children, className = '', accent = 'cyan' }: NeonPanelProps) {
  return <div className={`neon-panel neon-panel-${accent} ${className}`.trim()}>{children}</div>
}

interface TechStackCardProps {
  readonly label: string
  readonly detail: string
  readonly accent?: Accent
}

export function TechStackCard({ label, detail, accent = 'cyan' }: TechStackCardProps) {
  return (
    <article className={`tech-stack-card tech-stack-card-${accent}`}>
      <span aria-hidden="true" /><h3>{label}</h3><p>{detail}</p>
    </article>
  )
}

interface ProjectCardProps {
  readonly code: string
  readonly title: string
  readonly description: string
  readonly tags: readonly string[]
  readonly featured?: boolean
  readonly accent?: Accent
}

export function ProjectCard({ code, title, description, tags, featured = false, accent = 'cyan' }: ProjectCardProps) {
  return (
    <article className={`portfolio-project portfolio-project-${accent}${featured ? ' portfolio-project-featured' : ''}`}>
      <div className="portfolio-project-topline"><span>{code}</span><span>{featured ? 'Featured build' : 'Project file'}</span></div>
      <h3>{title}</h3><p>{description}</p>
      <ul aria-label={`${title} technologies`}>{tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
    </article>
  )
}
