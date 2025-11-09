type Props = {
  page: number
  hasNext: boolean
  onPrev: () => void
  onNext: () => void
}

export default function Pagination({ page, hasNext, onPrev, onNext }: Props) {
  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        type="button"
        onClick={onPrev}
        disabled={page <= 1}
        aria-disabled={page <= 1}
      >
        ← Prev
      </button>
      <span className="page-indicator" aria-live="polite">Page {page}</span>
      <button
        type="button"
        onClick={onNext}
        disabled={!hasNext}
        aria-disabled={!hasNext}
      >
        Next →
      </button>
    </nav>
  )
}
