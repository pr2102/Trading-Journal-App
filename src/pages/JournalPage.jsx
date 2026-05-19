import { useState } from 'react'
import { DayJournal } from '../components/DayJournal'
import { TradingCalendar } from '../components/TradingCalendar'

export function JournalPage() {
  const [view, setView] = useState('Month')

  return (
    <div className="grid gap-5">
      <TradingCalendar view={view} setView={setView} />
      <DayJournal />
    </div>
  )
}
