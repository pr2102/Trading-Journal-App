import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const colors = ['#14b8a6', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#22c55e']

export function EquityCurve({ data }) {
  return (
    <ChartPanel title="Equity curve">
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="equity" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.45} />
              <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.03} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
          <XAxis dataKey="name" stroke="var(--muted)" tick={{ fontSize: 12 }} />
          <YAxis stroke="var(--muted)" tick={{ fontSize: 12 }} />
          <Tooltip contentStyle={tooltipStyle} />
          <Area type="monotone" dataKey="value" stroke="#14b8a6" strokeWidth={3} fill="url(#equity)" />
        </AreaChart>
      </ResponsiveContainer>
    </ChartPanel>
  )
}

export function DrawdownChart({ data }) {
  return (
    <ChartPanel title="Drawdown">
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data}>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
          <XAxis dataKey="name" stroke="var(--muted)" tick={{ fontSize: 12 }} />
          <YAxis stroke="var(--muted)" tick={{ fontSize: 12 }} />
          <Tooltip contentStyle={tooltipStyle} />
          <Bar dataKey="value" fill="#ef4444" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartPanel>
  )
}

export function BarBreakdown({ title, data, dataKey = 'pnl' }) {
  return (
    <ChartPanel title={title}>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
          <XAxis dataKey="name" stroke="var(--muted)" tick={{ fontSize: 12 }} />
          <YAxis stroke="var(--muted)" tick={{ fontSize: 12 }} />
          <Tooltip contentStyle={tooltipStyle} />
          <Bar dataKey={dataKey} radius={[6, 6, 0, 0]}>
            {data.map((item, index) => (
              <Cell key={item.name} fill={item[dataKey] >= 0 ? colors[index % colors.length] : '#ef4444'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartPanel>
  )
}

export function PieBreakdown({ title, data }) {
  return (
    <ChartPanel title={title}>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Tooltip contentStyle={tooltipStyle} />
          <Pie data={data} dataKey="trades" nameKey="name" innerRadius={58} outerRadius={88} paddingAngle={3}>
            {data.map((item, index) => (
              <Cell key={item.name} fill={colors[index % colors.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </ChartPanel>
  )
}

export function WinRateTrend({ data }) {
  return (
    <ChartPanel title="Win rate trend">
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data}>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
          <XAxis dataKey="name" stroke="var(--muted)" tick={{ fontSize: 12 }} />
          <YAxis stroke="var(--muted)" tick={{ fontSize: 12 }} />
          <Tooltip contentStyle={tooltipStyle} />
          <Line type="monotone" dataKey="winRate" stroke="#3b82f6" strokeWidth={3} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </ChartPanel>
  )
}

function ChartPanel({ title, children }) {
  return (
    <section className="panel rounded-2xl p-4">
      <h3 className="mb-4 text-lg font-black">{title}</h3>
      {children}
    </section>
  )
}

const tooltipStyle = {
  background: 'var(--panel)',
  border: '1px solid var(--border)',
  borderRadius: '12px',
  color: 'var(--text)',
}
