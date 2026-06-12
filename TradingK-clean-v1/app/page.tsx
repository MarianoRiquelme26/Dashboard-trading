"use client"

import { AnalyticsView } from "@/components/analytics/analytics-view"
import { DashboardView } from "@/components/dashboard/dashboard-view"
import { JournalView } from "@/components/journal/journal-view"
import { NavigationProvider, useNavigation } from "@/components/navigation-context"
import { PlaybookView } from "@/components/playbook/playbook-view"
import { Sidebar } from "@/components/sidebar"
import { SignalsView } from "@/components/signals/signals-view"
import { WatchlistView } from "@/components/watchlist/watchlist-view"
import { cn } from "@/lib/utils"

function MainContent() {
  const { currentView, isSidebarCollapsed } = useNavigation()

  return (
    <main
      className={cn(
        "min-h-screen p-4 pt-20 transition-all duration-300 sm:p-5 sm:pt-20 md:p-8 md:pt-8",
        isSidebarCollapsed ? "md:ml-20" : "md:ml-64",
      )}
    >
      {currentView === "dashboard" && <DashboardView />}
      {currentView === "signals" && <SignalsView />}
      {currentView === "journal" && <JournalView />}
      {currentView === "analytics" && <AnalyticsView />}
      {currentView === "watchlist" && <WatchlistView />}
      {currentView === "playbook" && <PlaybookView />}
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
