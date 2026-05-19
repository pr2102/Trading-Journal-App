export const outcomes = ['Win', 'Loss', 'Breakeven', 'Open']
export const moods = ['Calm', 'Focused', 'Confident', 'Hesitant', 'FOMO', 'Tilted', 'Patient']
export const sessions = ['Asia', 'London', 'New York', 'Overlap', 'Crypto 24/7']
export const strategies = ['ICT', 'SMC', 'Breakout', 'Pullback', 'Reversal', 'Trend Continuation', 'News Reaction']
export const markets = ['Forex', 'Metals', 'Crypto', 'Indices', 'Stocks']

export function numberValue(value) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

export function currency(value) {
  const amount = numberValue(value)
  const sign = amount > 0 ? '+' : amount < 0 ? '-' : ''
  return `${sign}$${Math.abs(amount).toLocaleString(undefined, { maximumFractionDigits: 2 })}`
}

export function percent(value) {
  const amount = numberValue(value)
  const sign = amount > 0 ? '+' : ''
  return `${sign}${amount.toFixed(2)}%`
}

export function rLabel(value) {
  const amount = numberValue(value)
  const sign = amount > 0 ? '+' : ''
  return `${sign}${amount.toFixed(2)}R`
}

export function calcTrade(trade) {
  const entry = numberValue(trade.entryPrice)
  const exit = numberValue(trade.exitPrice)
  const stop = numberValue(trade.stopLoss)
  const tp = numberValue(trade.takeProfit)
  const size = numberValue(trade.positionSize)
  const fees = numberValue(trade.fees)
  const slippage = numberValue(trade.slippage)
  const direction = trade.direction === 'Short' ? -1 : 1
  const gross = entry && exit && size ? (exit - entry) * size * direction : numberValue(trade.pnl)
  const pnl = gross - fees - slippage
  const riskPerUnit = entry && stop ? Math.abs(entry - stop) : 0
  const riskAmount = numberValue(trade.riskAmount) || riskPerUnit * Math.abs(size)
  const rewardPerUnit = entry && tp ? Math.abs(tp - entry) : 0
  const rewardAmount = numberValue(trade.rewardAmount) || rewardPerUnit * Math.abs(size)
  const rMultiple = riskAmount ? pnl / riskAmount : numberValue(trade.rMultiple)
  const riskReward = riskAmount ? rewardAmount / riskAmount : numberValue(trade.riskReward)
  const pnlPercent = entry && size ? (pnl / Math.abs(entry * size)) * 100 : numberValue(trade.pnlPercent)
  const outcome = trade.outcome && trade.outcome !== 'Open' ? trade.outcome : pnl > 0 ? 'Win' : pnl < 0 ? 'Loss' : 'Breakeven'

  return {
    ...trade,
    pnl,
    riskAmount,
    rewardAmount,
    rMultiple,
    riskReward,
    pnlPercent,
    outcome,
  }
}

export function outcomeColor(outcome) {
  if (outcome === 'Win') return 'var(--profit)'
  if (outcome === 'Loss') return 'var(--loss)'
  if (outcome === 'Breakeven') return 'var(--warning)'
  return 'var(--muted)'
}

export function tradeQuality(trade) {
  const scores = [
    numberValue(trade.confidenceScore),
    10 - Math.abs(numberValue(trade.fearGreedScale) - 5),
    numberValue(trade.disciplineScore),
  ]
  const base = scores.reduce((sum, item) => sum + item, 0) / scores.length
  const penalty = trade.ruleViolations?.length ? trade.ruleViolations.length * 1.2 : 0
  return Math.max(0, Math.min(10, base - penalty))
}
