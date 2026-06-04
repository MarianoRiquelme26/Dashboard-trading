"use client"

import { useEffect, useState } from 'react'
import { Activity } from 'lucide-react'

interface SentimentData {
  currency: string
  bullish: number
}

const CORE_CURRENCIES = ['EUR', 'USD', 'GBP', 'JPY', 'AUD', 'CHF']

function generateMockSentiment(): SentimentData[] {
  return CORE_CURRENCIES.map(c => ({
    currency: c,
    bullish: 30 + Math.random() * 40 // entre 30% y 70%
  }))
}

export function SentimentCard() {
  const [data, setData] = useState<SentimentData[]>([])

  useEffect(() => {
    setData(generateMockSentiment())
    
    // Fluctuación aleatoria suave cada 5 segundos
    const interval = setInterval(() => {
      setData(prev => prev.map(item => {
        let newBullish = item.bullish + (Math.random() - 0.5) * 5
        if (newBullish > 90) newBullish = 90
        if (newBullish < 10) newBullish = 10
        return { ...item, bullish: newBullish }
      }))
    }, 5000)
    
    return () => clearInterval(interval)
  }, [])

  if (data.length === 0) return null

  return (
    <div className="glass-dark rounded-2xl p-5 h-fit mt-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
          <Activity className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h3 className="font-heading text-sm font-semibold text-foreground">Market Sentiment</h3>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Live Retail Bias</p>
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {data.map(item => (
          <div key={item.currency} className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-foreground/80">{item.currency}</span>
              <div className="flex gap-2">
                <span className="text-success">{item.bullish.toFixed(1)}%</span>
                <span className="text-muted-foreground">/</span>
                <span className="text-destructive">{(100 - item.bullish).toFixed(1)}%</span>
              </div>
            </div>
            {/* Progress bar */}
            <div className="h-1.5 w-full bg-destructive/30 rounded-full overflow-hidden flex">
              <div 
                className="h-full bg-success transition-all duration-1000 ease-in-out"
                style={{ width: `${item.bullish}%` }}
              />
              <div 
                className="h-full bg-destructive transition-all duration-1000 ease-in-out"
                style={{ width: `${100 - item.bullish}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
