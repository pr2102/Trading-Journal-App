import { ReviewEditor } from '../components/DayJournal'
import { longDate } from '../lib/date'
import { useJournalStore } from '../store/useJournalStore'

export function ReviewsPage() {
  const selectedDate = useJournalStore((state) => state.selectedDate)
  const days = useJournalStore((state) => state.days)
  const ensureDay = useJournalStore((state) => state.ensureDay)
  const updateReview = useJournalStore((state) => state.updateReview)
  const day = days[selectedDate] ?? ensureDay(selectedDate)

  return (
    <div className="grid gap-5">
      <section className="panel rounded-2xl p-5">
        <p className="field-label">Structured review workflow</p>
        <h2 className="mt-1 text-2xl font-black">{longDate(selectedDate)}</h2>
        <p className="mt-2 max-w-3xl text-[var(--muted)]">
          Use daily, weekly, and monthly review prompts to surface recurring mistakes, best setups, psychology patterns, and strategy improvement ideas.
        </p>
      </section>
      <ReviewEditor title="Daily Review" section="dailyReview" date={selectedDate} values={day.dailyReview} updateReview={updateReview} />
      <ReviewEditor title="Weekly Review" section="weeklyReview" date={selectedDate} values={day.weeklyReview} updateReview={updateReview} />
      <ReviewEditor title="Monthly Review" section="monthlyReview" date={selectedDate} values={day.monthlyReview} updateReview={updateReview} />
      <section className="grid gap-4 md:grid-cols-3">
        {[
          ['Rule detector', 'Flags rule violations captured on each trade and groups them in analytics.'],
          ['Mistake patterns', 'Recurring mistakes are tracked from trade rule violations and review notes.'],
          ['AI-ready insights', 'The review structure is ready for AI suggestions once an API backend is added.'],
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
