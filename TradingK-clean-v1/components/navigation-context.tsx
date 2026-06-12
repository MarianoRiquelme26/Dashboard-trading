"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export type View = "dashboard" | "signals" | "journal" | "analytics" | "watchlist" | "playbook"

interface NavigationContextType {
  currentView: View
  setCurrentView: (view: View) => void
  isSidebarCollapsed: boolean
  setSidebarCollapsed: (value: boolean) => void
  signalEventIdFilter: string | null
  openSignal: (eventId?: string | null) => void
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined)

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [currentView, setCurrentView] = useState<View>("dashboard")
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [signalEventIdFilter, setSignalEventIdFilter] = useState<string | null>(null)

  function openSignal(eventId?: string | null) {
    setSignalEventIdFilter(eventId ?? null)
    setCurrentView("signals")
  }

  return (
    <NavigationContext.Provider
      value={{
        currentView,
        setCurrentView,
        isSidebarCollapsed,
        setSidebarCollapsed,
        signalEventIdFilter,
        openSignal,
      }}
    >
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation() {
  const context = useContext(NavigationContext)
  if (!context) {
    throw new Error("useNavigation must be used within a NavigationProvider")
  }
  return context
}
