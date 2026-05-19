export const moodOptions = [
  { value: 'calm', label: 'Calm', color: '#14b8a6' },
  { value: 'patient', label: 'Patient', color: '#22c55e' },
  { value: 'focused', label: 'Focused', color: '#3b82f6' },
  { value: 'hesitant', label: 'Hesitant', color: '#a855f7' },
  { value: 'tilted', label: 'Tilted', color: '#ef4444' },
  { value: 'confident', label: 'Confident', color: '#f59e0b' },
]

export const prompts = [
  'What is the cleanest A+ setup worth waiting for today?',
  'Where can you reduce risk before increasing size?',
  'Which rule matters most in the current market regime?',
  'What invalidates your trade idea before entry?',
  'What emotional state would make you skip a trade?',
  'Where did execution differ from the plan?',
  'What lesson should tomorrow inherit from this session?',
]

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  year: 'numeric',
})

const monthFormatter = new Intl.DateTimeFormat(undefined, {
  month: 'long',
  year: 'numeric',
})

const shortMonthFormatter = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
})

export function startOfToday() {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

export function toDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function fromDateKey(key) {
  const [year, month, day] = key.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function addDays(date, amount) {
  const next = new Date(date)
  next.setDate(next.getDate() + amount)
  return next
}

export function addMonths(date, amount) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1)
}

export function sameMonth(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
}

export function formatLongDate(keyOrDate) {
  const date = typeof keyOrDate === 'string' ? fromDateKey(keyOrDate) : keyOrDate
  return dateFormatter.format(date)
}

export function formatMonth(date) {
  return monthFormatter.format(date)
}

export function formatShortDate(keyOrDate) {
  const date = typeof keyOrDate === 'string' ? fromDateKey(keyOrDate) : keyOrDate
  return shortMonthFormatter.format(date)
}

export function getMonthMatrix(monthDate) {
  const first = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1)
  const start = addDays(first, -first.getDay())
  return Array.from({ length: 42 }, (_, index) => addDays(start, index))
}

export function daysBetween(startKey, endKey) {
  const start = fromDateKey(startKey)
  const end = fromDateKey(endKey)
  return Math.round((end - start) / 86400000)
}

export function promptForDate(key) {
  const date = fromDateKey(key)
  return prompts[(date.getDate() + date.getMonth()) % prompts.length]
}

export function moodFor(value) {
  return moodOptions.find((mood) => mood.value === value) ?? moodOptions[0]
}
