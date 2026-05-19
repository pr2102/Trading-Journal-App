import { addDays, fromDateKey, toDateKey } from '../utils/date'

const seed = [
  {
    offset: 0,
    title: 'Pre-market plan: wait for clean confirmation',
    content:
      'Bias is neutral to bullish, but only after the opening range resolves. No chasing first impulse. If price accepts above prior day high, wait for a pullback and confirm volume before entry.\n\n- Max 2 trades\n- Stop after 2R or one rule break\n- Journal immediately after exit',
    mood: 'focused',
    tags: ['plan', 'equities', 'discipline'],
    trade: {
      instrument: 'NQ',
      session: 'New York',
      direction: 'Long',
      setup: 'Pullback',
      setupQuality: 4,
      riskAmount: 150,
      rewardAmount: 300,
      pnl: 0,
      rMultiple: 0,
      result: 'planned',
      ruleScore: 5,
      plan: 'Only long after reclaim and hold above VWAP. Skip chop inside opening range.',
      mistakes: '',
      lesson: 'Patience is the edge today.',
    },
  },
  {
    offset: -1,
    title: 'A clean continuation trade',
    content:
      'Took the second pullback after the initial drive. Entry was patient, stop was logical, and I scaled out instead of trying to catch the entire move.',
    mood: 'calm',
    tags: ['execution', 'nq', 'continuation'],
    trade: {
      instrument: 'NQ',
      session: 'New York',
      direction: 'Long',
      setup: 'Continuation',
      setupQuality: 5,
      riskAmount: 175,
      rewardAmount: 420,
      pnl: 390,
      rMultiple: 2.23,
      result: 'win',
      ruleScore: 5,
      plan: 'Buy pullback into VWAP after trend confirmation.',
      mistakes: 'Exited final runner a little early.',
      lesson: 'Scale out worked. Let the last piece breathe when structure remains intact.',
    },
  },
  {
    offset: -2,
    title: 'No trade was the trade',
    content:
      'Market stayed compressed and every signal felt late. I preserved capital and avoided forcing a setup that was not there.',
    mood: 'patient',
    tags: ['discipline', 'no-trade'],
    trade: {
      instrument: 'ES',
      session: 'New York',
      direction: 'No trade',
      setup: 'Range trade',
      setupQuality: 2,
      riskAmount: 0,
      rewardAmount: 0,
      pnl: 0,
      rMultiple: 0,
      result: 'missed',
      ruleScore: 5,
      plan: 'Only trade range extremes with confirmation.',
      mistakes: '',
      lesson: 'Flat is a valid position.',
    },
  },
  {
    offset: -4,
    title: 'Revenge impulse caught early',
    content:
      'First loss was acceptable. The second idea came from frustration, not process, so I stepped away before clicking in.',
    mood: 'tilted',
    tags: ['risk', 'psychology'],
    trade: {
      instrument: 'EURUSD',
      session: 'London',
      direction: 'Short',
      setup: 'Liquidity sweep',
      setupQuality: 3,
      riskAmount: 100,
      rewardAmount: 180,
      pnl: -90,
      rMultiple: -0.9,
      result: 'loss',
      ruleScore: 3,
      plan: 'Short failed breakout into prior supply.',
      mistakes: 'Moved attention to P&L instead of structure after first loss.',
      lesson: 'Hard stop after emotional spike. Reset before next decision.',
    },
  },
  {
    offset: -7,
    title: 'BTC breakout review',
    content:
      'Breakout had volume and clean acceptance. Position size was smaller than usual, which made it easier to hold through the retest.',
    mood: 'confident',
    tags: ['crypto', 'breakout'],
    trade: {
      instrument: 'BTCUSD',
      session: 'Crypto 24/7',
      direction: 'Long',
      setup: 'Breakout',
      setupQuality: 4,
      riskAmount: 120,
      rewardAmount: 250,
      pnl: 210,
      rMultiple: 1.75,
      result: 'win',
      ruleScore: 4,
      plan: 'Enter only after candle closes above range high.',
      mistakes: 'Could have marked partial targets earlier.',
      lesson: 'Smaller size improved decision quality.',
    },
  },
]

export function getSeedEntries(todayKey) {
  const today = fromDateKey(todayKey)

  return seed.reduce((entries, item) => {
    const date = toDateKey(addDays(today, item.offset))
    entries[date] = {
      id: `seed-${date}`,
      date,
      title: item.title,
      content: item.content,
      mood: item.mood,
      tags: item.tags,
      trade: item.trade,
      attachments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    return entries
  }, {})
}
