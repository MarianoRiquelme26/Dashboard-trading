"use client"

import { createContext, useContext, useState, ReactNode } from 'react'

type View = 'dashboard' | 'journal' | 'analytics' | 'watchlist' | 'playbook'

interface NavigationContextType {
  currentView: View
  setCurrentView: (view: View) => void
  isSidebarCollapsed: boolean
  setSidebarCollapsed: (v: boolean) => void
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined)

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [currentView, setCurrentView] = useState<View>('dashboard')
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <NavigationContext.Provider value={{ currentView, setCurrentView, isSidebarCollapsed, setSidebarCollapsed }}>
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation() {
  const context = useContext(NavigationContext)
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider')
  }
  return context
}
