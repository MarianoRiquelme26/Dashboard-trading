"use client"

import { AlertCircle, Clock, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useBackendState, NewsEvent } from '@/hooks/use-backend-state'

// Color map for currency badges
function getCurrencyClass(currency: string) {
  const map: Record<string, string> = {
    USD: 'bg-primary/20 text-primary',
    EUR: 'bg-amber-500/20 text-amber-500',
    GBP: 'bg-violet-500/20 text-violet-500',
    JPY: 'bg-rose-500/20 text-rose-500',
    AUD: 'bg-emerald-500/20 text-emerald-500',
    CAD: 'bg-orange-500/20 text-orange-500',
    CHF: 'bg-sky-500/20 text-sky-500',
    NZD: 'bg-teal-500/20 text-teal-500',
  }
  return map[currency] ?? 'bg-muted/20 text-muted-foreground'
}

// Parse ForexFactory date/time string to local time string
function parseToLocal(dateStr: string, timeStr: string): string {
  if (!dateStr || !timeStr) return '--:--'
  const t = timeStr.toLowerCase()
  if (t === 'all day' || t === 'tentative') return timeStr

  try {
    // Format from backend: MM-DD-YYYY h:mma (ET/New York)
    // We display it as local time
    const [month, day, year] = dateStr.split('-')
    const isPM = t.endsWith('pm')
    const isAM = t.endsWith('am')
    const timePart = t.replace('am', '').replace('pm', '')
    const [h, m] = timePart.split(':').map(Number)
    let hours = h
    if (isPM && h !== 12) hours += 12
    if (isAM && h === 12) hours = 0

    // Build a Date in Eastern Time offset (-5 or -4 for EDT)
    // We use a reliable trick: construct ISO string and let browser handle it
    const etOffset = -4 // EDT (summer). For EST use -5. Approximate.
    const utcDate = new Date(
      Date.UTC(Number(year), Number(month) - 1, Number(day), hours - etOffset, m)
    )
    return utcDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  } catch {
    return timeStr
  }
}

function isUpcoming(dateStr: string, timeStr: string): boolean {
  try {
    const t = timeStr.toLowerCase()
    if (t === 'all day' || t === 'tentative') return false
    const [month, day, year] = dateStr.split('-')
    const isPM = t.endsWith('pm')
    const isAM = t.endsWith('am')
    const timePart = t.replace('am', '').replace('pm', '')
    const [h, m] = timePart.split(':').map(Number)
    let hours = h
    if (isPM && h !== 12) hours += 12
    if (isAM && h === 12) hours = 0
    const etOffset = -4
    const eventUtc = new Date(
      Date.UTC(Number(year), Number(month) - 1, Number(day), hours - etOffset, m)
    )
    const diff = (eventUtc.getTime() - Date.now()) / 60000
    return diff >= 0 && diff <= 60
  } catch {
    return false
  }
}

function NewsCard({ event }: { event: NewsEvent }) {
  const localTime = parseToLocal(event.date, event.time)
  const upcoming = isUpcoming(event.date, event.time)

  return (
    <div
      className={cn(
        'group relative p-3 rounded-xl transition-all duration-200 cursor-pointer',
        'bg-secondary/50 dark:bg-white/[0.02] hover:bg-destructive/10',
        'border border-transparent hover:border-destructive/30',
        upcoming && 'border-destructive/30 bg-destructive/5'
      )}
    >
      {/* Time & Currency */}
      <div className="flex items-center gap-2 mb-2">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span className="text-xs font-mono">{localTime}</span>
        </div>
        <div
          className={cn(
            'px-2 py-0.5 rounded text-[10px] font-bold uppercase',
            getCurrencyClass(event.country)
          )}
        >
          {event.country}
        </div>
        {upcoming && (
          <div className="ml-auto flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
            <span className="text-[9px] text-destructive font-semibold uppercase">Live</span>
          </div>
        )}
      </div>

      {/* Event Name */}
      <p className="text-sm text-foreground/80 group-hover:text-foreground transition-colors line-clamp-2">
        {event.title}
      </p>

      {/* Forecast / Previous */}
      {(event.forecast || event.previous) && (
        <div className="flex gap-3 mt-1.5">
          {event.forecast && (
            <span className="text-[10px] text-muted-foreground">
              Forecast:{' '}
              <span className="text-foreground/70 font-mono">{event.forecast}</span>
            </span>
          )}
          {event.previous && (
            <span className="text-[10px] text-muted-foreground">
              Prev:{' '}
              <span className="text-foreground/70 font-mono">{event.previous}</span>
            </span>
          )}
        </div>
      )}

      {/* Impact Indicator — always high since we filter backend-side */}
      <div className="flex items-center gap-1 mt-2">
        {[0, 1, 2].map(i => (
          <div key={i} className="w-1.5 h-1.5 rounded-full bg-destructive" />
        ))}
        <span className="text-[10px] text-muted-foreground ml-1 uppercase">high impact</span>
      </div>

      {/* Hover Glow */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none glow-red" />
    </div>
  )
}

export function NewsSidebar() {
  const { state, loading } = useBackendState(30000)

  return (
    <div className="glass-dark rounded-2xl p-5 h-fit">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg bg-destructive/20 flex items-center justify-center">
          <AlertCircle className="w-4 h-4 text-destructive" />
        </div>
        <div>
          <h3 className="font-heading text-sm font-semibold text-foreground">High-Impact News</h3>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
            Economic Calendar — Today
          </p>
        </div>
      </div>

      {/* News List */}
      {loading ? (
        <div className="flex items-center justify-center py-8 gap-2 text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-xs">Loading news...</span>
        </div>
      ) : state.todayNews.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">
            {state.error ? '⚠️ Cannot reach ForexFactory' : '✅ No high-impact news today'}
          </p>
          {state.error && (
            <p className="text-xs text-muted-foreground mt-1">{state.error}</p>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {state.todayNews.map((event, idx) => (
            <NewsCard key={`${event.country}-${event.time}-${idx}`} event={event} />
          ))}
        </div>
      )}

      {/* Footer: last update */}
      {state.lastUpdate && (
        <p className="text-[10px] text-muted-foreground mt-4 pt-3 border-t border-border text-center">
          Last sync:{' '}
          {new Date(state.lastUpdate).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          })}
        </p>
      )}
    </div>
  )
}
