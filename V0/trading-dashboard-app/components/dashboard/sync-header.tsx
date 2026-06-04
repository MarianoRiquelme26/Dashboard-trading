"use client"

import { useEffect, useState } from 'react'
import { Clock, RefreshCw, Hourglass } from 'lucide-react'

export function SyncHeader() {
  const [time, setTime] = useState<Date>(new Date())
  const [lastSync, setLastSync] = useState<string>('--:--')
  const [nextRefresh, setNextRefresh] = useState<number>(60)

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date())
      setNextRefresh((prev) => (prev > 0 ? prev - 1 : 60))
    }, 1000)

    // Simulate sync
    setLastSync(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }))

    return () => clearInterval(interval)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: false 
    })
  }

  return (
    <div className="flex items-center gap-4 flex-wrap">
      {/* Last Sync */}
      <div className="glass rounded-xl px-4 py-2 flex items-center gap-3">
        <RefreshCw className="w-4 h-4 text-primary" />
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Last Sync</p>
          <p className="text-sm font-mono text-foreground/90">{lastSync}</p>
        </div>
      </div>

      {/* Local Time */}
      <div className="glass rounded-xl px-4 py-2 flex items-center gap-3">
        <Clock className="w-4 h-4 text-primary" />
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Local Time</p>
          <p className="text-sm font-mono text-foreground/90">{formatTime(time)}</p>
        </div>
      </div>

      {/* Next Refresh */}
      <div className="glass rounded-xl px-4 py-2 flex items-center gap-3 pulse-glow">
        <Hourglass className="w-4 h-4 text-primary" />
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Next Refresh</p>
          <p className="text-sm font-mono text-foreground/90">
            {Math.floor(nextRefresh / 60).toString().padStart(2, '0')}:
            {(nextRefresh % 60).toString().padStart(2, '0')}
          </p>
        </div>
      </div>
    </div>
  )
}
