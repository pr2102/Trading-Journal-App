import { formatMonth, getMonthMatrix, moodFor, sameMonth, toDateKey } from '../utils/date'
import { deriveResult, normalizeTradePlan, resultFor, signedCurrency } from '../utils/trading'

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function CalendarView({
  entries,
  monthDate,
  selectedDate,
  todayKey,
  onSelectDate,
  onMonthChange,
  onToday,
}) {
  const days = getMonthMatrix(monthDate)

  return (
    <section className="surface calendar-section" aria-labelledby="calendar-title">
      <div className="section-heading calendar-heading">
        <div>
          <p className="eyebrow">Trading calendar</p>
          <h2 id="calendar-title">{formatMonth(monthDate)}</h2>
        </div>
        <div className="button-row">
          <button type="button" className="icon-button" onClick={() => onMonthChange(-1)} aria-label="Previous month">
            <span aria-hidden="true">&lt;</span>
          </button>
          <button type="button" className="secondary-button" onClick={onToday}>
            Today
          </button>
          <button type="button" className="icon-button" onClick={() => onMonthChange(1)} aria-label="Next month">
            <span aria-hidden="true">&gt;</span>
          </button>
        </div>
      </div>

      <div className="weekday-grid" aria-hidden="true">
        {weekdays.map((weekday) => (
          <span key={weekday}>{weekday}</span>
        ))}
      </div>

      <div className="calendar-grid">
        {days.map((day) => {
          const key = toDateKey(day)
          const entry = entries[key]
          const isToday = key === todayKey
          const isSelected = key === selectedDate
          const isMuted = !sameMonth(day, monthDate)
          const mood = entry ? moodFor(entry.mood) : null
          const trade = entry ? normalizeTradePlan(entry.trade) : null
          const result = trade ? resultFor(deriveResult(trade)) : null

          return (
            <button
              type="button"
              key={key}
              className={[
                'calendar-day',
                isToday ? 'is-today' : '',
                isSelected ? 'is-selected' : '',
                isMuted ? 'is-muted' : '',
                entry ? 'has-entry' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => onSelectDate(key)}
              aria-pressed={isSelected}
              aria-label={`${day.toLocaleDateString()}. ${
                entry ? `${trade.instrument || 'Journal'} ${result.label}, mood ${mood.label}.` : 'No entry yet.'
              }`}
            >
              <span className="day-number">{day.getDate()}</span>
              {entry && (
                <>
                  <span className="entry-title">{entry.title || 'Untitled'}</span>
                  <span className="calendar-trade-meta">
                    {trade.instrument || 'Journal'} {signedCurrency(trade.pnl)}
                  </span>
                </>
              )}
              {mood && <span className="mood-dot" style={{ backgroundColor: mood.color }} title={mood.label} />}
              {result && (
                <span
                  className="result-stripe"
                  style={{ backgroundColor: result.color }}
                  title={result.label}
                  aria-hidden="true"
                />
              )}
            </button>
          )
        })}
      </div>
    </section>
  )
}
