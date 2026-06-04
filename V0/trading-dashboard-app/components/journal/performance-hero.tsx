"use client"

import { TrendingUp, TrendingDown, Target, Activity, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MetricCard {
  label: string
  value: string
  change?: number
  icon: React.ElementType
  color: 'green' | 'blue' | 'red' | 'yellow'
}

const metrics: MetricCard[] = [
  {
    label: 'Net Profit',
    value: '$12,450.00',
    change: 8.2,
    icon: TrendingUp,
    color: 'green'
  },
  {
    label: 'Win Rate',
    value: '68.5%',
    change: 2.1,
    icon: Target,
    color: 'blue'
  },
  {
    label: 'Profit Factor',
    value: '2.34',
    change: 0.15,
    icon: Activity,
    color: 'green'
  },
  {
    label: 'Avg R:R Ratio',
    value: '1:2.8',
    icon: TrendingUp,
    color: 'blue'
  },
  {
    label: 'Max Drawdown',
    value: '-4.2%',
    icon: AlertTriangle,
    color: 'red'
  }
]

const colorMap = {
  green: {
    bg: 'bg-success/10',
    text: 'text-success',
    icon: 'text-success'
  },
  blue: {
    bg: 'bg-primary/10',
    text: 'text-primary',
    icon: 'text-primary'
  },
  red: {
    bg: 'bg-destructive/10',
    text: 'text-destructive',
    icon: 'text-destructive'
  },
  yellow: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-500',
    icon: 'text-amber-500'
  }
}

interface PerformanceHeroProps {
  selectedAccount: string
  onAccountChange: (account: string) => void
}

export function PerformanceHero({ selectedAccount, onAccountChange }: PerformanceHeroProps) {
  return (
    <div className="glass rounded-2xl p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-heading text-xl font-semibold text-foreground">Performance Overview</h2>
          <p className="text-sm text-muted-foreground">Track your trading metrics in real-time</p>
        </div>
        <select
          value={selectedAccount}
          onChange={(e) => onAccountChange(e.target.value)}
          className="glass px-4 py-2 rounded-xl text-sm text-foreground/80 bg-card border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
        >
          <option value="all" className="bg-card text-foreground">All Accounts</option>
          <option value="acc-001" className="bg-card text-foreground">Account #001</option>
          <option value="acc-002" className="bg-card text-foreground">Account #002</option>
          <option value="acc-003" className="bg-card text-foreground">Account #003</option>
        </select>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon
          const colors = colorMap[metric.color]
          return (
            <div
              key={metric.label}
              className="bg-secondary/50 dark:bg-white/[0.02] rounded-xl p-4 border border-border hover:border-primary/20 transition-all"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", colors.bg)}>
                  <Icon className={cn("w-4 h-4", colors.icon)} />
                </div>
              </div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{metric.label}</p>
              <p className={cn("text-2xl font-heading font-bold", colors.text)}>{metric.value}</p>
              {metric.change !== undefined && (
                <div className="flex items-center gap-1 mt-1">
                  {metric.change > 0 ? (
                    <TrendingUp className="w-3 h-3 text-success" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-destructive" />
                  )}
                  <span className={cn(
                    "text-xs",
                    metric.change > 0 ? "text-success" : "text-destructive"
                  )}>
                    {metric.change > 0 ? '+' : ''}{metric.change}%
                  </span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
