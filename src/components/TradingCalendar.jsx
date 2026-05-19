import { ChevronLeft, ChevronRight } from 'lucide-react'
import { addDays, addMonths, fromDateKey, monthLabel, monthMatrix, sameMonth, toDateKey, todayKey } from '../lib/date'
import { allTrades } from '../lib/analytics'
import { currency, outcomeColor } from '../lib/tradeMath'
import { useJournalStore } from '../store/useJournalStore'

export function TradingCalendar({ view, setView }) {
  const days = useJournalStore((state) => state.days)
  const selectedDate = useJournalStore((state) => state.selectedDate)
  const setSelectedDate = useJournalStore((state) => state.setSelectedDate)
  const selected = fromDateKey(selectedDate)
  const calendarDays = monthMatrix(selected)

  function shiftDay(amount) {
    setSelectedDate(toDateKey(addDays(fromDateKey(selectedDate), amount)))
  }

  return (
    <section className="panel rounded-2xl p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="field-label">Calendar journal</p>
          <h2 className="text-2xl font-black">{monthLabel(selected)}</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {['Month', 'Week', 'Day'].map((item) => (
            <button
              className={`btn ${view === item ? 'btn-primary' : ''}`}
              type="button"
              key={item}
              onClick={() => setView(item)}
            >
              {item}
            </button>
          ))}
          <button className="btn" type="button" onClick={() => setSelectedDate(toDateKey(addMonths(selected, -1)))}>
            <ChevronLeft size={16} />
          </button>
          <button className="btn" type="button" onClick={() => setSelectedDate(todayKey())}>
            Today
          </button>
          <button className="btn" type="button" onClick={() => setSelectedDate(toDateKey(addMonths(selected, 1)))}>
            <ChevronRight size={16} />
          </button>
          <button className="btn" type="button" onClick={() => shiftDay(-1)}>
            Prev day
          </button>
          <button className="btn" type="button" onClick={() => shiftDay(1)}>
            Next day
          </button>
        </div>
      </div>

      {view === 'Month' && (
        <>
          <div className="grid grid-cols-7 border-b border-[var(--border)] pb-2 text-center text-xs font-black uppercase tracking-wide text-[var(--muted)]">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-7 gap-2">
            {calendarDays.map((date) => (
              <CalendarCell
                key={toDateKey(date)}
                date={date}
                muted={!sameMonth(date, selected)}
                selectedDate={selectedDate}
                day={days[toDateKey(date)]}
                onSelect={setSelectedDate}
              />
            ))}
          </div>
        </>
      )}

      {view !== 'Month' && (
        <div className="grid gap-3">
          {(view === 'Week'
            ? Array.from({ length: 7 }, (_, index) => addDays(selected, index - selected.getDay()))
            : [selected]
          ).map((date) => (
            <CalendarCell
              key={toDateKey(date)}
              date={date}
              selectedDate={selectedDate}
              day={days[toDateKey(date)]}
              onSelect={setSelectedDate}
              large
            />
          ))}
        </div>
      )}
    </section>
  )
}

function CalendarCell({ date, day, muted = false, selectedDate, onSelect, large = false }) {
  const key = toDateKey(date)
  const trades = day ? allTrades({ [key]: day }) : []
  const pnl = trades.reduce((sum, trade) => sum + trade.pnl, 0)
  const isToday = key === todayKey()
  const isSelected = key === selectedDate

  return (
    <button
      type="button"
      className={`relative overflow-hidden rounded-2xl border p-3 text-left transition hover:-translate-y-0.5 ${
        large ? 'min-h-28' : 'min-h-24'
      } ${
        isSelected
          ? 'border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_14%,var(--panel))]'
          : 'border-[var(--border)] bg-[var(--panel-soft)]'
      } ${muted ? 'opacity-55' : ''}`}
      onClick={() => onSelect(key)}
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-black ${
            isToday ? 'bg-[var(--accent)] text-white' : 'bg-[var(--panel)]'
          }`}
        >
          {date.getDate()}
        </span>
        {trades.length > 0 && <span className="text-xs font-black text-[var(--muted)]">{trades.length} trades</span>}
      </div>
      {trades.length > 0 && (
        <div className="mt-3 grid gap-1">
          <strong className={pnl >= 0 ? 'text-[var(--profit)]' : 'text-[var(--loss)]'}>{currency(pnl)}</strong>
          <div className="flex gap-1">
            {trades.slice(0, 4).map((trade) => (
              <span
                key={trade.id}
                className="h-1.5 flex-1 rounded-full"
                style={{ background: outcomeColor(trade.outcome) }}
                title={`${trade.symbol} ${trade.outcome}`}
              />
            ))}
          </div>
        </div>
      )}
    </button>
  )
}
