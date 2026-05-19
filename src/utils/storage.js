import { startOfToday, toDateKey } from './date'
import { getSeedEntries } from '../data/mockEntries'

const ENTRIES_KEY = 'trader-journal.entries.v2'
const DRAFTS_KEY = 'trader-journal.drafts.v2'
const THEME_KEY = 'trader-journal.theme.v2'
const LOCK_KEY = 'trader-journal.passcode.v2'

function readJson(key, fallback) {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function loadEntries() {
  const saved = readJson(ENTRIES_KEY, null)
  if (saved && typeof saved === 'object') return saved
  return getSeedEntries(toDateKey(startOfToday()))
}

export function saveEntries(entries) {
  writeJson(ENTRIES_KEY, entries)
}

export function loadDrafts() {
  return readJson(DRAFTS_KEY, {})
}

export function saveDrafts(drafts) {
  writeJson(DRAFTS_KEY, drafts)
}

export function loadTheme() {
  return localStorage.getItem(THEME_KEY) || 'light'
}

export function saveTheme(theme) {
  localStorage.setItem(THEME_KEY, theme)
}

export function getPasscode() {
  return localStorage.getItem(LOCK_KEY) || ''
}

export function setPasscode(passcode) {
  if (passcode) localStorage.setItem(LOCK_KEY, passcode)
  else localStorage.removeItem(LOCK_KEY)
}

export function clearJournalStorage() {
  localStorage.removeItem(ENTRIES_KEY)
  localStorage.removeItem(DRAFTS_KEY)
}
