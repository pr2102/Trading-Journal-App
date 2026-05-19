import { formatLongDate, formatShortDate, moodFor } from '../utils/date'
import { deriveResult, normalizeTradePlan, resultFor, signedCurrency, signedR } from '../utils/trading'

export default function Sidebar({ todayKey, todayEntry, recentEntries, stats, onSelectDate }) {
  return (
    <aside className="sidebar" aria-label="Trader dashboard">
      <section className="surface today-card">
        <p className="eyebrow">Today plan</p>
        <h2>{todayEntry?.title || 'Prepare the session'}</h2>
        <p>{todayEntry?.content?.slice(0, 130) || 'Define bias, invalidation, max risk, and the setup worth waiting for.'}</p>
        <button type="button" className="secondary-button" onClick={() => onSelectDate(todayKey)}>
          Open today
        </button>
      </section>

      <section className="surface stat-panel">
        <p className="eyebrow">Performance</p>
        <div className="stat-grid">
          <Stat value={signedCurrency(stats.netPnl)} label="net P&L" tone={stats.netPnl >= 0 ? 'positive' : 'negative'} />
          <Stat value={`${stats.winRate}%`} label="win rate" />
          <Stat value={signedR(stats.avgR)} label="average R" />
          <Stat value={`${stats.avgRuleScore.toFixed(1)}/5`} label="rule score" />
        </div>
      </section>

      <section className="surface stat-panel">
        <p className="eyebrow">Process</p>
        <div className="stat-grid">
          <Stat value={stats.writingStreak} label="journal streak" />
          <Stat value={stats.moodStreak} label="mood streak" />
          <Stat value={stats.completedTrades} label="closed trades" />
          <Stat value={stats.totalEntries} label="sessions" />
        </div>
      </section>

      <section className="surface">
        <div className="section-heading compact">
          <div>
            <p className="eyebrow">Recent</p>
            <h2>Latest entries</h2>
          </div>
        </div>
        <div className="recent-list">
          {recentEntries.map((entry) => {
            const mood = moodFor(entry.mood)
            const trade = normalizeTradePlan(entry.trade)
            const result = resultFor(deriveResult(trade))
            return (
              <button type="button" key={entry.id} onClick={() => onSelectDate(entry.date)}>
                <span style={{ backgroundColor: result.color }} />
                <div>
                  <strong>{entry.title || formatLongDate(entry.date)}</strong>
                  <small>
                    {formatShortDate(entry.date)} - {trade.instrument || mood.label} - {signedCurrency(trade.pnl)}
                  </small>
                </div>
              </button>
            )
          })}
        </div>
      </section>
    </aside>
  )
}

function Stat({ value, label, tone = '' }) {
  return (
    <div className={tone}>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  )
}
