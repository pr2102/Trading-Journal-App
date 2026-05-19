export const tradeResultOptions = [
  { value: 'planned', label: 'Planned', color: '#64748b' },
  { value: 'win', label: 'Win', color: '#16a34a' },
  { value: 'loss', label: 'Loss', color: '#dc2626' },
  { value: 'breakeven', label: 'Breakeven', color: '#d97706' },
  { value: 'missed', label: 'Missed', color: '#7c3aed' },
]

export const sessionOptions = ['Pre-market', 'London', 'New York', 'Asia', 'Swing', 'Crypto 24/7']
export const directionOptions = ['Long', 'Short', 'No trade']
export const setupOptions = [
  'Breakout',
  'Pullback',
  'Reversal',
  'Continuation',
  'Liquidity sweep',
  'News reaction',
  'Range trade',
]

export const defaultTradePlan = {
  instrument: '',
  session: 'New York',
  direction: 'No trade',
  setup: '',
  setupQuality: 3,
  riskAmount: '',
  rewardAmount: '',
  pnl: '',
  rMultiple: '',
  result: 'planned',
  ruleScore: 5,
  plan: '',
  mistakes: '',
  lesson: '',
}

export function normalizeTradePlan(plan = {}) {
  return {
    ...defaultTradePlan,
    ...plan,
    setupQuality: Number(plan.setupQuality ?? defaultTradePlan.setupQuality),
    ruleScore: Number(plan.ruleScore ?? defaultTradePlan.ruleScore),
  }
}

export function resultFor(value) {
  return tradeResultOptions.find((result) => result.value === value) ?? tradeResultOptions[0]
}

export function numberValue(value) {
  if (value === '' || value === null || value === undefined) return 0
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

export function signedCurrency(value) {
  const amount = numberValue(value)
  const sign = amount > 0 ? '+' : amount < 0 ? '-' : ''
  return `${sign}$${Math.abs(amount).toLocaleString(undefined, {
    maximumFractionDigits: 2,
  })}`
}

export function signedR(value) {
  const amount = numberValue(value)
  const sign = amount > 0 ? '+' : ''
  return `${sign}${amount.toFixed(2)}R`
}

export function deriveResult(plan) {
  const pnl = numberValue(plan.pnl)
  if (plan.result && plan.result !== 'planned') return plan.result
  if (pnl > 0) return 'win'
  if (pnl < 0) return 'loss'
  return plan.result || 'planned'
}

export function calculateRMultiple(plan) {
  const risk = Math.abs(numberValue(plan.riskAmount))
  const pnl = numberValue(plan.pnl)
  if (!risk) return numberValue(plan.rMultiple)
  return pnl / risk
}
