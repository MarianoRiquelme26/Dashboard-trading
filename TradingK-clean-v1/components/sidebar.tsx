"use client"

import {
  Activity,
  BarChart3,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileText,
  LayoutDashboard,
  Moon,
  RadioTower,
  Sun,
} from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { useNavigation, type View } from "./navigation-context"

const navItems: Array<{ id: View; label: string; icon: React.ElementType }> = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "signals", label: "Signals", icon: RadioTower },
  { id: "journal", label: "Journal", icon: BookOpen },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "watchlist", label: "Watchlist", icon: Eye },
  { id: "playbook", label: "Playbook", icon: FileText },
]

export function Sidebar() {
  const { currentView, setCurrentView, isSidebarCollapsed, setSidebarCollapsed } = useNavigation()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-border bg-sidebar transition-all duration-300",
        isSidebarCollapsed ? "w-20" : "w-64",
      )}
    >
      <div className="flex items-center justify-between border-b border-border p-4">
        {!isSidebarCollapsed && (
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/15">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <h1 className="truncate font-heading text-lg font-semibold text-foreground">TradingK</h1>
              <p className="truncate text-xs text-muted-foreground">Snapshot Console</p>
            </div>
          </div>
        )}
        {isSidebarCollapsed && (
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15">
            <Activity className="h-5 w-5 text-primary" />
          </div>
        )}
        <button
          type="button"
          aria-label="Toggle sidebar"
          onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
          className={cn(
            "rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
            isSidebarCollapsed && "absolute -right-3 top-6 border border-border bg-card",
          )}
        >
          {isSidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto overflow-x-hidden p-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentView === item.id
          return (
            <button
              key={item.id}
              type="button"
              title={isSidebarCollapsed ? item.label : undefined}
              onClick={() => setCurrentView(item.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg py-3 text-sm font-medium transition-colors",
                isSidebarCollapsed ? "justify-center px-0" : "px-4",
                isActive ? "bg-primary/10 text-primary" : "text-foreground/75 hover:bg-secondary hover:text-foreground",
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
            </button>
          )
        })}
      </nav>

      <div className="border-t border-border p-4">
        <button
          type="button"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg bg-secondary/40 py-3 text-sm text-foreground/80 transition-colors hover:bg-secondary",
            isSidebarCollapsed ? "justify-center px-0" : "px-4",
          )}
        >
          {mounted && theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          {!isSidebarCollapsed && <span>Theme</span>}
        </button>
      </div>
    </aside>
  )
}
