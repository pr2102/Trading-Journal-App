import { MarketTerminal } from '../components/MarketTerminal'

export function MarketsPage() {
  return (
    <div className="grid gap-5">
      <MarketTerminal />
      <section className="grid gap-4 md:grid-cols-3">
        {[
          ['Supported now', 'XAUUSD default, forex, crypto, indices, stocks via watchlist-ready symbol model.'],
          ['API-ready layer', 'The market hook is isolated so TwelveData, Finnhub, Binance, or broker feeds can replace demo ticks.'],
          ['TradingView chart', 'Embedded TradingView widget with symbol and timeframe selectors for a terminal-like workflow.'],
        ].map(([title, text]) => (
          <div className="panel rounded-2xl p-4" key={title}>
            <h3 className="text-lg font-black">{title}</h3>
            <p className="mt-2 text-sm text-[var(--muted)]">{text}</p>
          </div>
        ))}
      </section>
    </div>
  )
}
