"use client"

import { NavigationProvider, useNavigation } from '@/components/navigation-context'
import { Sidebar } from '@/components/sidebar'
import { DashboardView } from '@/components/dashboard/dashboard-view'
import { JournalView } from '@/components/journal/journal-view'
import { AnalyticsView } from '@/components/analytics/analytics-view'
import { WatchlistView } from '@/components/watchlist/watchlist-view'
import { PlaybookView } from '@/components/playbook/playbook-view'

function MainContent() {
  const { currentView } = useNavigation()

  return (
    <main className="ml-64 min-h-screen p-8">
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
