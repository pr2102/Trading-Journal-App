import { formatDate } from './date'
import { calcTrade, numberValue, tradeQuality } from './tradeMath'

export function allTrades(days) {
  return Object.values(days)
    .flatMap((day) => day.trades.map((trade) => calcTrade({ ...trade, date: day.date })))
    .sort((a, b) => `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`))
}

export function buildAnalytics(days) {
  const trades = allTrades(days)
  const closed = trades.filter((trade) => trade.outcome !== 'Open')
  const wins = closed.filter((trade) => trade.pnl > 0)
  const losses = closed.filter((trade) => trade.pnl < 0)
  const grossProfit = wins.reduce((sum, trade) => sum + trade.pnl, 0)
  const grossLoss = Math.abs(losses.reduce((sum, trade) => sum + trade.pnl, 0))
  const netPnl = closed.reduce((sum, trade) => sum + trade.pnl, 0)
  const averageWin = wins.length ? grossProfit / wins.length : 0
  const averageLoss = losses.length ? grossLoss / losses.length : 0
  const winRate = closed.length ? (wins.length / closed.length) * 100 : 0
  const expectancy = closed.length ? netPnl / closed.length : 0
  const averageR = closed.length ? closed.reduce((sum, trade) => sum + trade.rMultiple, 0) / closed.length : 0
  const equityCurve = buildEquityCurve(closed)
  const maxDrawdown = calculateMaxDrawdown(equityCurve)
  const sharpe = calculateSharpe(closed)
  const consistencyScore = Math.round(
    Math.max(0, Math.min(100, winRate * 0.35 + Math.max(0, averageR) * 18 + averageQuality(closed) * 4.5)),
  )

  return {
    trades,
    closed,
    totalTrades: trades.length,
    winRate,
    profitFactor: grossLoss ? grossProfit / grossLoss : grossProfit ? 99 : 0,
    averageR,
    averageWin,
    averageLoss,
    expectancy,
    maxDrawdown,
    netPnl,
    sharpe,
    consistencyScore,
    streaks: buildStreaks(closed),
    equityCurve,
    drawdownCurve: buildDrawdownCurve(equityCurve),
    monthlyPnl: groupBy(closed, (trade) => trade.date.slice(0, 7)),
    bySymbol: groupBy(closed, (trade) => trade.symbol),
    byStrategy: groupBy(closed, (trade) => trade.strategy),
    bySetup: groupBy(closed, (trade) => trade.setupType),
    bySession: groupBy(closed, (trade) => trade.session),
    byWeekday: groupBy(closed, (trade) => formatDate(trade.date, { weekday: 'short' })),
    longShort: groupBy(closed, (trade) => trade.direction),
    rDistribution: buildRDistribution(closed),
    mistakePatterns: buildMistakes(closed),
    emotionalCorrelation: groupBy(closed, (trade) => trade.emotionalBefore),
  }
}

function buildEquityCurve(trades) {
  let running = 0
  return trades
    .slice()
    .reverse()
    .map((trade) => {
      running += trade.pnl
      return { name: trade.date, value: running, pnl: trade.pnl }
    })
}

function calculateMaxDrawdown(curve) {
  let peak = 0
  let maxDrawdown = 0
  curve.forEach((point) => {
    peak = Math.max(peak, point.value)
    maxDrawdown = Math.min(maxDrawdown, point.value - peak)
  })
  return maxDrawdown
}

function buildDrawdownCurve(curve) {
  let peak = 0
  return curve.map((point) => {
    peak = Math.max(peak, point.value)
    return { name: point.name, value: point.value - peak }
  })
}

function calculateSharpe(trades) {
  if (trades.length < 2) return 0
  const returns = trades.map((trade) => trade.rMultiple)
  const average = returns.reduce((sum, item) => sum + item, 0) / returns.length
  const variance = returns.reduce((sum, item) => sum + (item - average) ** 2, 0) / (returns.length - 1)
  const std = Math.sqrt(variance)
  return std ? average / std : 0
}

function averageQuality(trades) {
  if (!trades.length) return 0
  return trades.reduce((sum, trade) => sum + tradeQuality(trade), 0) / trades.length
}

function buildStreaks(trades) {
  let current = 0
  let currentType = ''
  let bestWin = 0
  let worstLoss = 0
  trades
    .slice()
    .reverse()
    .forEach((trade) => {
      const type = trade.pnl > 0 ? 'win' : trade.pnl < 0 ? 'loss' : 'flat'
      current = type === currentType ? current + 1 : 1
      currentType = type
      if (type === 'win') bestWin = Math.max(bestWin, current)
      if (type === 'loss') worstLoss = Math.max(worstLoss, current)
    })
  return { current, currentType, bestWin, worstLoss }
}

function groupBy(trades, getKey) {
  const grouped = trades.reduce((items, trade) => {
    const key = getKey(trade) || 'Unlabeled'
    if (!items[key]) items[key] = { name: key, trades: 0, pnl: 0, wins: 0, r: 0 }
    items[key].trades += 1
    items[key].pnl += trade.pnl
    items[key].r += trade.rMultiple
    if (trade.pnl > 0) items[key].wins += 1
    return items
  }, {})
  return Object.values(grouped)
    .map((item) => ({ ...item, winRate: item.trades ? (item.wins / item.trades) * 100 : 0 }))
    .sort((a, b) => b.pnl - a.pnl)
}

function buildRDistribution(trades) {
  const buckets = [
    { name: '< -2R', min: -Infinity, max: -2, count: 0 },
    { name: '-2R to -1R', min: -2, max: -1, count: 0 },
    { name: '-1R to 0', min: -1, max: 0, count: 0 },
    { name: '0 to 1R', min: 0, max: 1, count: 0 },
    { name: '1R to 2R', min: 1, max: 2, count: 0 },
    { name: '> 2R', min: 2, max: Infinity, count: 0 },
  ]
  trades.forEach((trade) => {
    const bucket = buckets.find((item) => numberValue(trade.rMultiple) >= item.min && numberValue(trade.rMultiple) < item.max)
    if (bucket) bucket.count += 1
  })
  return buckets
}

function buildMistakes(trades) {
  const violations = trades.flatMap((trade) => trade.ruleViolations || [])
  return Object.values(
    violations.reduce((items, violation) => {
      if (!items[violation]) items[violation] = { name: violation, count: 0 }
      items[violation].count += 1
      return items
    }, {}),
  ).sort((a, b) => b.count - a.count)
}
