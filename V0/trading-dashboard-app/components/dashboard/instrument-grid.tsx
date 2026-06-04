"use client"

import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface InstrumentData {
  ticker: string
  name: string
  spread: number
  spreadUnit: string
  trend: 'up' | 'down'
  trendPercent: number
  volatility: 'Low' | 'Medium' | 'High' | 'Extreme'
  affected?: boolean
  blockedSpread?: number
  sparkline: number[]
}

const instruments: InstrumentData[] = [
  {
    ticker: 'EUR/USD',
    name: 'Euro / US Dollar',
    spread: 0.8,
    spreadUnit: 'pips',
    trend: 'up',
    trendPercent: 0.12,
    volatility: 'Low',
    sparkline: [10, 12, 11, 14, 13, 15, 14, 16, 15, 17]
  },
  {
    ticker: 'GBP/USD',
    name: 'British Pound / US Dollar',
    spread: 3.5,
    spreadUnit: 'pips',
    trend: 'down',
    trendPercent: -0.45,
    volatility: 'Extreme',
    affected: true,
    blockedSpread: 3.5,
    sparkline: [20, 18, 22, 17, 25, 15, 28, 12, 30, 10]
  },
  {
    ticker: 'USD/JPY',
    name: 'US Dollar / Japanese Yen',
    spread: 1.0,
    spreadUnit: 'pips',
    trend: 'up',
    trendPercent: 0.08,
    volatility: 'Medium',
    sparkline: [8, 9, 8, 10, 9, 11, 10, 12, 11, 13]
  },
  {
    ticker: 'AUD/USD',
    name: 'Australian Dollar / US Dollar',
    spread: 1.2,
    spreadUnit: 'pips',
    trend: 'down',
    trendPercent: -0.15,
    volatility: 'Low',
    sparkline: [15, 14, 16, 13, 15, 12, 14, 11, 13, 10]
  },
  {
    ticker: 'USD/CAD',
    name: 'US Dollar / Canadian Dollar',
    spread: 1.4,
    spreadUnit: 'pips',
    trend: 'up',
    trendPercent: 0.22,
    volatility: 'Medium',
    sparkline: [12, 13, 12, 14, 13, 15, 14, 16, 15, 17]
  },
  {
    ticker: 'NZD/USD',
    name: 'New Zealand Dollar / US Dollar',
    spread: 1.6,
    spreadUnit: 'pips',
    trend: 'up',
    trendPercent: 0.18,
    volatility: 'Low',
    sparkline: [9, 10, 9, 11, 10, 12, 11, 13, 12, 14]
  },
]

function Sparkline({ data, trend }: { data: number[], trend: 'up' | 'down' }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const height = 30
  const width = 80

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width
    const y = height - ((value - min) / range) * height
    return `${x},${y}`
  }).join(' ')

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        fill="none"
        stroke={trend === 'up' ? 'var(--success)' : 'var(--destructive)'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  )
}

export function InstrumentGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {instruments.map((instrument) => (
        <InstrumentCard key={instrument.ticker} data={instrument} />
      ))}
    </div>
  )
}

function InstrumentCard({ data }: { data: InstrumentData }) {
  const TrendIcon = data.trend === 'up' ? TrendingUp : TrendingDown

  return (
    <div
      className={cn(
        "glass rounded-2xl p-5 transition-all duration-300 hover:scale-[1.02]",
        data.affected && "border-destructive border-2 pulse-red"
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-heading text-lg font-semibold text-foreground">{data.ticker}</h3>
          <p className="text-xs text-muted-foreground">{data.name}</p>
        </div>
        {data.affected ? (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-destructive/20 text-destructive">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span className="text-[10px] font-semibold uppercase">High Risk</span>
          </div>
        ) : (
          <div className={cn(
            "px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase",
            data.volatility === 'Low' && "bg-success/20 text-success",
            data.volatility === 'Medium' && "bg-amber-500/20 text-amber-500",
            data.volatility === 'High' && "bg-destructive/20 text-destructive"
          )}>
            {data.volatility}
          </div>
        )}
      </div>

      {/* Affected Warning */}
      {data.affected && (
        <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/30">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-4 h-4 text-destructive" />
            <span className="text-xs font-semibold text-destructive uppercase">Affected - High Risk</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Spread Blocked: <span className="text-destructive font-mono">{data.blockedSpread} pips</span>
          </p>
          <p className="text-xs text-muted-foreground">
            Expected Volatility: <span className="text-destructive font-semibold">{data.volatility}</span>
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="flex items-end justify-between">
        <div className="space-y-2">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Spread</p>
            <p className="text-xl font-heading font-semibold text-foreground">
              {data.spread} <span className="text-sm text-muted-foreground">{data.spreadUnit}</span>
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <TrendIcon className={cn(
              "w-4 h-4",
              data.trend === 'up' ? "text-success" : "text-destructive"
            )} />
            <span className={cn(
              "text-sm font-mono",
              data.trend === 'up' ? "text-success" : "text-destructive"
            )}>
              {data.trendPercent > 0 ? '+' : ''}{data.trendPercent}%
            </span>
          </div>
        </div>

        {/* Sparkline */}
        <div className="opacity-80">
          <Sparkline data={data.sparkline} trend={data.trend} />
        </div>
      </div>
    </div>
  )
}
