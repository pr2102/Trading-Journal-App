import { Plus } from 'lucide-react'
import { longDate } from '../lib/date'
import { useJournalStore } from '../store/useJournalStore'
import { TradeForm } from './TradeForm'

export function DayJournal() {
  const selectedDate = useJournalStore((state) => state.selectedDate)
  const days = useJournalStore((state) => state.days)
  const ensureDay = useJournalStore((state) => state.ensureDay)
  const updateDay = useJournalStore((state) => state.updateDay)
  const updateReview = useJournalStore((state) => state.updateReview)
  const addTrade = useJournalStore((state) => state.addTrade)
  const day = days[selectedDate] ?? ensureDay(selectedDate)

  return (
    <section className="grid gap-4">
      <div className="panel rounded-2xl p-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="field-label">Daily trading activity</p>
            <h2 className="text-2xl font-black">{longDate(selectedDate)}</h2>
          </div>
          <button className="btn btn-primary" type="button" onClick={() => addTrade(selectedDate)}>
            <Plus size={16} />
            Add trade
          </button>
        </div>

        <div className="grid gap-3 lg:grid-cols-3">
          <label className="grid gap-2">
            <span className="field-label">Mood</span>
            <input className="input" value={day.mood} onChange={(event) => updateDay(selectedDate, { mood: event.target.value })} />
          </label>
          <label className="grid gap-2 lg:col-span-2">
            <span className="field-label">Pre-market plan</span>
            <textarea
              className="input min-h-24"
              value={day.preMarketPlan}
              onChange={(event) => updateDay(selectedDate, { preMarketPlan: event.target.value })}
            />
          </label>
          <label className="grid gap-2 lg:col-span-3">
            <span className="field-label">Post-market review</span>
            <textarea
              className="input min-h-24"
              value={day.postMarketReview}
              onChange={(event) => updateDay(selectedDate, { postMarketReview: event.target.value })}
            />
          </label>
        </div>
      </div>

      <ReviewEditor title="Daily Review" section="dailyReview" date={selectedDate} values={day.dailyReview} updateReview={updateReview} />

      {day.trades.length === 0 ? (
        <div className="panel rounded-2xl p-8 text-center">
          <p className="text-[var(--muted)]">No trades logged for this day yet.</p>
          <button className="btn btn-primary mt-4" type="button" onClick={() => addTrade(selectedDate)}>
            Add first trade
          </button>
        </div>
      ) : (
        day.trades.map((trade) => <TradeForm key={trade.id} date={selectedDate} trade={trade} />)
      )}
    </section>
  )
}

export function ReviewEditor({ title, section, date, values, updateReview }) {
  return (
    <section className="panel rounded-2xl p-4">
      <h3 className="mb-4 text-xl font-black">{title}</h3>
      <div className="grid gap-3 md:grid-cols-2">
        {Object.entries(values).map(([key, value]) => (
          <label className="grid gap-2" key={key}>
            <span className="field-label">{labelize(key)}</span>
            <textarea
              className="input min-h-20"
              value={value}
              onChange={(event) => updateReview(date, section, key, event.target.value)}
            />
          </label>
        ))}
      </div>
    </section>
  )
}

function labelize(value) {
  return value.replace(/([A-Z])/g, ' $1').replace(/^./, (letter) => letter.toUpperCase())
}
