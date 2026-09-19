import { useState } from 'react'
import { ScenePage } from '../../components/scene/ScenePage'
import { Pagination } from '../../components/ui/Pagination'
import { siteConfig } from '../../config/site'
import { siteLogs } from './logs.data'
import './logs.css'

const LOGS_PER_PAGE = 2

export function LogsPage() {
  const [page, setPage] = useState(1)
  const [selectedId, setSelectedId] = useState(siteLogs[0].id)
  const pageCount = Math.ceil(siteLogs.length / LOGS_PER_PAGE)
  const pageLogs = siteLogs.slice((page - 1) * LOGS_PER_PAGE, page * LOGS_PER_PAGE)
  const selectedLog = siteLogs.find((entry) => entry.id === selectedId) ?? siteLogs[0]

  const changePage = (nextPage: number) => {
    const firstLog = siteLogs[(nextPage - 1) * LOGS_PER_PAGE]
    setPage(nextPage)
    setSelectedId(firstLog.id)
  }

  return (
    <ScenePage
      className="logs-scene-page"
      background={siteConfig.backgrounds.logs}
      label="Logs"
      labelledBy="logs-title"
    >
      <section className="logs-panel">
        <aside className="logs-index" aria-label="Log index">
          <header>
            <p>Field notes / {String(siteLogs.length).padStart(2, '0')}</p>
            <h1 id="logs-title">Logs</h1>
          </header>

          <div className="logs-list">
            {pageLogs.map((entry) => (
              <button
                key={entry.id}
                type="button"
                className={entry.id === selectedLog.id ? 'logs-list-item logs-list-item-active' : 'logs-list-item'}
                onClick={() => setSelectedId(entry.id)}
                aria-pressed={entry.id === selectedLog.id}
              >
                <span className="logs-list-meta"><span>{entry.type}</span><time>{entry.date}</time></span>
                <strong>{entry.title}</strong>
                <span className="logs-list-intro">{entry.intro}</span>
                <span className="logs-list-open">Read log <span aria-hidden="true">→</span></span>
              </button>
            ))}
          </div>

          <Pagination
            currentPage={page}
            pageCount={pageCount}
            onPageChange={changePage}
            label="Log pages"
          />
        </aside>

        <article className="logs-detail" aria-live="polite">
          <div className="logs-detail-meta">
            <span>{selectedLog.type}</span>
            <time dateTime={selectedLog.date.replaceAll('.', '-')}>{selectedLog.date}</time>
          </div>
          <h2>{selectedLog.title}</h2>
          <p className="logs-detail-intro">{selectedLog.intro}</p>
          <div className="logs-detail-body">
            {selectedLog.content.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
          <footer>
            <span>End of transmission</span>
            <i aria-hidden="true" />
          </footer>
        </article>
      </section>
    </ScenePage>
  )
}
