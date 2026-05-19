import { useJournalStore } from '../store/useJournalStore'
import { currency, percent } from '../lib/tradeMath'
import { useMarketData } from '../hooks/useMarketData'

const economicEvents = [
  { time: '08:30', impact: 'High', title: 'US CPI / Inflation data' },
  { time: '10:00', impact: 'Medium', title: 'Existing home sales' },
  { time: '14:00', impact: 'High', title: 'FOMC speaker' },
]

export function MarketTerminal() {
  const symbol = useJournalStore((state) => state.symbol)
  const setSymbol = useJournalStore((state) => state.setSymbol)
  const timeframe = useJournalStore((state) => state.timeframe)
  const setTimeframe = useJournalStore((state) => state.setTimeframe)
  const watchlist = useJournalStore((state) => state.watchlist)
  const data = useMarketData(symbol)
  const tvSymbol = symbol === 'XAUUSD' ? 'OANDA:XAUUSD' : symbol === 'BTCUSD' ? 'BINANCE:BTCUSDT' : symbol

  return (
    <section className="grid gap-4 xl:grid-cols-[1fr_340px]">
      <div className="panel overflow-hidden rounded-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] p-4">
          <div>
            <p className="field-label">Live terminal</p>
            <h2 className="text-2xl font-black">{symbol}</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <select className="input w-40" value={symbol} onChange={(event) => setSymbol(event.target.value)}>
              {watchlist.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <select className="input w-28" value={timeframe} onChange={(event) => setTimeframe(event.target.value)}>
              {['1', '5', '15', '60', '240', 'D'].map((item) => (
                <option key={item} value={item}>
                  {item === 'D' ? '1D' : `${item}m`}
                </option>
              ))}
            </select>
          </div>
        </div>
        <iframe
          className="tradingview-widget"
          title={`${symbol} TradingView chart`}
          src={`https://s.tradingview.com/widgetembed/?symbol=${encodeURIComponent(
            tvSymbol,
          )}&interval=${timeframe}&theme=dark&style=1&timezone=Etc%2FUTC&withdateranges=1&hide_side_toolbar=0&allow_symbol_change=1&save_image=0&studies=[]`}
        />
      </div>

      <aside className="grid gap-4">
        <section className="panel rounded-2xl p-4">
          <p className="field-label">Market quote</p>
          <div className="mt-3 flex items-end justify-between gap-3">
            <strong className="kpi-value text-4xl font-black">{data.price.toFixed(symbol.includes('USD') ? 2 : 4)}</strong>
            <span className={data.change >= 0 ? 'font-black text-[var(--profit)]' : 'font-black text-[var(--loss)]'}>
              {currency(data.change)} / {percent(data.changePercent)}
            </span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <Metric label="High" value={data.high.toFixed(2)} />
            <Metric label="Low" value={data.low.toFixed(2)} />
            <Metric label="Spread" value={data.spread.toFixed(2)} />
            <Metric label="Volume" value={data.volume.toLocaleString()} />
            <Metric label="ATR" value={data.atr.toFixed(2)} />
            <Metric label="Sentiment" value={data.sentiment} />
          </div>
        </section>

        <section className="panel rounded-2xl p-4">
          <p className="field-label">Watchlist</p>
          <div className="mt-3 grid gap-2">
            {watchlist.map((item) => (
              <button
                className={`flex items-center justify-between rounded-xl border px-3 py-2 text-left ${
                  item === symbol ? 'border-[var(--accent)] bg-[var(--panel-soft)]' : 'border-[var(--border)]'
                }`}
                type="button"
                key={item}
                onClick={() => setSymbol(item)}
              >
                <span className="font-bold">{item}</span>
                <span className="text-xs text-[var(--muted)]">live-ready</span>
              </button>
            ))}
          </div>
        </section>

        <section className="panel rounded-2xl p-4">
          <p className="field-label">Economic calendar</p>
          <div className="mt-3 grid gap-2">
            {economicEvents.map((event) => (
              <div key={event.title} className="rounded-xl border border-[var(--border)] p-3">
                <div className="flex items-center justify-between gap-2">
                  <strong>{event.time}</strong>
                  <span className="rounded-full bg-[var(--panel-soft)] px-2 py-1 text-xs font-black">{event.impact}</span>
                </div>
                <p className="mt-1 text-sm text-[var(--muted)]">{event.title}</p>
              </div>
            ))}
          </div>
        </section>
      </aside>
    </section>
  )
}

function Metric({ label, value }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--panel-soft)] p-3">
      <span className="field-label">{label}</span>
      <strong className="mt-1 block">{value}</strong>
    </div>
  )
}
