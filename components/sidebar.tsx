"use client"

import { useNavigation } from './navigation-context'
import { useTheme } from 'next-themes'
import { 
  LayoutDashboard, 
  BookOpen, 
  BarChart3, 
  Eye, 
  FileText,
  TrendingUp,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'journal', label: 'Journal', icon: BookOpen },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'watchlist', label: 'Watchlist', icon: Eye },
  { id: 'playbook', label: 'Playbook', icon: FileText },
] as const

export function Sidebar() {
  const { currentView, setCurrentView, isSidebarCollapsed, setSidebarCollapsed } = useNavigation()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <aside className={cn(
      "fixed left-0 top-0 h-screen glass-dark flex flex-col z-50 transition-all duration-300",
      isSidebarCollapsed ? "w-20" : "w-64"
    )}>
      {/* Logo & Toggle */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        {!isSidebarCollapsed && (
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-primary to-[#0284c7] flex items-center justify-center glow-blue">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div className="whitespace-nowrap">
              <h1 className="font-heading text-lg font-semibold text-foreground">TradeFlow</h1>
              <p className="text-xs text-muted-foreground">Pro Scalper Suite</p>
            </div>
          </div>
        )}
        {isSidebarCollapsed && (
          <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-primary to-[#0284c7] flex items-center justify-center glow-blue mx-auto mb-2 mt-2">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
        )}
        
        <button 
          onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
          className={cn(
            "p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors",
            isSidebarCollapsed ? "absolute -right-3 top-6 bg-secondary border border-border shadow-sm rounded-full z-50" : ""
          )}
        >
          {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentView === item.id
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              title={isSidebarCollapsed ? item.label : undefined}
              className={cn(
                "w-full flex items-center gap-3 py-3 rounded-xl transition-all duration-200",
                isSidebarCollapsed ? "px-0 justify-center" : "px-4",
                "hover:bg-primary/5",
                isActive && "bg-primary/10 text-primary glow-blue"
              )}
            >
              <Icon className={cn(
                "w-5 h-5 transition-colors shrink-0",
                isActive ? "text-primary" : "text-muted-foreground"
              )} />
              
              {!isSidebarCollapsed && (
                <>
                  <span className={cn(
                    "font-medium text-sm transition-colors whitespace-nowrap",
                    isActive ? "text-primary" : "text-foreground/80"
                  )}>
                    {item.label}
                  </span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  )}
                </>
              )}
            </button>
          )
        })}
      </nav>

      {/* Theme Toggle & Footer */}
      <div className="p-4 border-t border-border space-y-3">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title={isSidebarCollapsed ? "Toggle Theme" : undefined}
          className={cn(
            "w-full flex items-center gap-3 py-3 rounded-xl glass hover:bg-primary/5 transition-all duration-200 group",
            isSidebarCollapsed ? "px-0 justify-center" : "px-4"
          )}
        >
          <div className="w-8 h-8 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center">
            {mounted && (
              theme === 'dark' ? (
                <Moon className="w-4 h-4 text-primary theme-toggle-icon" />
              ) : (
                <Sun className="w-4 h-4 text-primary theme-toggle-icon" />
              )
            )}
          </div>
          
          {!isSidebarCollapsed && (
            <>
              <div className="flex-1 text-left whitespace-nowrap overflow-hidden">
                <p className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors truncate">
                  {mounted ? (theme === 'dark' ? 'Dark Mode' : 'Light Mode') : 'Theme'}
                </p>
                <p className="text-[10px] text-muted-foreground truncate">Click to switch</p>
              </div>
              <div className={cn(
                "w-10 h-5 shrink-0 rounded-full relative transition-colors",
                !mounted ? "bg-primary/20" : theme === 'dark' ? "bg-primary/20" : "bg-primary"
              )}>
                <div className={cn(
                  "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all",
                  !mounted ? "left-0.5" : theme === 'dark' ? "left-0.5" : "left-5"
                )} />
              </div>
            </>
          )}
        </button>

        {/* System Status */}
        {!isSidebarCollapsed && (
          <div className="glass rounded-xl p-4 overflow-hidden">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 shrink-0 rounded-full bg-success animate-pulse" />
              <span className="text-xs text-muted-foreground whitespace-nowrap">System Status</span>
            </div>
            <p className="text-sm text-foreground/80 whitespace-nowrap">All systems operational</p>
          </div>
        )}
      </div>
    </aside>
  )
}
