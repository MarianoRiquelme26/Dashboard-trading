"use client"

import { NavigationProvider, useNavigation } from '@/components/navigation-context'
import { cn } from '@/lib/utils'
import { Sidebar } from '@/components/sidebar'
import { DashboardView } from '@/components/dashboard/dashboard-view'
import { JournalView } from '@/components/journal/journal-view'
import { AnalyticsView } from '@/components/analytics/analytics-view'
import { WatchlistView } from '@/components/watchlist/watchlist-view'
import { PlaybookView } from '@/components/playbook/playbook-view'

function MainContent() {
  const { currentView, isSidebarCollapsed } = useNavigation()

  return (
    <main className={cn(
      "min-h-screen p-8 transition-all duration-300",
      isSidebarCollapsed ? "ml-20" : "ml-64"
    )}>
      {currentView === 'dashboard' && <DashboardView />}
      {currentView === 'journal' && <JournalView />}
      {currentView === 'analytics' && <AnalyticsView />}
      {currentView === 'watchlist' && <WatchlistView />}
      {currentView === 'playbook' && <PlaybookView />}
    </main>
  )
}

export default function TradingDashboard() {
  return (
    <NavigationProvider>
      <div className="min-h-screen bg-gradient-radial">
        <Sidebar />
        <MainContent />
      </div>
    </NavigationProvider>
  )
}
