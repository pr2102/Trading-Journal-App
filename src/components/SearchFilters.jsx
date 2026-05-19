import { moods, outcomes, sessions, strategies } from '../lib/tradeMath'
import { useJournalStore } from '../store/useJournalStore'

const sortOptions = ['Newest', 'Oldest', 'Best trade', 'Worst trade', 'Highest R', 'Biggest profit', 'Biggest loss']

export function SearchFilters() {
  const filters = useJournalStore((state) => state.filters)
  const setFilters = useJournalStore((state) => state.setFilters)
  const clearFilters = useJournalStore((state) => state.clearFilters)

  return (
    <section className="panel rounded-2xl p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="field-label">Search system</p>
          <h2 className="text-xl font-black">Find trades</h2>
        </div>
        <button className="btn" type="button" onClick={clearFilters}>
          Clear
        </button>
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Field label="Keyword" value={filters.keyword} onChange={(value) => setFilters({ keyword: value })} />
        <Field label="Symbol" value={filters.symbol} onChange={(value) => setFilters({ symbol: value.toUpperCase() })} />
        <Select label="Strategy" value={filters.strategy} options={['', ...strategies]} onChange={(value) => setFilters({ strategy: value })} />
        <Field label="Tag" value={filters.tag} onChange={(value) => setFilters({ tag: value })} />
        <Select label="Outcome" value={filters.outcome} options={['', ...outcomes]} onChange={(value) => setFilters({ outcome: value })} />
        <Select label="Session" value={filters.session} options={['', ...sessions]} onChange={(value) => setFilters({ session: value })} />
        <Select label="Long/Short" value={filters.direction} options={['', 'Long', 'Short']} onChange={(value) => setFilters({ direction: value })} />
        <Select label="Emotion" value={filters.emotion} options={['', ...moods]} onChange={(value) => setFilters({ emotion: value })} />
        <Field label="Setup type" value={filters.setupType} onChange={(value) => setFilters({ setupType: value })} />
        <Field label="From" type="date" value={filters.from} onChange={(value) => setFilters({ from: value })} />
        <Field label="To" type="date" value={filters.to} onChange={(value) => setFilters({ to: value })} />
        <Select label="Sort" value={filters.sort} options={sortOptions} onChange={(value) => setFilters({ sort: value })} />
      </div>
    </section>
  )
}

function Field({ label, value, onChange, type = 'text' }) {
  return (
    <label className="grid gap-2">
      <span className="field-label">{label}</span>
      <input className="input" type={type} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  )
}

function Select({ label, value, options, onChange }) {
  return (
    <label className="grid gap-2">
      <span className="field-label">{label}</span>
      <select className="input" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option || 'Any'} value={option}>
            {option || 'Any'}
          </option>
        ))}
      </select>
    </label>
  )
}
