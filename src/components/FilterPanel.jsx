import { moodOptions } from '../utils/date'
import { tradeResultOptions } from '../utils/trading'

export default function FilterPanel({ filters, tags, onChange, onClear }) {
  return (
    <section className="surface filters" aria-labelledby="filters-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Find trades</p>
          <h2 id="filters-title">Search and filters</h2>
        </div>
        <button type="button" className="text-button" onClick={onClear}>
          Clear
        </button>
      </div>
      <div className="filter-grid">
        <label className="field">
          <span>Keyword</span>
          <input
            value={filters.keyword}
            onChange={(event) => onChange({ keyword: event.target.value })}
            placeholder="Search setup, notes, tags"
          />
        </label>
        <label className="field">
          <span>Date</span>
          <input type="date" value={filters.date} onChange={(event) => onChange({ date: event.target.value })} />
        </label>
        <label className="field">
          <span>Mood</span>
          <select value={filters.mood} onChange={(event) => onChange({ mood: event.target.value })}>
            <option value="">Any mood</option>
            {moodOptions.map((mood) => (
              <option key={mood.value} value={mood.value}>
                {mood.label}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Instrument</span>
          <input
            value={filters.instrument}
            onChange={(event) => onChange({ instrument: event.target.value })}
            placeholder="NQ, ES, BTC"
          />
        </label>
        <label className="field">
          <span>Result</span>
          <select value={filters.result} onChange={(event) => onChange({ result: event.target.value })}>
            <option value="">Any result</option>
            {tradeResultOptions.map((result) => (
              <option key={result.value} value={result.value}>
                {result.label}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Tag</span>
          <select value={filters.tag} onChange={(event) => onChange({ tag: event.target.value })}>
            <option value="">Any tag</option>
            {tags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </label>
      </div>
    </section>
  )
}
