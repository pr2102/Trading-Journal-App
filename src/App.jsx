import { useEffect } from 'react'
import { BrowserRouter, NavLink, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Activity,
  BarChart3,
  Bell,
  BookOpen,
  CalendarDays,
  Database,
  LineChart,
  Moon,
  Plus,
  Search,
  Sun,
} from 'lucide-react'
import './App.css'
import { AnalyticsPage } from './pages/AnalyticsPage'
import { DashboardPage } from './pages/DashboardPage'
import { DataPage } from './pages/DataPage'
import { JournalPage } from './pages/JournalPage'
import { MarketsPage } from './pages/MarketsPage'
import { ReviewsPage } from './pages/ReviewsPage'
import { todayKey } from './lib/date'
import { useJournalStore } from './store/useJournalStore'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: Activity },
  { to: '/journal', label: 'Journal', icon: CalendarDays },
  { to: '/markets', label: 'Markets', icon: LineChart },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/reviews', label: 'Reviews', icon: BookOpen },
  { to: '/data', label: 'Data', icon: Database },
]

const MotionDiv = motion.div

function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  )
}

function AppShell() {
  const theme = useJournalStore((state) => state.theme)
  const setTheme = useJournalStore((state) => state.setTheme)
  const selectedDate = useJournalStore((state) => state.selectedDate)
  const setSelectedDate = useJournalStore((state) => state.setSelectedDate)
  const addTrade = useJournalStore((state) => state.addTrade)
  const ensureDay = useJournalStore((state) => state.ensureDay)
  const location = useLocation()

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  function quickAdd() {
    ensureDay(selectedDate)
    addTrade(selectedDate)
  }

  function requestReminder() {
    if (!('Notification' in window)) {
      window.alert('Notifications are not supported by this browser.')
      return
    }
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        new Notification('Trading journal reminder enabled', {
          body: 'Review your plan before the next session and log trades right after execution.',
        })
      }
    })
  }

  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-[var(--border)] bg-[color-mix(in_srgb,var(--panel)_92%,transparent)] p-4 backdrop-blur-xl xl:block">
        <div className="mb-8 rounded-2xl border border-[var(--border)] bg-[var(--panel-soft)] p-4">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--accent)]">Pro Journal</p>
          <h1 className="mt-2 text-2xl font-black tracking-tight">Trading Desk</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">Plan. Execute. Review. Improve.</p>
        </div>
        <nav className="grid gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition ${
                  isActive
                    ? 'bg-[linear-gradient(135deg,var(--accent),var(--accent-2))] text-white shadow-lg'
                    : 'text-[var(--muted)] hover:bg-[var(--panel-soft)] hover:text-[var(--text)]'
                }`
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="xl:pl-72">
        <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--bg)_72%,transparent)] px-4 py-3 backdrop-blur-xl sm:px-6">
          <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="rounded-2xl bg-[linear-gradient(135deg,var(--accent),var(--accent-2))] p-2 text-white xl:hidden">
                <Activity size={20} />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--accent)]">Today first</p>
                <h2 className="truncate text-xl font-black tracking-tight sm:text-2xl">Professional Trading Journal</h2>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <label className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={16} />
                <input
                  className="input w-44 rounded-full pl-9 sm:w-56"
                  type="date"
                  value={selectedDate}
                  onChange={(event) => setSelectedDate(event.target.value)}
                  aria-label="Jump to trading date"
                />
              </label>
              <button className="btn" type="button" onClick={() => setSelectedDate(todayKey())}>
                Today
              </button>
              <button className="btn" type="button" onClick={requestReminder} aria-label="Enable reminder">
                <Bell size={16} />
              </button>
              <button className="btn" type="button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                {theme === 'dark' ? 'Light' : 'Dark'}
              </button>
            </div>
          </div>
        </header>

        <nav className="grid grid-cols-3 gap-2 border-b border-[var(--border)] bg-[var(--panel)] p-2 xl:hidden">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center justify-center gap-2 rounded-xl px-2 py-2 text-xs font-bold ${
                  isActive ? 'bg-[var(--accent)] text-white' : 'text-[var(--muted)]'
                }`
              }
            >
              <item.icon size={15} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <main className="mx-auto max-w-[1500px] px-4 py-5 sm:px-6">
          <AnimatePresence mode="wait">
            <MotionDiv
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              <Routes location={location}>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/journal" element={<JournalPage />} />
                <Route path="/markets" element={<MarketsPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/reviews" element={<ReviewsPage />} />
                <Route path="/data" element={<DataPage />} />
              </Routes>
            </MotionDiv>
          </AnimatePresence>
        </main>
      </div>

      <button
        type="button"
        className="fixed bottom-5 right-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--accent),var(--accent-2))] text-white shadow-2xl transition hover:-translate-y-1"
        onClick={quickAdd}
        aria-label="Quick add trade"
      >
        <Plus size={24} />
      </button>
    </div>
  )
}

export default App
