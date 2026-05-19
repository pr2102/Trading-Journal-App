export function applyTradeFilters(trades, filters) {
  const keyword = filters.keyword.trim().toLowerCase()
  const filtered = trades.filter((trade) => {
    const text = [
      trade.symbol,
      trade.strategy,
      trade.setupType,
      trade.thesis,
      trade.reasonTaken,
      trade.whatHappened,
      trade.lessons,
      trade.mistakes,
      ...(trade.tags ?? []),
    ]
      .join(' ')
      .toLowerCase()

    return (
      (!keyword || text.includes(keyword)) &&
      (!filters.symbol || trade.symbol.toLowerCase().includes(filters.symbol.toLowerCase())) &&
      (!filters.strategy || trade.strategy === filters.strategy) &&
      (!filters.tag || (trade.tags ?? []).some((tag) => tag.toLowerCase().includes(filters.tag.toLowerCase()))) &&
      (!filters.outcome || trade.outcome === filters.outcome) &&
      (!filters.session || trade.session === filters.session) &&
      (!filters.direction || trade.direction === filters.direction) &&
      (!filters.emotion || [trade.emotionalBefore, trade.emotionalDuring, trade.emotionalAfter].includes(filters.emotion)) &&
      (!filters.setupType || trade.setupType.toLowerCase().includes(filters.setupType.toLowerCase())) &&
      (!filters.from || trade.date >= filters.from) &&
      (!filters.to || trade.date <= filters.to)
    )
  })

  return filtered.sort((a, b) => {
    if (filters.sort === 'Oldest') return `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`)
    if (filters.sort === 'Best trade' || filters.sort === 'Biggest profit') return b.pnl - a.pnl
    if (filters.sort === 'Worst trade' || filters.sort === 'Biggest loss') return a.pnl - b.pnl
    if (filters.sort === 'Highest R') return b.rMultiple - a.rMultiple
    return `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`)
  })
}
