"use client"

import { AlertCircle, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NewsEvent {
  id: string
  time: string
  currency: string
  event: string
  impact: 'high' | 'medium'
  upcoming: boolean
}

const newsEvents: NewsEvent[] = [
  {
    id: '1',
    time: '08:30',
    currency: 'USD',
    event: 'Unemployment Claims',
    impact: 'high',
    upcoming: true
  },
  {
    id: '2',
    time: '10:00',
    currency: 'USD',
    event: 'ISM Manufacturing PMI',
    impact: 'high',
    upcoming: true
  },
  {
    id: '3',
    time: '14:00',
    currency: 'GBP',
    event: 'BoE Interest Rate Decision',
    impact: 'high',
    upcoming: false
  },
  {
    id: '4',
    time: '15:30',
    currency: 'EUR',
    event: 'ECB Press Conference',
    impact: 'high',
    upcoming: false
  },
  {
    id: '5',
    time: '20:00',
    currency: 'USD',
    event: 'FOMC Meeting Minutes',
    impact: 'high',
    upcoming: false
  }
]

export function NewsSidebar() {
  return (
    <div className="glass-dark rounded-2xl p-5 h-fit">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg bg-destructive/20 flex items-center justify-center">
          <AlertCircle className="w-4 h-4 text-destructive" />
        </div>
        <div>
          <h3 className="font-heading text-sm font-semibold text-foreground">High-Impact News</h3>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Economic Calendar</p>
        </div>
      </div>

      {/* News List */}
      <div className="space-y-2">
        {newsEvents.map((event) => (
          <NewsCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  )
}

function NewsCard({ event }: { event: NewsEvent }) {
  return (
    <div
      className={cn(
        "group relative p-3 rounded-xl transition-all duration-200 cursor-pointer",
        "bg-secondary/50 dark:bg-white/[0.02] hover:bg-destructive/10",
        "border border-transparent hover:border-destructive/30"
      )}
    >
      {/* Time & Currency */}
      <div className="flex items-center gap-2 mb-2">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span className="text-xs font-mono">{event.time}</span>
        </div>
        <div className={cn(
          "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
          event.currency === 'USD' && "bg-primary/20 text-primary",
          event.currency === 'GBP' && "bg-violet-500/20 text-violet-500",
          event.currency === 'EUR' && "bg-amber-500/20 text-amber-500"
        )}>
          {event.currency}
        </div>
        {event.upcoming && (
          <div className="ml-auto w-2 h-2 rounded-full bg-destructive animate-pulse" />
        )}
      </div>

      {/* Event Name */}
      <p className="text-sm text-foreground/80 group-hover:text-foreground transition-colors line-clamp-1">
        {event.event}
      </p>

      {/* Impact Indicator */}
      <div className="flex items-center gap-1 mt-2">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "w-1.5 h-1.5 rounded-full",
              event.impact === 'high' ? "bg-destructive" : i < 2 ? "bg-amber-500" : "bg-muted-foreground/30"
            )}
          />
        ))}
        <span className="text-[10px] text-muted-foreground ml-1 uppercase">
          {event.impact} impact
        </span>
      </div>

      {/* Hover Glow */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none glow-red" />
    </div>
  )
}
