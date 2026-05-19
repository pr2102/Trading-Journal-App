import { formatLongDate } from './date'
import { calculateRMultiple, normalizeTradePlan } from './trading'

export function downloadText(filename, content, type) {
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

export function entriesToJson(entries) {
  return JSON.stringify(Object.values(entries), null, 2)
}

export function entriesToCsv(entries) {
  const rows = Object.values(entries)
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((entry) => {
      const trade = normalizeTradePlan(entry.trade)
      return [
        entry.date,
        entry.title,
        trade.instrument,
        trade.session,
        trade.direction,
        trade.setup,
        trade.result,
        trade.pnl,
        calculateRMultiple(trade).toFixed(2),
        trade.ruleScore,
        entry.mood,
        entry.tags.join('; '),
        entry.content.replace(/\s+/g, ' ').trim(),
      ]
    })

  const escape = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`
  return [
    [
      'Date',
      'Title',
      'Instrument',
      'Session',
      'Direction',
      'Setup',
      'Result',
      'P&L',
      'R Multiple',
      'Rule Score',
      'Mood',
      'Tags',
      'Content',
    ]
      .map(escape)
      .join(','),
    ...rows.map((row) => row.map(escape).join(',')),
  ].join('\n')
}

export function printEntries(entries) {
  const rows = Object.values(entries).sort((a, b) => b.date.localeCompare(a.date))
  const printWindow = window.open('', '_blank', 'noopener,noreferrer')
  if (!printWindow) return

  printWindow.document.write(`
    <html>
      <head>
        <title>Journal Export</title>
        <style>
          body { font-family: Inter, system-ui, sans-serif; margin: 40px; color: #1f2933; }
          article { break-inside: avoid; border-bottom: 1px solid #d9dee7; padding: 20px 0; }
          h1 { margin-top: 0; }
          h2 { margin: 0 0 6px; }
          .meta { color: #667085; font-size: 13px; margin-bottom: 12px; }
          p { white-space: pre-wrap; line-height: 1.55; }
        </style>
      </head>
      <body>
        <h1>Journal Entries</h1>
        ${rows
          .map(
            (entry) => `
              <article>
                <h2>${escapeHtml(entry.title || 'Untitled')}</h2>
                <div class="meta">${escapeHtml(formatLongDate(entry.date))} - ${escapeHtml(
                  normalizeTradePlan(entry.trade).instrument || 'No instrument',
                )} - ${escapeHtml(normalizeTradePlan(entry.trade).result)} - ${escapeHtml(entry.mood)} - ${escapeHtml(
                  entry.tags.join(', '),
                )}</div>
                <p>${escapeHtml(entry.content || '')}</p>
              </article>
            `,
          )
          .join('')}
      </body>
    </html>
  `)
  printWindow.document.close()
  printWindow.focus()
  printWindow.print()
}

export function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}
