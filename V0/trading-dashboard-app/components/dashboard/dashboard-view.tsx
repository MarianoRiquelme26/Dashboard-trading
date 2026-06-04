"use client"

import { SyncHeader } from './sync-header'
import { InstrumentGrid } from './instrument-grid'
import { NewsSidebar } from './news-sidebar'

export function DashboardView() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-2xl font-semibold text-foreground">Dashboard</h2>
          <p className="text-muted-foreground">Real-time market overview and alerts</p>
        </div>
        <SyncHeader />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Instrument Grid */}
        <div className="xl:col-span-3">
          <InstrumentGrid />
        </div>

        {/* News Sidebar */}
        <div className="xl:col-span-1">
          <NewsSidebar />
        </div>
      </div>
    </div>
  )
}
