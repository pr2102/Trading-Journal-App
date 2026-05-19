import { formatLongDate, moodFor } from '../utils/date'
import { deriveResult, normalizeTradePlan, resultFor, signedCurrency, signedR } from '../utils/trading'

export default function TimelineView({ entries, onSelectDate }) {
  return (
    <section className="surface timeline" aria-labelledby="timeline-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Trade log</p>
          <h2 id="timeline-title">{entries.length} sessions</h2>
        </div>
      </div>
      <div className="timeline-list">
        {entries.length === 0 ? (
          <p className="empty-state">No entries match the current filters.</p>
        ) : (
          entries.map((entry) => {
            const mood = moodFor(entry.mood)
            const trade = normalizeTradePlan(entry.trade)
            const result = resultFor(deriveResult(trade))
            return (
              <button type="button" key={entry.id} className="timeline-item" onClick={() => onSelectDate(entry.date)}>
                <span className="timeline-date">{formatLongDate(entry.date)}</span>
                <strong>{entry.title || 'Untitled trading session'}</strong>
                <span className="trade-summary-line">
                  <span style={{ '--result': result.color }}>{result.label}</span>
                  <span>{trade.instrument || 'No instrument'}</span>
                  <span>{trade.direction}</span>
                  <span>{signedCurrency(trade.pnl)}</span>
                  <span>{signedR(trade.rMultiple)}</span>
                </span>
                <p>{entry.content || 'No content yet.'}</p>
                <span className="tag-row">
                  <span className="mood-pill" style={{ '--mood': mood.color }}>
                    {mood.label}
                  </span>
                  {entry.tags.map((tag) => (
                    <span key={tag}>#{tag}</span>
                  ))}
                </span>
              </button>
            )
          })
        )}
      </div>
    </section>
  )
}
