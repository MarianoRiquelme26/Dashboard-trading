"use client"

import { useEffect, useState } from 'react'
import { Clock, RefreshCw, Hourglass } from 'lucide-react'
import { useBackendState } from '@/hooks/use-backend-state'

export function SyncHeader() {
  const [time, setTime] = useState<Date>(new Date())
  const [countdown, setCountdown] = useState<number>(300)
  const [mounted, setMounted] = useState(false)
  const { state } = useBackendState(30000)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Tick local clock every second
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  // Countdown toward next backend eval (5-min cycle)
  useEffect(() => {
    if (state.nextEvalIn != null) {
      setCountdown(state.nextEvalIn)
    }
  }, [state.nextEvalIn])

  useEffect(() => {
    const id = setInterval(() => {
      setCountdown(prev => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(id)
  }, [])

  const formatTime = (date: Date) =>
    date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, '0')
    const s = (secs % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  const lastSyncDisplay = state.lastUpdate
    ? new Date(state.lastUpdate).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })
    : '--:--'

  return (
    <div className="flex items-center gap-4 flex-wrap">
      {/* Last Sync */}
      <div className="glass rounded-xl px-4 py-2 flex items-center gap-3">
        <RefreshCw className="w-4 h-4 text-primary" />
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Last Sync</p>
          <p className="text-sm font-mono text-foreground/90">{mounted ? lastSyncDisplay : '--:--'}</p>
        </div>
      </div>

      {/* Local Time */}
      <div className="glass rounded-xl px-4 py-2 flex items-center gap-3">
        <Clock className="w-4 h-4 text-primary" />
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Local Time</p>
          <p className="text-sm font-mono text-foreground/90">{mounted ? formatTime(time) : '--:--:--'}</p>
        </div>
      </div>

      {/* Next Refresh countdown */}
      <div className="glass rounded-xl px-4 py-2 flex items-center gap-3 pulse-glow">
        <Hourglass className="w-4 h-4 text-primary" />
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Next Refresh</p>
          <p className="text-sm font-mono text-foreground/90">{formatCountdown(countdown)}</p>
        </div>
      </div>
    </div>
  )
}
