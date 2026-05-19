import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { blankTrade, defaultDay, initialTradingDays } from '../data/mockTradingData'
import { todayKey } from '../lib/date'

const initialDays = initialTradingDays.reduce((items, day) => {
  items[day.date] = day
  return items
}, {})

export const useJournalStore = create(
  persist(
    (set, get) => ({
      days: initialDays,
      selectedDate: todayKey(),
      theme: 'dark',
      symbol: 'XAUUSD',
      timeframe: '15',
      watchlist: ['XAUUSD', 'EURUSD', 'BTCUSD', 'NQ', 'ES', 'AAPL'],
      filters: {
        keyword: '',
        symbol: '',
        strategy: '',
        tag: '',
        outcome: '',
        session: '',
        direction: '',
        emotion: '',
        setupType: '',
        from: '',
        to: '',
        sort: 'Newest',
      },
      setTheme: (theme) => set({ theme }),
      setSelectedDate: (selectedDate) => set({ selectedDate }),
      setSymbol: (symbol) => set({ symbol }),
      setTimeframe: (timeframe) => set({ timeframe }),
      setFilters: (patch) => set((state) => ({ filters: { ...state.filters, ...patch } })),
      clearFilters: () =>
        set({
          filters: {
            keyword: '',
            symbol: '',
            strategy: '',
            tag: '',
            outcome: '',
            session: '',
            direction: '',
            emotion: '',
            setupType: '',
            from: '',
            to: '',
            sort: 'Newest',
          },
        }),
      ensureDay: (date) => {
        const existing = get().days[date]
        if (existing) return existing
        const day = defaultDay(date)
        set((state) => ({ days: { ...state.days, [date]: day } }))
        return day
      },
      updateDay: (date, patch) =>
        set((state) => {
          const day = state.days[date] ?? defaultDay(date)
          return { days: { ...state.days, [date]: { ...day, ...patch } } }
        }),
      updateReview: (date, section, key, value) =>
        set((state) => {
          const day = state.days[date] ?? defaultDay(date)
          return {
            days: {
              ...state.days,
              [date]: {
                ...day,
                [section]: {
                  ...day[section],
                  [key]: value,
                },
              },
            },
          }
        }),
      addTrade: (date) => {
        const trade = blankTrade(date)
        set((state) => {
          const day = state.days[date] ?? defaultDay(date)
          return { days: { ...state.days, [date]: { ...day, trades: [trade, ...day.trades] } } }
        })
        return trade.id
      },
      updateTrade: (date, tradeId, patch) =>
        set((state) => {
          const day = state.days[date] ?? defaultDay(date)
          return {
            days: {
              ...state.days,
              [date]: {
                ...day,
                trades: day.trades.map((trade) => (trade.id === tradeId ? { ...trade, ...patch } : trade)),
              },
            },
          }
        }),
      deleteTrade: (date, tradeId) =>
        set((state) => {
          const day = state.days[date] ?? defaultDay(date)
          return {
            days: {
              ...state.days,
              [date]: {
                ...day,
                trades: day.trades.filter((trade) => trade.id !== tradeId),
              },
            },
          }
        }),
      importDays: (days) =>
        set({
          days: Array.isArray(days)
            ? days.reduce((items, day) => {
                if (day.date) items[day.date] = day
                return items
              }, {})
            : days,
        }),
    }),
    {
      name: 'pro-trading-journal.v1',
      partialize: (state) => ({
        days: state.days,
        selectedDate: state.selectedDate,
        theme: state.theme,
        symbol: state.symbol,
        timeframe: state.timeframe,
        watchlist: state.watchlist,
      }),
    },
  ),
)
