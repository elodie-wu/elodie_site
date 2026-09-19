import { useState } from 'react'
import { ScenePage } from '../../components/scene/ScenePage'
import { ExternalLink } from '../../components/ui/ExternalLink'
import { Pagination } from '../../components/ui/Pagination'
import { siteConfig } from '../../config/site'
import { assetUrl } from '../../shared/lib/assetUrl'
import { workProjects } from './work.data'
import './work.css'

const PROJECTS_PER_PAGE = 2

export function WorkPage() {
  const [page, setPage] = useState(1)
  const pageCount = Math.ceil(workProjects.length / PROJECTS_PER_PAGE)
  const visibleProjects = workProjects.slice(
    (page - 1) * PROJECTS_PER_PAGE,
    page * PROJECTS_PER_PAGE,
  )

  return (
    <ScenePage
      className="work-scene-page"
      background={siteConfig.backgrounds.work}
      label="Work"
      labelledBy="work-title"
      bottomFade
    >
      <section className="work-index-panel">
        <header className="work-index-header">
          <div>
            <p className="work-kicker">Selected work / {String(workProjects.length).padStart(2, '0')}</p>
            <h1 id="work-title">Projects in the field</h1>
          </div>
          <p>Systems, research prototypes, and small worlds built across code and design.</p>
        </header>

        <div className="work-project-list">
          {visibleProjects.map((project, index) => (
            <article className="work-project-card" key={project.id}>
              <div className="work-project-image-wrap">
                <img src={assetUrl(project.image)} alt={project.imageAlt} />
                <span>{String((page - 1) * PROJECTS_PER_PAGE + index + 1).padStart(2, '0')}</span>
              </div>
              <div className="work-project-copy">
                <p className="work-project-type">{project.type}</p>
                <h2>{project.title}</h2>
                <p className="work-project-description">{project.description}</p>
                <ul className="work-project-tags" aria-label={`${project.title} technologies`}>
                  {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
                </ul>
                <ExternalLink className="work-project-link" href={project.href}>
                  Open project <span aria-hidden="true">↗</span>
                </ExternalLink>
              </div>
            </article>
          ))}
        </div>

        <Pagination
          currentPage={page}
          pageCount={pageCount}
          onPageChange={setPage}
          label="Project pages"
        />
      </section>
    </ScenePage>
  )
}
