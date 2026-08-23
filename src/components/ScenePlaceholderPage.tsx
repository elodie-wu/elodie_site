import type { CSSProperties } from 'react'

interface ScenePlaceholderPageProps {
  readonly background: string
  readonly pageName: string
  readonly bottomFade?: boolean
}

export function ScenePlaceholderPage({
  background,
  pageName,
  bottomFade = false,
}: ScenePlaceholderPageProps) {
  const assetBase = `${import.meta.env.BASE_URL}assets/pages/`

  return (
    <section
      className={`scene-page${bottomFade ? ' scene-page-bottom-fade' : ''}`}
      aria-label={pageName}
      style={{ '--scene-background': `url("${assetBase}${background}")` } as CSSProperties}
    >
      <div className="scene-placeholder" role="status">
        <span>{pageName}</span>
        <strong>To be continue...</strong>
      </div>
    </section>
  )
}
