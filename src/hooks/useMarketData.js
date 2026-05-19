import { useEffect, useMemo, useState } from 'react'

const basePrices = {
  XAUUSD: 2388.42,
  EURUSD: 1.0842,
  BTCUSD: 68420,
  NQ: 18742,
  ES: 5290,
  AAPL: 214.2,
}

export function useMarketData(symbol) {
  const seed = basePrices[symbol] ?? 100
  const [tick, setTick] = useState({
    price: seed,
    open: seed * 0.997,
    high: seed * 1.006,
    low: seed * 0.992,
    spread: symbol === 'XAUUSD' ? 0.18 : seed * 0.00008,
    volume: 128420,
    atr: seed * 0.006,
    sentiment: 'Neutral bullish',
    updatedAt: new Date(),
  })

  useEffect(() => {
    const id = window.setInterval(() => {
      setTick((current) => {
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
      })
    }, 1800)
    return () => window.clearInterval(id)
  }, [seed])

  return useMemo(() => {
    const change = tick.price - tick.open
    return {
      ...tick,
      change,
      changePercent: (change / tick.open) * 100,
    }
  }, [tick])
}
