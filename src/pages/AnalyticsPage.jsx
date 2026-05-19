import { useMemo } from 'react'
import { BarBreakdown, DrawdownChart, EquityCurve, PieBreakdown } from '../components/Charts'
import { KpiCard } from '../components/KpiCard'
import { SearchFilters } from '../components/SearchFilters'
import { TradeTable } from '../components/TradeTable'
import { buildAnalytics } from '../lib/analytics'
import { applyTradeFilters } from '../lib/filters'
import { currency, rLabel } from '../lib/tradeMath'
import { useJournalStore } from '../store/useJournalStore'

export function AnalyticsPage() {
  const days = useJournalStore((state) => state.days)
  const filters = useJournalStore((state) => state.filters)
  const analytics = useMemo(() => buildAnalytics(days), [days])
  const filteredTrades = useMemo(() => applyTradeFilters(analytics.trades, filters), [analytics.trades, filters])

  return (
    <div className="grid gap-5">
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Total trades" value={analytics.totalTrades} />
        <KpiCard label="Expectancy" value={currency(analytics.expectancy)} tone={analytics.expectancy >= 0 ? 'profit' : 'loss'} />
        <KpiCard label="Sharpe ratio" value={analytics.sharpe.toFixed(2)} />
        <KpiCard label="Streak" value={`${analytics.streaks.current} ${analytics.streaks.currentType}`} />
        <KpiCard label="Average win" value={currency(analytics.averageWin)} tone="profit" />
        <KpiCard label="Average loss" value={currency(-analytics.averageLoss)} tone="loss" />
        <KpiCard label="Average R" value={rLabel(analytics.averageR)} tone={analytics.averageR >= 0 ? 'profit' : 'loss'} />
        <KpiCard label="Consistency" value={`${analytics.consistencyScore}/100`} />
      </section>

      <SearchFilters />
      <TradeTable trades={filteredTrades} />

      <section className="grid gap-5 xl:grid-cols-2">
        <EquityCurve data={analytics.equityCurve} />
        <DrawdownChart data={analytics.drawdownCurve} />
      </section>
      <section className="grid gap-5 xl:grid-cols-2">
        <BarBreakdown title="Monthly P&L" data={analytics.monthlyPnl} />
        <BarBreakdown title="R-multiple distribution" data={analytics.rDistribution} dataKey="count" />
        <BarBreakdown title="Performance by setup" data={analytics.bySetup} />
        <BarBreakdown title="Performance by weekday" data={analytics.byWeekday} />
        <BarBreakdown title="Emotional correlation" data={analytics.emotionalCorrelation} />
        <PieBreakdown title="Strategy mix" data={analytics.byStrategy} />
      </section>
    </div>
  )
}
