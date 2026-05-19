import { currency, rLabel } from '../lib/tradeMath'

export function TradeTable({ trades }) {
  return (
    <section className="panel overflow-hidden rounded-2xl">
      <div className="border-b border-[var(--border)] p-4">
        <p className="field-label">Trade database</p>
        <h2 className="text-xl font-black">{trades.length} matching trades</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px] text-left text-sm">
          <thead className="bg-[var(--panel-soft)] text-xs uppercase tracking-wide text-[var(--muted)]">
            <tr>
              {['Date', 'Time', 'Symbol', 'Side', 'Strategy', 'Session', 'Outcome', 'P&L', 'R', 'Emotion'].map((head) => (
                <th className="px-4 py-3" key={head}>
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {trades.map((trade) => (
              <tr className="border-t border-[var(--border)]" key={trade.id}>
                <td className="px-4 py-3">{trade.date}</td>
                <td className="px-4 py-3">{trade.time}</td>
                <td className="px-4 py-3 font-black">{trade.symbol}</td>
                <td className="px-4 py-3">{trade.direction}</td>
                <td className="px-4 py-3">{trade.strategy}</td>
                <td className="px-4 py-3">{trade.session}</td>
                <td className="px-4 py-3">{trade.outcome}</td>
                <td className={trade.pnl >= 0 ? 'px-4 py-3 font-black text-[var(--profit)]' : 'px-4 py-3 font-black text-[var(--loss)]'}>
                  {currency(trade.pnl)}
                </td>
                <td className="px-4 py-3 font-black">{rLabel(trade.rMultiple)}</td>
                <td className="px-4 py-3">{trade.emotionalBefore}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
