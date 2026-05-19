import { Download, Upload } from 'lucide-react'
import { buildAnalytics } from '../lib/analytics'
import { useJournalStore } from '../store/useJournalStore'

export function DataPage() {
  const days = useJournalStore((state) => state.days)
  const importDays = useJournalStore((state) => state.importDays)
  const analytics = buildAnalytics(days)

  function download(filename, content, type) {
    const blob = new Blob([content], { type })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  function exportCsv() {
    const headers = [
      'Date',
      'Time',
      'Symbol',
      'Market',
      'Direction',
      'Strategy',
      'Setup',
      'Session',
      'Outcome',
      'P&L',
      'R Multiple',
      'Confidence',
      'Discipline',
      'Tags',
      'Lessons',
    ]
    const rows = analytics.trades.map((trade) => [
      trade.date,
      trade.time,
      trade.symbol,
      trade.market,
      trade.direction,
      trade.strategy,
      trade.setupType,
      trade.session,
      trade.outcome,
      trade.pnl,
      trade.rMultiple,
      trade.confidenceScore,
      trade.disciplineScore,
      (trade.tags ?? []).join('; '),
      trade.lessons,
    ])
    const escape = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`
    download('trading-journal.csv', [headers, ...rows].map((row) => row.map(escape).join(',')).join('\n'), 'text/csv')
  }

  function restore(event) {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        importDays(JSON.parse(reader.result))
      } catch {
        window.alert('Could not import this backup.')
      }
    }
    reader.readAsText(file)
    event.target.value = ''
  }

  return (
    <div className="grid gap-5">
      <section className="panel rounded-2xl p-5">
        <p className="field-label">Data management</p>
        <h2 className="mt-1 text-2xl font-black">Export, import, backup, and restore</h2>
        <p className="mt-2 max-w-3xl text-[var(--muted)]">
          Data is stored locally first with Zustand persistence. The shape is ready for backend sync, broker imports, MT4/MT5, Binance, prop dashboards, and cloud accounts.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <button className="btn btn-primary" type="button" onClick={() => download('trading-journal-backup.json', JSON.stringify(days, null, 2), 'application/json')}>
            <Download size={16} />
            Export JSON
          </button>
          <button className="btn" type="button" onClick={exportCsv}>
            <Download size={16} />
            Export CSV
          </button>
          <button className="btn" type="button" onClick={() => window.print()}>
            Print / PDF
          </button>
          <label className="btn">
            <Upload size={16} />
            Restore backup
            <input className="fixed h-px w-px opacity-0" type="file" accept="application/json" onChange={restore} />
          </label>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ['Broker integration', 'Import adapters can map broker executions into the trade schema.'],
          ['Cloud sync', 'The Zustand store can be backed by an API without changing screens.'],
          ['Team trading', 'The data model separates days, reviews, and trades for account/workspace expansion.'],
          ['AI assistant', 'Trade notes, rule violations, and screenshots are structured for review suggestions.'],
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
