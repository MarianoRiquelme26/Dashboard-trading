"use client"

import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts'
import { TrendingUp, Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTheme } from 'next-themes'

// Equity Curve Data
const equityData = [
  { date: 'Jan 1', equity: 10000 },
  { date: 'Jan 5', equity: 10250 },
  { date: 'Jan 10', equity: 10150 },
  { date: 'Jan 15', equity: 10800 },
  { date: 'Jan 20', equity: 11200 },
  { date: 'Jan 25', equity: 10900 },
  { date: 'Feb 1', equity: 11500 },
  { date: 'Feb 5', equity: 12100 },
  { date: 'Feb 10', equity: 11800 },
  { date: 'Feb 15', equity: 12450 },
]

// Performance by Day & Hour
const dayPerformance = [
  { day: 'Mon', wins: 15, losses: 8 },
  { day: 'Tue', wins: 12, losses: 6 },
  { day: 'Wed', wins: 18, losses: 10 },
  { day: 'Thu', wins: 14, losses: 12 },
  { day: 'Fri', wins: 10, losses: 5 },
]

const hourPerformance = [
  { hour: '00-04', wins: 5, losses: 3 },
  { hour: '04-08', wins: 8, losses: 4 },
  { hour: '08-12', wins: 22, losses: 12 },
  { hour: '12-16', wins: 18, losses: 10 },
  { hour: '16-20', wins: 12, losses: 8 },
  { hour: '20-24', wins: 4, losses: 4 },
]

// Strategy Efficiency
const strategyData = [
  { name: 'Pendulo 1', profit: 2800, rMultiple: 2.4 },
  { name: 'Pendulo 2', profit: 3500, rMultiple: 2.8 },
  { name: 'SixJetSet', profit: 2200, rMultiple: 1.9 },
  { name: 'Puertas del Cielo', profit: 2950, rMultiple: 2.2 },
  { name: 'SimpleFlow', profit: 1000, rMultiple: 1.5 },
]

// Asset Rankings
const assetRankings = [
  { asset: 'EUR/USD', trades: 45, profit: 3200, drawdown: -450 },
  { asset: 'USD/JPY', trades: 38, profit: 2800, drawdown: -320 },
  { asset: 'GBP/USD', trades: 32, profit: 1500, drawdown: -890 },
  { asset: 'AUD/USD', trades: 28, profit: 2100, drawdown: -280 },
  { asset: 'USD/CAD', trades: 22, profit: 850, drawdown: -510 },
]

export function AnalyticsView() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const tooltipStyle = {
    backgroundColor: isDark ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
    border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(226, 232, 240, 0.8)',
    borderRadius: '12px',
    boxShadow: isDark ? '0 10px 40px rgba(0,0,0,0.3)' : '0 10px 40px rgba(0,0,0,0.1)'
  }

  const gridStroke = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
  const axisStroke = isDark ? '#64748b' : '#94a3b8'
  const labelColor = isDark ? '#f1f5f9' : '#0f172a'

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="font-heading text-2xl font-semibold text-foreground">Analytics</h2>
        <p className="text-muted-foreground">Comprehensive performance analysis and insights</p>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Equity Curve */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-heading text-lg font-semibold text-foreground">Equity Curve</h3>
              <p className="text-sm text-muted-foreground">Capital growth over time</p>
            </div>
            <div className="flex items-center gap-2 text-success">
              <TrendingUp className="w-5 h-5" />
              <span className="font-heading font-semibold">+24.5%</span>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={equityData}>
                <defs>
                  <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--success)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--success)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                <XAxis 
                  dataKey="date" 
                  stroke={axisStroke} 
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis 
                  stroke={axisStroke} 
                  fontSize={12}
                  tickLine={false}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  labelStyle={{ color: labelColor }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Equity']}
                />
                <Line 
                  type="monotone" 
                  dataKey="equity" 
                  stroke="var(--success)" 
                  strokeWidth={3}
                  dot={false}
                  fill="url(#equityGradient)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Performance by Day & Hour */}
        <div className="glass rounded-2xl p-6">
          <div className="mb-6">
            <h3 className="font-heading text-lg font-semibold text-foreground">Performance by Day</h3>
            <p className="text-sm text-muted-foreground">Win/Loss distribution by weekday</p>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dayPerformance} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                <XAxis 
                  dataKey="day" 
                  stroke={axisStroke} 
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis 
                  stroke={axisStroke} 
                  fontSize={12}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  labelStyle={{ color: labelColor }}
                />
                <Bar dataKey="wins" fill="var(--success)" radius={[4, 4, 0, 0]} name="Wins" />
                <Bar dataKey="losses" fill="var(--destructive)" radius={[4, 4, 0, 0]} name="Losses" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Performance by Hour */}
        <div className="glass rounded-2xl p-6">
          <div className="mb-6">
            <h3 className="font-heading text-lg font-semibold text-foreground">Performance by Hour</h3>
            <p className="text-sm text-muted-foreground">Optimal trading windows</p>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourPerformance} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                <XAxis 
                  dataKey="hour" 
                  stroke={axisStroke} 
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis 
                  stroke={axisStroke} 
                  fontSize={12}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  labelStyle={{ color: labelColor }}
                />
                <Bar dataKey="wins" fill="var(--success)" radius={[4, 4, 0, 0]} name="Wins" />
                <Bar dataKey="losses" fill="var(--destructive)" radius={[4, 4, 0, 0]} name="Losses" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Strategy Efficiency */}
        <div className="glass rounded-2xl p-6">
          <div className="mb-6">
            <h3 className="font-heading text-lg font-semibold text-foreground">Strategy Efficiency</h3>
            <p className="text-sm text-muted-foreground">Net profit by strategy</p>
          </div>
          <div className="space-y-4">
            {strategyData.sort((a, b) => b.profit - a.profit).map((strategy, index) => (
              <div key={strategy.name} className="flex items-center gap-4">
                <div className="w-6 text-center">
                  <span className={cn(
                    "text-sm font-bold",
                    index === 0 ? "text-amber-500" : "text-muted-foreground"
                  )}>
                    #{index + 1}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-foreground/80">{strategy.name}</span>
                    <span className="text-sm font-mono text-success">+${strategy.profit}</span>
                  </div>
                  <div className="h-2 bg-secondary dark:bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-success rounded-full transition-all duration-500"
                      style={{ width: `${(strategy.profit / 3500) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-end mt-1">
                    <span className="text-[10px] text-muted-foreground">R-Multiple: {strategy.rMultiple}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Asset Rankings */}
      <div className="glass rounded-2xl p-6">
        <div className="mb-6">
          <h3 className="font-heading text-lg font-semibold text-foreground">Asset Rankings</h3>
          <p className="text-sm text-muted-foreground">Performance breakdown by trading pair</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {assetRankings.map((asset, index) => (
            <div 
              key={asset.asset}
              className={cn(
                "bg-secondary/50 dark:bg-white/[0.02] rounded-xl p-4 border border-border transition-all hover:border-primary/20",
                index === 0 && "border-amber-500/30 bg-amber-500/5"
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-heading font-semibold text-foreground">{asset.asset}</span>
                {index === 0 && <Trophy className="w-4 h-4 text-amber-500" />}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Trades</span>
                  <span className="text-foreground/80">{asset.trades}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Profit</span>
                  <span className="text-success font-mono">+${asset.profit}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Drawdown</span>
                  <span className="text-destructive font-mono">${asset.drawdown}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
