import { Trash2, Upload } from 'lucide-react'
import { calcTrade, markets, moods, outcomes, sessions, strategies } from '../lib/tradeMath'
import { useJournalStore } from '../store/useJournalStore'

const setupTypes = ['Liquidity sweep', 'Breakout', 'Pullback', 'Reversal', 'Continuation', 'News trade', 'Range trade']
const timeframes = ['1m', '5m', '15m', '30m', '1h', '4h', '1D']
const marketConditions = ['Trending', 'Ranging', 'Choppy', 'Volatile', 'News-driven']
const confluenceItems = ['HTF bias', 'Liquidity level', 'Volume confirmation', 'VWAP', 'FVG', 'Order block', 'DXY alignment']

export function TradeForm({ date, trade }) {
  const updateTrade = useJournalStore((state) => state.updateTrade)
  const deleteTrade = useJournalStore((state) => state.deleteTrade)
  const computed = calcTrade(trade)

  function patch(next) {
    updateTrade(date, trade.id, next)
  }

  function toggleList(key, value) {
    const current = trade[key] ?? []
    patch({ [key]: current.includes(value) ? current.filter((item) => item !== value) : [...current, value] })
  }

  function attachImages(event) {
    Array.from(event.target.files || []).forEach((file) => {
      if (!file.type.startsWith('image/')) return
      const reader = new FileReader()
      reader.onload = () => {
        patch({
          screenshots: [
            ...(trade.screenshots ?? []),
            { id: `${Date.now()}-${file.name}`, name: file.name, dataUrl: reader.result },
          ],
        })
      }
      reader.readAsDataURL(file)
    })
    event.target.value = ''
  }

  return (
    <section className="panel rounded-2xl p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="field-label">Trade entry</p>
          <h3 className="text-xl font-black">
            {trade.symbol} {trade.direction} <span className="text-[var(--muted)]">#{trade.id.slice(-5)}</span>
          </h3>
        </div>
        <div className="flex flex-wrap gap-2 text-sm">
          <Badge label={`P&L ${computed.pnl.toFixed(2)}`} tone={computed.pnl >= 0 ? 'profit' : 'loss'} />
          <Badge label={`${computed.rMultiple.toFixed(2)}R`} tone={computed.rMultiple >= 0 ? 'profit' : 'loss'} />
          <Badge label={`RR ${computed.riskReward.toFixed(2)}`} />
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Field label="Time" type="time" value={trade.time} onChange={(value) => patch({ time: value })} />
        <Field label="Symbol" value={trade.symbol} onChange={(value) => patch({ symbol: value.toUpperCase() })} />
        <Select label="Market" value={trade.market} options={markets} onChange={(value) => patch({ market: value })} />
        <Field label="Exchange" value={trade.exchange} onChange={(value) => patch({ exchange: value })} />
        <Select label="Long/Short" value={trade.direction} options={['Long', 'Short']} onChange={(value) => patch({ direction: value })} />
        <Field label="Entry price" type="number" value={trade.entryPrice} onChange={(value) => patch({ entryPrice: value })} />
        <Field label="Exit price" type="number" value={trade.exitPrice} onChange={(value) => patch({ exitPrice: value })} />
        <Field label="Stop loss" type="number" value={trade.stopLoss} onChange={(value) => patch({ stopLoss: value })} />
        <Field label="Take profit" type="number" value={trade.takeProfit} onChange={(value) => patch({ takeProfit: value })} />
        <Field label="Position size" type="number" value={trade.positionSize} onChange={(value) => patch({ positionSize: value })} />
        <Field label="Risk amount" type="number" value={trade.riskAmount} onChange={(value) => patch({ riskAmount: value })} />
        <Field label="Leverage" type="number" value={trade.leverage} onChange={(value) => patch({ leverage: value })} />
        <Field label="Fees" type="number" value={trade.fees} onChange={(value) => patch({ fees: value })} />
        <Field label="Slippage" type="number" value={trade.slippage} onChange={(value) => patch({ slippage: value })} />
        <Select label="Outcome" value={trade.outcome} options={outcomes} onChange={(value) => patch({ outcome: value })} />
        <Field label="P&L $" type="number" value={trade.pnl} onChange={(value) => patch({ pnl: value })} />
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-3">
        <Select label="Strategy" value={trade.strategy} options={strategies} onChange={(value) => patch({ strategy: value })} />
        <Select label="Setup type" value={trade.setupType} options={setupTypes} onChange={(value) => patch({ setupType: value })} />
        <Field label="Trading model" value={trade.tradingModel} onChange={(value) => patch({ tradingModel: value })} />
        <Select label="Timeframe" value={trade.timeframe} options={timeframes} onChange={(value) => patch({ timeframe: value })} />
        <Select label="Session" value={trade.session} options={sessions} onChange={(value) => patch({ session: value })} />
        <Select
          label="Market condition"
          value={trade.marketCondition}
          options={marketConditions}
          onChange={(value) => patch({ marketCondition: value })}
        />
      </div>

      <Checklist title="Confluence checklist" items={confluenceItems} selected={trade.confluence} onToggle={(item) => toggleList('confluence', item)} />

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <Slider label="Confidence" value={trade.confidenceScore} onChange={(value) => patch({ confidenceScore: value })} />
        <Select label="Before" value={trade.emotionalBefore} options={moods} onChange={(value) => patch({ emotionalBefore: value })} />
        <Select label="During" value={trade.emotionalDuring} options={moods} onChange={(value) => patch({ emotionalDuring: value })} />
        <Select label="After" value={trade.emotionalAfter} options={moods} onChange={(value) => patch({ emotionalAfter: value })} />
        <Slider label="Discipline" value={trade.disciplineScore} onChange={(value) => patch({ disciplineScore: value })} />
        <Slider label="Fear / greed" value={trade.fearGreedScale} onChange={(value) => patch({ fearGreedScale: value })} />
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        {[
          ['Trade thesis', 'thesis'],
          ['Why trade was taken', 'reasonTaken'],
          ['What happened', 'whatHappened'],
          ['Lessons learned', 'lessons'],
          ['Mistakes made', 'mistakes'],
          ['Next improvement', 'improvements'],
        ].map(([label, key]) => (
          <label className="grid gap-2" key={key}>
            <span className="field-label">{label}</span>
            <textarea className="input min-h-24" value={trade[key]} onChange={(event) => patch({ [key]: event.target.value })} />
          </label>
        ))}
      </div>

      <label className="mt-5 inline-flex">
        <span className="btn">
          <Upload size={16} />
          Upload screenshots
          <input className="fixed h-px w-px opacity-0" type="file" accept="image/*" multiple onChange={attachImages} />
        </span>
      </label>

      {(trade.screenshots ?? []).length > 0 && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {trade.screenshots.map((shot) => (
            <figure key={shot.id} className="overflow-hidden rounded-2xl border border-[var(--border)]">
              <img className="aspect-video w-full object-cover" src={shot.dataUrl} alt={shot.name} />
              <figcaption className="flex items-center justify-between gap-2 p-2 text-xs text-[var(--muted)]">
                <span className="truncate">{shot.name}</span>
                <button
                  type="button"
                  onClick={() => patch({ screenshots: trade.screenshots.filter((item) => item.id !== shot.id) })}
                >
                  Remove
                </button>
              </figcaption>
            </figure>
          ))}
        </div>
      )}

      <div className="mt-5 flex justify-end">
        <button className="btn text-[var(--loss)]" type="button" onClick={() => deleteTrade(date, trade.id)}>
          <Trash2 size={16} />
          Delete trade
        </button>
      </div>
    </section>
  )
}

function Field({ label, value, onChange, type = 'text' }) {
  return (
    <label className="grid gap-2">
      <span className="field-label">{label}</span>
      <input className="input" type={type} value={value ?? ''} onChange={(event) => onChange(event.target.value)} />
    </label>
  )
}

function Select({ label, value, options, onChange }) {
  return (
    <label className="grid gap-2">
      <span className="field-label">{label}</span>
      <select className="input" value={value ?? ''} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}

function Slider({ label, value, onChange }) {
  return (
    <label className="grid gap-2">
      <span className="field-label">
        {label}: {value}/10
      </span>
      <input type="range" min="1" max="10" value={value ?? 5} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  )
}

function Checklist({ title, items, selected = [], onToggle }) {
  return (
    <div className="mt-5">
      <p className="field-label mb-2">{title}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <button
            className={`rounded-full border px-3 py-2 text-sm font-bold ${
              selected.includes(item)
                ? 'border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_18%,transparent)] text-[var(--accent)]'
                : 'border-[var(--border)] text-[var(--muted)]'
            }`}
            type="button"
            key={item}
            onClick={() => onToggle(item)}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  )
}

function Badge({ label, tone = 'neutral' }) {
  return (
    <span
      className={`rounded-full px-3 py-1 font-black ${
        tone === 'profit' ? 'bg-green-500/15 text-[var(--profit)]' : tone === 'loss' ? 'bg-red-500/15 text-[var(--loss)]' : 'bg-[var(--panel-soft)]'
      }`}
    >
      {label}
    </span>
  )
}
