# Professional Trading Journal

A production-ready React trading journal that combines a trading dashboard, calendar journal, live-market terminal, analytics engine, review workflow, and local-first data management.

## Run Locally

```bash
npm install
npm run dev
```

Open the URL printed by Vite.

Production build:

```bash
npm run build
```

Lint:

```bash
npm run lint
```

## Stack

- React 19
- Vite
- TailwindCSS v4
- React Router
- Zustand with persisted local storage
- Framer Motion
- Recharts
- Lucide icons

## Screens

- `Dashboard` - trader KPIs, live terminal, recent trades, equity and breakdown widgets.
- `Journal` - current-date calendar journal with monthly, weekly, and daily views.
- `Markets` - XAUUSD-first market terminal with TradingView chart, symbol/timeframe selector, watchlist, quote widgets, and economic calendar.
- `Analytics` - professional performance analytics, filters, trade table, equity curve, drawdown, monthly P&L, R distribution, strategy/session/setup/weekday/emotion breakdowns.
- `Reviews` - daily, weekly, and monthly structured review workflows.
- `Data` - JSON/CSV export, print/PDF, import/restore, and backend-ready architecture notes.

## Core Features

- Opens on today's date by default.
- Calendar-based trading journal with trade markers and P&L heat signals.
- Daily activity with multiple trades, pre-market plan, post-market review, mood, and performance summary.
- Full trade entry model: symbol, market, exchange, direction, entry/exit, stop, take profit, position size, risk, leverage, fees, slippage, strategy, setup, model, timeframe, session, market condition, confluence, P&L, R multiple, RR, psychology scores, notes, screenshots, tags, and rule violations.
- Live-ready market dashboard with default `XAUUSD`, TradingView integration, simulated quote ticks, spread, volume, ATR, sentiment, session high/low, watchlist, and economic calendar.
- Advanced analytics: total trades, win rate, profit factor, average R, average win/loss, expectancy, max drawdown, net profitability, Sharpe ratio, streaks, consistency score, equity curve, drawdown, monthly P&L, R distribution, and breakdowns.
- Search, filters, and sorting by symbol, strategy, tag, notes, date range, outcome, session, direction, emotion, setup, best/worst trade, highest R, newest/oldest, biggest profit/loss.
- Theme persistence with dark/light mode.
- Local-first data with a store shape ready for broker integrations, MT4/MT5 sync, Binance API, cloud accounts, AI assistant, team trading, and mobile clients.

## Structure

- `src/App.jsx` - shell, routes, navigation, theme, quick add, reminders.
- `src/pages/` - route-level screens.
- `src/components/` - reusable UI, market terminal, calendar, forms, filters, charts, tables.
- `src/store/useJournalStore.js` - Zustand persisted journal state and actions.
- `src/data/mockTradingData.js` - sample trading days and trades.
- `src/lib/analytics.js` - analytics engine.
- `src/lib/tradeMath.js` - trade calculations and finance formatting.
- `src/lib/filters.js` - search, filter, and sort system.
- `src/lib/date.js` - calendar helpers.
- `src/hooks/useMarketData.js` - live-data-ready market hook.

## Live Data Notes

The app includes a TradingView widget and a replaceable market-data hook. The quote cards currently simulate ticks locally so the app runs without API keys. To connect real data later, replace `src/hooks/useMarketData.js` with a TwelveData, Finnhub, broker, or exchange adapter.
