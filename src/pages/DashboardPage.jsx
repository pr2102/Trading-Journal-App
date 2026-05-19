import { useMemo } from 'react'
import { BarBreakdown, EquityCurve, WinRateTrend } from '../components/Charts'
import { KpiCard } from '../components/KpiCard'
import { MarketTerminal } from '../components/MarketTerminal'
import { TradeTable } from '../components/TradeTable'
import { buildAnalytics } from '../lib/analytics'
import { currency, rLabel } from '../lib/tradeMath'
import { useJournalStore } from '../store/useJournalStore'

export function DashboardPage() {
  const days = useJournalStore((state) => state.days)
  const analytics = useMemo(() => buildAnalytics(days), [days])
  const recentTrades = analytics.trades.slice(0, 7)

  return (
    <div className="grid gap-5">
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
        <KpiCard label="Net profitability" value={currency(analytics.netPnl)} tone={analytics.netPnl >= 0 ? 'profit' : 'loss'} />
        <KpiCard label="Win rate" value={`${analytics.winRate.toFixed(1)}%`} />
        <KpiCard label="Profit factor" value={analytics.profitFactor.toFixed(2)} />
        <KpiCard label="Average R" value={rLabel(analytics.averageR)} tone={analytics.averageR >= 0 ? 'profit' : 'loss'} />
        <KpiCard label="Max drawdown" value={currency(analytics.maxDrawdown)} tone="loss" />
        <KpiCard label="Consistency" value={`${analytics.consistencyScore}/100`} />
      </section>

      <MarketTerminal />

      <section className="grid gap-5 xl:grid-cols-2">
        <EquityCurve data={analytics.equityCurve} />
        <WinRateTrend data={analytics.byStrategy} />
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <BarBreakdown title="Performance by symbol" data={analytics.bySymbol} />
        <BarBreakdown title="Performance by session" data={analytics.bySession} />
      </section>

      <TradeTable trades={recentTrades} />
    </div>
  )
}
