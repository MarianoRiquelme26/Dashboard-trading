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
  Moon
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
  const { currentView, setCurrentView } = useNavigation()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 glass-dark flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-[#0284c7] flex items-center justify-center glow-blue">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-heading text-lg font-semibold text-foreground">TradeFlow</h1>
            <p className="text-xs text-muted-foreground">Pro Scalper Suite</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentView === item.id
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                "hover:bg-primary/5",
                isActive && "bg-primary/10 text-primary glow-blue"
              )}
            >
              <Icon className={cn(
                "w-5 h-5 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )} />
              <span className={cn(
                "font-medium text-sm transition-colors",
                isActive ? "text-primary" : "text-foreground/80"
              )}>
                {item.label}
              </span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
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
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl glass hover:bg-primary/5 transition-all duration-200 group"
        >
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            {mounted && (
              theme === 'dark' ? (
                <Moon className="w-4 h-4 text-primary theme-toggle-icon" />
              ) : (
                <Sun className="w-4 h-4 text-primary theme-toggle-icon" />
              )
            )}
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors">
              {mounted ? (theme === 'dark' ? 'Dark Mode' : 'Light Mode') : 'Theme'}
            </p>
            <p className="text-[10px] text-muted-foreground">Click to switch</p>
          </div>
          <div className={cn(
            "w-10 h-5 rounded-full relative transition-colors",
            theme === 'dark' ? "bg-primary/20" : "bg-primary"
          )}>
            <div className={cn(
              "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all",
              theme === 'dark' ? "left-0.5" : "left-5"
            )} />
          </div>
        </button>

        {/* System Status */}
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs text-muted-foreground">System Status</span>
          </div>
          <p className="text-sm text-foreground/80">All systems operational</p>
        </div>
      </div>
    </aside>
  )
}
