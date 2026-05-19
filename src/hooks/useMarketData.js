import { useEffect, useMemo, useState } from 'react'

const QUOTE_REFRESH_MS = 1000
const TWELVE_DATA_API_KEY = import.meta.env.VITE_TWELVEDATA_API_KEY

const basePrices = {
  XAUUSD: 2388.42,
  EURUSD: 1.0842,
  BTCUSD: 68420,
  NQ: 18742,
  ES: 5290,
  AAPL: 214.2,
}

const twelveDataSymbols = {
  XAUUSD: 'XAU/USD',
  EURUSD: 'EUR/USD',
  BTCUSD: 'BTC/USD',
  NQ: 'NQ',
  ES: 'ES',
  AAPL: 'AAPL',
}

export function useMarketData(symbol) {
  const seed = basePrices[symbol] ?? 100
  const [tick, setTick] = useState(() => makeInitialTick(seed, symbol))

  useEffect(() => {
    let ignore = false
    let controller = null

    async function refreshLiveQuote() {
      if (!TWELVE_DATA_API_KEY) {
        setTick((current) => makeDemoTick(current, seed))
        return
      }

      controller?.abort()
      controller = new AbortController()

      try {
        const quote = await fetchTwelveDataQuote(symbol, controller.signal)
        if (!ignore && quote) setTick(quote)
      } catch {
        if (!ignore) setTick((current) => makeDemoTick(current, seed))
      }
    }

    refreshLiveQuote()
    const id = window.setInterval(() => {
      refreshLiveQuote()
    }, QUOTE_REFRESH_MS)

    return () => {
      ignore = true
      controller?.abort()
      window.clearInterval(id)
    }
  }, [seed, symbol])

  return useMemo(() => {
    const change = tick.price - tick.open
    return {
      ...tick,
      change,
      changePercent: (change / tick.open) * 100,
    }
  }, [tick])
}

function makeInitialTick(seed, symbol) {
  return {
    price: seed,
    open: seed * 0.997,
    high: seed * 1.006,
    low: seed * 0.992,
    spread: symbol === 'XAUUSD' ? 0.18 : seed * 0.00008,
    volume: 128420,
    atr: seed * 0.006,
    sentiment: 'Neutral bullish',
    updatedAt: new Date(),
  }
}

function makeDemoTick(current, seed) {
  const pulse = (Math.random() - 0.48) * (seed * 0.0018)
  const price = Math.max(seed * 0.4, current.price + pulse)
  const high = Math.max(current.high, price)
  const low = Math.min(current.low, price)
  const change = price - current.open

  return {
    ...current,
    price,
    high,
    low,
    spread: Math.max(0.01, current.spread + (Math.random() - 0.5) * current.spread * 0.1),
    volume: current.volume + Math.round(Math.random() * 900),
    atr: current.atr + (Math.random() - 0.5) * current.atr * 0.04,
    sentiment: change > seed * 0.003 ? 'Bullish momentum' : change < -seed * 0.003 ? 'Bearish pressure' : 'Balanced',
    updatedAt: new Date(),
  }
}

async function fetchTwelveDataQuote(symbol, signal) {
  const providerSymbol = twelveDataSymbols[symbol] ?? symbol
  const url = new URL('https://api.twelvedata.com/quote')
  url.searchParams.set('symbol', providerSymbol)
  url.searchParams.set('apikey', TWELVE_DATA_API_KEY)

  const response = await fetch(url, { signal })
  if (!response.ok) throw new Error('Quote request failed')

  const data = await response.json()
  if (data.status === 'error') throw new Error(data.message || 'Quote provider error')

  const price = Number(data.close ?? data.price ?? data.previous_close)
  const open = Number(data.open ?? data.previous_close ?? price)
  const high = Number(data.high ?? price)
  const low = Number(data.low ?? price)
  const volume = Number(data.volume ?? 0)
  const change = Number(data.change ?? price - open)

  if (!Number.isFinite(price)) return null

  return {
    price,
    open,
    high,
    low,
    spread: Math.max(0.01, Math.abs(high - low) * 0.002),
    volume,
    atr: Math.abs(high - low),
    sentiment: change > 0 ? 'Bullish momentum' : change < 0 ? 'Bearish pressure' : 'Balanced',
    updatedAt: new Date(),
  }
}
