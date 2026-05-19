import { useMemo, useState } from 'react'
import { escapeHtml } from '../utils/exporters'
import { formatLongDate, moodOptions, promptForDate } from '../utils/date'
import {
  defaultTradePlan,
  directionOptions,
  normalizeTradePlan,
  sessionOptions,
  setupOptions,
  tradeResultOptions,
} from '../utils/trading'

const blankEntry = {
  title: '',
  content: '',
  mood: 'calm',
  tags: [],
  trade: defaultTradePlan,
  attachments: [],
}

function markdownToHtml(markdown) {
  const html = escapeHtml(markdown)
    .replace(/^### (.*)$/gm, '<h3>$1</h3>')
    .replace(/^## (.*)$/gm, '<h2>$1</h2>')
    .replace(/^# (.*)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^- (.*)$/gm, '<li>$1</li>')
    .replace(/\n/g, '<br />')

  return html.replace(/(<li>.*?<\/li>)(<br \/>)?/gs, '<ul>$1</ul>')
}

export default function EntryEditor({
  dateKey,
  entry,
  draft,
  onDraftChange,
  onSave,
  onDelete,
  autosaveLabel,
}) {
  const [mode, setMode] = useState('write')
  const value = draft ?? entry ?? blankEntry
  const trade = normalizeTradePlan(value.trade)
  const tagText = useMemo(() => (value.tags ?? []).join(', '), [value.tags])

  function update(patch) {
    onDraftChange({ ...blankEntry, ...value, ...patch, date: dateKey })
  }

  function updateTrade(patch) {
    update({ trade: { ...trade, ...patch } })
  }

  function handleAttachment(event) {
    const files = Array.from(event.target.files || [])
    files.forEach((file) => {
      if (!file.type.startsWith('image/')) return
      const reader = new FileReader()
      reader.onload = () => {
        const next = {
          id: `${Date.now()}-${file.name}`,
          name: file.name,
          type: file.type,
          dataUrl: reader.result,
        }
        update({ attachments: [...(value.attachments ?? []), next] })
      }
      reader.readAsDataURL(file)
    })
    event.target.value = ''
  }

  return (
    <section className="surface editor" aria-labelledby="entry-title">
      <div className="section-heading editor-heading">
        <div>
          <p className="eyebrow">Selected day</p>
          <h2 id="entry-title">{formatLongDate(dateKey)}</h2>
        </div>
        <span className="save-state">{autosaveLabel}</span>
      </div>

      <div className="prompt-strip">
        <span>Prompt</span>
        <p>{promptForDate(dateKey)}</p>
      </div>

      <label className="field">
        <span>Title</span>
        <input
          value={value.title ?? ''}
          onChange={(event) => update({ title: event.target.value })}
          placeholder="Pre-market plan, execution review, or trade recap"
        />
      </label>

      <div className="trade-ticket" aria-label="Trade details">
        <div className="section-heading compact">
          <div>
            <p className="eyebrow">Trade ticket</p>
            <h2>Setup and execution</h2>
          </div>
        </div>
        <div className="trade-grid">
          <label className="field">
            <span>Instrument</span>
            <input
              value={trade.instrument}
              onChange={(event) => updateTrade({ instrument: event.target.value.toUpperCase() })}
              placeholder="NQ, ES, BTCUSD"
            />
          </label>
          <label className="field">
            <span>Session</span>
            <select value={trade.session} onChange={(event) => updateTrade({ session: event.target.value })}>
              {sessionOptions.map((session) => (
                <option key={session} value={session}>
                  {session}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Direction</span>
            <select value={trade.direction} onChange={(event) => updateTrade({ direction: event.target.value })}>
              {directionOptions.map((direction) => (
                <option key={direction} value={direction}>
                  {direction}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Setup</span>
            <input
              list="setup-options"
              value={trade.setup}
              onChange={(event) => updateTrade({ setup: event.target.value })}
              placeholder="Breakout, pullback"
            />
            <datalist id="setup-options">
              {setupOptions.map((setup) => (
                <option key={setup} value={setup} />
              ))}
            </datalist>
          </label>
          <label className="field">
            <span>Result</span>
            <select value={trade.result} onChange={(event) => updateTrade({ result: event.target.value })}>
              {tradeResultOptions.map((result) => (
                <option key={result.value} value={result.value}>
                  {result.label}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Risk</span>
            <input
              type="number"
              value={trade.riskAmount}
              onChange={(event) => updateTrade({ riskAmount: event.target.value })}
              placeholder="150"
            />
          </label>
          <label className="field">
            <span>Reward target</span>
            <input
              type="number"
              value={trade.rewardAmount}
              onChange={(event) => updateTrade({ rewardAmount: event.target.value })}
              placeholder="300"
            />
          </label>
          <label className="field">
            <span>Realized P&L</span>
            <input
              type="number"
              value={trade.pnl}
              onChange={(event) => updateTrade({ pnl: event.target.value })}
              placeholder="0"
            />
          </label>
          <label className="field slider-field">
            <span>Setup quality: {trade.setupQuality}/5</span>
            <input
              type="range"
              min="1"
              max="5"
              value={trade.setupQuality}
              onChange={(event) => updateTrade({ setupQuality: event.target.value })}
            />
          </label>
          <label className="field slider-field">
            <span>Rule score: {trade.ruleScore}/5</span>
            <input
              type="range"
              min="1"
              max="5"
              value={trade.ruleScore}
              onChange={(event) => updateTrade({ ruleScore: event.target.value })}
            />
          </label>
        </div>
        <div className="trade-notes-grid">
          <label className="field">
            <span>Trade plan</span>
            <textarea
              value={trade.plan}
              onChange={(event) => updateTrade({ plan: event.target.value })}
              placeholder="Entry trigger, invalidation, target, size, and conditions to stand down."
            />
          </label>
          <label className="field">
            <span>Mistakes / rule breaks</span>
            <textarea
              value={trade.mistakes}
              onChange={(event) => updateTrade({ mistakes: event.target.value })}
              placeholder="What drifted from the plan?"
            />
          </label>
          <label className="field">
            <span>Lesson</span>
            <textarea
              value={trade.lesson}
              onChange={(event) => updateTrade({ lesson: event.target.value })}
              placeholder="What should future you repeat or avoid?"
            />
          </label>
        </div>
      </div>

      <div className="editor-meta">
        <label className="field">
          <span>Trading mood</span>
          <select value={value.mood ?? 'calm'} onChange={(event) => update({ mood: event.target.value })}>
            {moodOptions.map((mood) => (
              <option key={mood.value} value={mood.value}>
                {mood.label}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Tags</span>
          <input
            value={tagText}
            onChange={(event) =>
              update({
                tags: event.target.value
                  .split(',')
                  .map((tag) => tag.trim())
                  .filter(Boolean),
              })
            }
            placeholder="discipline, breakout, risk"
          />
        </label>
      </div>

      <div className="editor-tabs" role="tablist" aria-label="Editor mode">
        <button type="button" className={mode === 'write' ? 'active' : ''} onClick={() => setMode('write')}>
          Write
        </button>
        <button type="button" className={mode === 'preview' ? 'active' : ''} onClick={() => setMode('preview')}>
          Preview
        </button>
      </div>

      {mode === 'write' ? (
        <label className="field content-field">
          <span>Markdown</span>
          <textarea
            value={value.content ?? ''}
            onChange={(event) => update({ content: event.target.value })}
            placeholder="Review market context, execution quality, emotion, and one process improvement. Markdown supported."
          />
        </label>
      ) : (
        <div
          className="markdown-preview"
          dangerouslySetInnerHTML={{ __html: markdownToHtml(value.content || 'Nothing written yet.') }}
        />
      )}

      <div className="attachments">
        <div className="attachment-header">
          <span>Charts / screenshots</span>
          <label className="secondary-button file-button">
            Add image
            <input type="file" accept="image/*" multiple onChange={handleAttachment} />
          </label>
        </div>
        {(value.attachments ?? []).length > 0 && (
          <div className="attachment-grid">
            {value.attachments.map((attachment) => (
              <figure key={attachment.id}>
                <img src={attachment.dataUrl} alt={attachment.name} />
                <figcaption>
                  <span>{attachment.name}</span>
                  <button
                    type="button"
                    onClick={() =>
                      update({
                        attachments: value.attachments.filter((item) => item.id !== attachment.id),
                      })
                    }
                  >
                    Remove
                  </button>
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>

      <div className="editor-actions">
        <button type="button" className="primary-button" onClick={() => onSave(value)}>
          Save entry
        </button>
        <button type="button" className="danger-button" onClick={onDelete} disabled={!entry}>
          Delete
        </button>
      </div>
    </section>
  )
}
