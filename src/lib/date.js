export function todayKey() {
  return toDateKey(new Date())
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

export function monthMatrix(date) {
  const first = new Date(date.getFullYear(), date.getMonth(), 1)
  const start = addDays(first, -first.getDay())
  return Array.from({ length: 42 }, (_, index) => addDays(start, index))
}

export function sameMonth(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
}

export function formatDate(keyOrDate, options) {
  const date = typeof keyOrDate === 'string' ? fromDateKey(keyOrDate) : keyOrDate
  return new Intl.DateTimeFormat(undefined, options).format(date)
}

export function shortDate(key) {
  return formatDate(key, { month: 'short', day: 'numeric' })
}

export function longDate(key) {
  return formatDate(key, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
}

export function monthLabel(date) {
  return formatDate(date, { month: 'long', year: 'numeric' })
}

export function isSameDay(a, b) {
  return toDateKey(a) === toDateKey(b)
}
