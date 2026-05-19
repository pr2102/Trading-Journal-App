export function KpiCard({ label, value, helper, tone = 'neutral' }) {
  const toneClass =
    tone === 'profit' ? 'text-[var(--profit)]' : tone === 'loss' ? 'text-[var(--loss)]' : 'text-[var(--text)]'

  return (
    <section className="panel rounded-2xl p-4">
      <p className="field-label">{label}</p>
      <strong className={`kpi-value mt-2 block text-2xl font-black ${toneClass}`}>{value}</strong>
      {helper && <p className="mt-2 text-sm text-[var(--muted)]">{helper}</p>}
    </section>
  )
}
