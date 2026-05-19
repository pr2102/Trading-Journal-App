import { addDays, moodFor, toDateKey } from '../utils/date'
import { deriveResult, normalizeTradePlan, resultFor, signedCurrency, signedR } from '../utils/trading'

export default function AnalyticsDashboard({ entries, today }) {
  const days = Array.from({ length: 35 }, (_, index) => addDays(today, index - 34))
  const sortedEntries = Object.values(entries).sort((a, b) => a.date.localeCompare(b.date))
  const moodCounts = Object.values(entries).reduce((counts, entry) => {
    counts[entry.mood] = (counts[entry.mood] || 0) + 1
    return counts
  }, {})
  const topMoods = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])
  const equity = sortedEntries.reduce(
    (points, entry) => {
      const trade = normalizeTradePlan(entry.trade)
      const last = points.at(-1)?.value ?? 0
      points.push({ date: entry.date, value: last + Number(trade.pnl || 0) })
      return points
    },
    [{ date: 'Start', value: 0 }],
  )
  const maxEquity = Math.max(...equity.map((point) => Math.abs(point.value)), 1)
  const totalR = sortedEntries.reduce((sum, entry) => sum + Number(normalizeTradePlan(entry.trade).rMultiple || 0), 0)

  return (
    <section className="surface analytics" aria-labelledby="analytics-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Trading analytics</p>
          <h2 id="analytics-title">Consistency and edge</h2>
        </div>
      </div>
      <div className="analytics-kpis">
        <div>
          <span>Net P&L</span>
          <strong>{signedCurrency(equity.at(-1)?.value ?? 0)}</strong>
        </div>
        <div>
          <span>Total R</span>
          <strong>{signedR(totalR)}</strong>
        </div>
        <div>
          <span>Sessions</span>
          <strong>{sortedEntries.length}</strong>
        </div>
      </div>
      <div className="heatmap" aria-label="Last 35 days trading heatmap">
        {days.map((day) => {
          const key = toDateKey(day)
          const entry = entries[key]
          const trade = entry ? normalizeTradePlan(entry.trade) : null
          const result = trade ? resultFor(deriveResult(trade)) : null
          return (
            <span
              key={key}
              className={entry ? 'active' : ''}
              title={`${key}${entry ? `: ${entry.title}, ${signedCurrency(trade.pnl)}` : ': no entry'}`}
              style={result ? { backgroundColor: result.color } : undefined}
            />
          )
        })}
      </div>
      <div className="equity-chart" aria-label="Equity curve">
        {equity.map((point) => (
          <span
            key={`${point.date}-${point.value}`}
            title={`${point.date}: ${signedCurrency(point.value)}`}
            style={{ height: `${Math.max(8, (Math.abs(point.value) / maxEquity) * 100)}%` }}
            className={point.value >= 0 ? 'positive' : 'negative'}
          />
        ))}
      </div>
      <div className="mood-bars">
        {topMoods.length === 0 ? (
          <p className="empty-state">Write a few entries to see mood trends.</p>
        ) : (
          topMoods.map(([moodValue, count]) => {
            const mood = moodFor(moodValue)
            return (
              <div key={moodValue}>
                <span>{mood.label}</span>
                <div>
                  <span style={{ width: `${Math.max(12, count * 18)}%`, backgroundColor: mood.color }} />
                </div>
                <strong>{count}</strong>
              </div>
            )
          })
        )}
      </div>
    </section>
  )
}
