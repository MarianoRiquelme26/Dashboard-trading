"use client"

import { useState } from 'react'
import { SyncHeader } from './sync-header'
import { InstrumentGrid } from './instrument-grid'
import { NewsSidebar } from './news-sidebar'
import { SentimentCard } from './sentiment-card'
import { cn } from '@/lib/utils'

export type RiskFilter = 'all' | 'safe' | 'affected'

export function DashboardView() {
  const [filter, setFilter] = useState<RiskFilter>('all')
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="font-heading text-2xl font-semibold text-foreground">Dashboard</h2>
          <p className="text-muted-foreground">Real-time market overview and alerts</p>
        </div>
        <SyncHeader />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 bg-secondary/30 p-1.5 rounded-xl w-fit">
        <button
          onClick={() => setFilter('all')}
          className={cn(
            "px-4 py-1.5 rounded-lg text-sm font-medium transition-all",
            filter === 'all' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          )}
        >
          Ver Todos
        </button>
        <button
          onClick={() => setFilter('safe')}
          className={cn(
            "px-4 py-1.5 rounded-lg text-sm font-medium transition-all",
            filter === 'safe' ? "bg-card text-success shadow-sm" : "text-muted-foreground hover:text-foreground"
          )}
        >
          Solo Seguros
        </button>
        <button
          onClick={() => setFilter('affected')}
          className={cn(
            "px-4 py-1.5 rounded-lg text-sm font-medium transition-all",
            filter === 'affected' ? "bg-card text-destructive shadow-sm" : "text-muted-foreground hover:text-foreground"
          )}
        >
          Solo Afectados
        </button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Instrument Grid */}
        <div className="xl:col-span-3">
          <InstrumentGrid filter={filter} />
        </div>

        {/* News Sidebar & Sentiment */}
        <div className="xl:col-span-1">
          <NewsSidebar />
          <SentimentCard />
        </div>
      </div>
    </div>
  )
}
