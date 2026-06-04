"use client"

import { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown, AlertTriangle, Loader2, WifiOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useBackendState, useBackendConfig, ConfigInstrument } from '@/hooks/use-backend-state'

// ─── Spread estimates by instrument (fixed values, slight random variation) ────
const BASE_SPREADS: Record<string, { spread: number; unit: string }> = {
  // Forex
  'EURUSD':     { spread: 0.8, unit: 'pips' },
  'GBPUSD':     { spread: 1.2, unit: 'pips' },
  'USDJPY':     { spread: 0.9, unit: 'pips' },
  'EURJPY':     { spread: 1.4, unit: 'pips' },
  'GBPJPY':     { spread: 2.0, unit: 'pips' },
  // Metals & Energy
  'XAUUSD':     { spread: 0.20, unit: 'USD' },
  'XAGUSD':     { spread: 0.030, unit: 'USD' },
  'WTI':        { spread: 0.03, unit: 'USD' },
  // Indices USA
  '#US30':      { spread: 1.8, unit: 'pts' },
  '#USSPX500':  { spread: 0.4, unit: 'pts' },
  '#USNDAQ100': { spread: 0.6, unit: 'pts' },
  // Indices Europa
  '#Garmany40': { spread: 1.0, unit: 'pts' },
  '#UK100':     { spread: 1.2, unit: 'pts' },
  '#france40':  { spread: 1.5, unit: 'pts' },
  // Crypto
  'BTC':        { spread: 25, unit: 'USD' },
}

function getSpread(ticker: string): { spread: number; unit: string } {
  const base = BASE_SPREADS[ticker] ?? { spread: 1.0, unit: 'pips' }
  // Subtle random variation (±5%) to simulate live feed feel
  const jitter = 1 + (Math.random() - 0.5) * 0.1
  return {
    spread: Math.round(base.spread * jitter * 1000) / 1000,
    unit: base.unit,
  }
}

function getCurrencyColor(currency: string) {
  const map: Record<string, string> = {
    USD: 'bg-primary/20 text-primary',
    EUR: 'bg-amber-500/20 text-amber-500',
    GBP: 'bg-violet-500/20 text-violet-500',
    JPY: 'bg-rose-500/20 text-rose-500',
    AUD: 'bg-emerald-500/20 text-emerald-500',
    CAD: 'bg-orange-500/20 text-orange-500',
    CHF: 'bg-sky-500/20 text-sky-500',
    NZD: 'bg-teal-500/20 text-teal-500',
    XAU: 'bg-yellow-500/20 text-yellow-500',
    BTC: 'bg-orange-600/20 text-orange-400',
  }
  return map[currency] ?? 'bg-muted/20 text-muted-foreground'
}

function generateSparkline(seed: string, affected: boolean): number[] {
  // Deterministic-ish sparkline based on ticker string
  const base = seed.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  return Array.from({ length: 10 }, (_, i) => {
    const val = ((base * (i + 1) * 2654435761) % 100) / 100
    return affected
      ? 10 + val * 25 + Math.abs(Math.sin(i) * 15) // more erratic when affected
      : 8 + val * 12
  })
}

function Sparkline({ data, trend }: { data: number[]; trend: 'up' | 'down' }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const height = 30
  const width = 80

  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * width
      const y = height - ((value - min) / range) * height
      return `${x},${y}`
    })
    .join(' ')

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

function InstrumentCard({
  instrument,
  isAffected,
  dangerCurrencies,
}: {
  instrument: ConfigInstrument
  isAffected: boolean
  dangerCurrencies: string[]
}) {
  const { ticker, groupName, currencies } = instrument
  const [spreadData, setSpreadData] = useState(() => getSpread(ticker))
  const [trend] = useState<'up' | 'down'>(() => (Math.random() > 0.5 ? 'up' : 'down'))
  const [trendPct] = useState(() => parseFloat(((Math.random() - 0.5) * 0.6).toFixed(2)))
  const sparkline = generateSparkline(ticker, isAffected)

  // Refresh spread with subtle jitter every 15s
  useEffect(() => {
    const id = setInterval(() => {
      setSpreadData(getSpread(ticker))
    }, 15000)
    return () => clearInterval(id)
  }, [ticker])

  // Affected currencies label
  const activeDangers = currencies.filter(c => dangerCurrencies.includes(c))
  const TrendIcon = trend === 'up' ? TrendingUp : TrendingDown

  return (
    <div
      className={cn(
        'glass rounded-2xl p-5 transition-all duration-300 hover:scale-[1.02]',
        isAffected && 'border-destructive border-2 pulse-red'
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-heading text-base font-semibold text-foreground font-mono">
            {ticker}
          </h3>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{groupName}</p>
        </div>
        {isAffected ? (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-destructive/20 text-destructive">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span className="text-[10px] font-semibold uppercase">High Risk</span>
          </div>
        ) : (
          <div className="px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase bg-success/20 text-success">
            Safe
          </div>
        )}
      </div>

      {/* Currency badges */}
      <div className="flex gap-1 mb-3 flex-wrap">
        {currencies.map(c => (
          <span
            key={c}
            className={cn(
              'px-1.5 py-0.5 rounded text-[9px] font-bold uppercase',
              getCurrencyColor(c),
              dangerCurrencies.includes(c) && 'ring-1 ring-destructive/50'
            )}
          >
            {c}
          </span>
        ))}
      </div>

      {/* AFFECTED WARNING */}
      {isAffected && (
        <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/30">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-4 h-4 text-destructive" />
            <span className="text-xs font-semibold text-destructive uppercase">
              Affected — High Risk
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Currencies in danger:{' '}
            <span className="text-destructive font-semibold">
              {activeDangers.join(', ')}
            </span>
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Spread blocked:{' '}
            <span className="text-destructive font-mono">
              {spreadData.spread} {spreadData.unit}
            </span>
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="flex items-end justify-between">
        <div className="space-y-1.5">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Spread</p>
            <p className="text-xl font-heading font-semibold text-foreground">
              {spreadData.spread}{' '}
              <span className="text-sm text-muted-foreground">{spreadData.unit}</span>
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <TrendIcon
              className={cn('w-4 h-4', trend === 'up' ? 'text-success' : 'text-destructive')}
            />
            <span
              className={cn(
                'text-sm font-mono',
                trend === 'up' ? 'text-success' : 'text-destructive'
              )}
            >
              {trendPct > 0 ? '+' : ''}
              {trendPct}%
            </span>
          </div>
        </div>

        {/* Sparkline */}
        <div className="opacity-80">
          <Sparkline data={sparkline} trend={trend} />
        </div>
      </div>
    </div>
  )
}

function GroupSection({
  groupName,
  instruments,
  dangerCurrencies,
}: {
  groupName: string
  instruments: ConfigInstrument[]
  dangerCurrencies: string[]
}) {
  return (
    <div className="mb-6">
      <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 px-1">
        {groupName}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {instruments.map(inst => {
          const isAffected = inst.currencies.some(c => dangerCurrencies.includes(c))
          return (
            <InstrumentCard
              key={inst.ticker}
              instrument={inst}
              isAffected={isAffected}
              dangerCurrencies={dangerCurrencies}
            />
          )
        })}
      </div>
    </div>
  )
}

export function InstrumentGrid({ filter = 'all' }: { filter?: 'all' | 'safe' | 'affected' }) {
  const { state, loading, fetchError } = useBackendState(30000)
  const { config, loading: configLoading } = useBackendConfig()

  if (loading || configLoading) {
    return (
      <div className="flex items-center justify-center h-48 gap-3 text-muted-foreground">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-sm">Loading instruments...</span>
      </div>
    )
  }

  if (fetchError && !config) {
    return (
      <div className="flex flex-col items-center justify-center h-48 gap-3 text-destructive">
        <WifiOff className="w-8 h-8" />
        <p className="text-sm font-medium">Cannot reach backend</p>
        <p className="text-xs text-muted-foreground">{fetchError}</p>
      </div>
    )
  }

  if (!config) return null

  // Group instruments for display
  const dangerCurrencies = state.dangerCurrencies ?? []
  const groupedInstruments: Record<string, ConfigInstrument[]> = {}
  
  config.instruments.forEach(inst => {
    const isAffected = inst.currencies.some(c => dangerCurrencies.includes(c))
    
    // Apply risk filter
    if (filter === 'safe' && isAffected) return
    if (filter === 'affected' && !isAffected) return

    if (!groupedInstruments[inst.groupName]) {
      groupedInstruments[inst.groupName] = []
    }
    groupedInstruments[inst.groupName].push(inst)
  })

  const hasAffected = config.instruments.some(inst =>
    inst.currencies.some(c => dangerCurrencies.includes(c))
  )

  return (
    <div>
      {/* Alert banner when danger exists */}
      {hasAffected && (
        <div className="mb-5 p-4 rounded-xl bg-destructive/10 border border-destructive/40 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-destructive shrink-0" />
          <div>
            <p className="text-sm font-semibold text-destructive">
              High-Impact News Active — Danger Window (±60 min)
            </p>
            <p className="text-xs text-muted-foreground">
              Currencies affected:{' '}
              <span className="text-destructive font-mono">
                {dangerCurrencies.join(', ')}
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Instrument groups */}
      {Object.entries(groupedInstruments).map(([groupName, instruments]) => (
        <GroupSection
          key={groupName}
          groupName={groupName}
          instruments={instruments}
          dangerCurrencies={dangerCurrencies}
        />
      ))}

      {/* Backend error overlay (non-blocking) */}
      {fetchError && (
        <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2">
          <WifiOff className="w-4 h-4 text-amber-500 shrink-0" />
          <p className="text-xs text-amber-500">
            State refresh failed: {fetchError}. Showing cached data.
          </p>
        </div>
      )}
    </div>
  )
}
