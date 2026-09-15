import type { CSSProperties, ReactNode } from 'react'
import { assetUrl } from '../../shared/lib/assetUrl'
import './scene-page.css'

interface ScenePageProps {
  readonly background: string
  readonly label: string
  readonly labelledBy?: string
  readonly bottomFade?: boolean
  readonly className?: string
  readonly children: ReactNode
}

/** Full-screen image scene; content belongs to the consuming page. */
export function ScenePage({
  background, label, labelledBy, bottomFade = false, className = '', children,
}: ScenePageProps) {
  return (
    <section
      className={['scene-page', bottomFade ? 'scene-page-bottom-fade' : '', className].filter(Boolean).join(' ')}
      aria-label={labelledBy ? undefined : label}
      aria-labelledby={labelledBy}
      style={{ '--scene-background': `url("${assetUrl(background)}")` } as CSSProperties}
    >
      {children}
    </section>
  )
}
