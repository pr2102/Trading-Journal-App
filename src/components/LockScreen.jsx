import { useState } from 'react'

export default function LockScreen({ hasPasscode, onUnlock, onCreatePasscode }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState('')

  function submit(event) {
    event.preventDefault()
    if (value.trim().length < 4) {
      setError('Use at least 4 characters.')
      return
    }
    const ok = hasPasscode ? onUnlock(value) : onCreatePasscode(value)
    if (!ok) setError('Passcode did not match.')
  }

  return (
    <main className="lock-screen">
      <form className="surface lock-card" onSubmit={submit}>
        <p className="eyebrow">Private journal</p>
        <h1>{hasPasscode ? 'Welcome back' : 'Create a lock'}</h1>
        <p>
          {hasPasscode
            ? 'Enter your passcode to open your local journal.'
            : 'Add a simple local passcode before you begin.'}
        </p>
        <label className="field">
          <span>Passcode</span>
          <input
            type="password"
            value={value}
            onChange={(event) => {
              setValue(event.target.value)
              setError('')
            }}
            autoFocus
          />
        </label>
        {error && <p className="form-error">{error}</p>}
        <button type="submit" className="primary-button">
          {hasPasscode ? 'Unlock' : 'Create lock'}
        </button>
      </form>
    </main>
  )
}
