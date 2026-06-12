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
  clearSignalFilter: () => void
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined)

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [currentView, setCurrentViewState] = useState<View>("dashboard")
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [signalEventIdFilter, setSignalEventIdFilter] = useState<string | null>(null)

  function setCurrentView(view: View) {
    setSignalEventIdFilter(null)
    setCurrentViewState(view)
  }

  function openSignal(eventId?: string | null) {
    setSignalEventIdFilter(eventId ?? null)
    setCurrentViewState("signals")
  }

  function clearSignalFilter() {
    setSignalEventIdFilter(null)
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
        clearSignalFilter,
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
