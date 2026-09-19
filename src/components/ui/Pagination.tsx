import './pagination.css'

interface PaginationProps {
  readonly currentPage: number
  readonly pageCount: number
  readonly onPageChange: (page: number) => void
  readonly label: string
}

/** Shared compact pagination used by content indexes. */
export function Pagination({ currentPage, pageCount, onPageChange, label }: PaginationProps) {
  if (pageCount <= 1) return null

  return (
    <nav className="pagination" aria-label={label}>
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <span aria-hidden="true">←</span> Prev
      </button>
      <div className="pagination-pages">
        {Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => (
          <button
            key={page}
            type="button"
            className={page === currentPage ? 'pagination-page-active' : ''}
            aria-current={page === currentPage ? 'page' : undefined}
            aria-label={`Page ${page}`}
            onClick={() => onPageChange(page)}
          >
            {String(page).padStart(2, '0')}
          </button>
        ))}
      </div>
      <button
        type="button"
        disabled={currentPage === pageCount}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next <span aria-hidden="true">→</span>
      </button>
    </nav>
  )
}
