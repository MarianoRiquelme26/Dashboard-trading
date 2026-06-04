"use client"

import { useState, useEffect, useCallback } from 'react'

export interface NewsEvent {
  title: string
  country: string
  date: string
  time: string
  impact: string
  forecast: string
  previous: string
  url: string
}

export interface BackendState {
  lastUpdate: string | null
  groups: Record<string, Record<string, string[]>>
  dangerCurrencies: string[]
  todayNews: NewsEvent[]
  nextEvalIn: number | null
  error: string | null
}

const DEFAULT_STATE: BackendState = {
  lastUpdate: null,
  groups: {},
  dangerCurrencies: [],
  todayNews: [],
  nextEvalIn: null,
  error: null,
}

export function useBackendState(pollIntervalMs = 30000) {
  const [state, setState] = useState<BackendState>(DEFAULT_STATE)
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  const fetchState = useCallback(async () => {
    try {
      const res = await fetch('/api/state')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data: BackendState = await res.json()
      setState(data)
      setFetchError(null)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      setFetchError(msg)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchState()
    const interval = setInterval(fetchState, pollIntervalMs)
    return () => clearInterval(interval)
  }, [fetchState, pollIntervalMs])

  return { state, loading, fetchError }
}

export interface ConfigInstrument {
  ticker: string
  groupName: string
  currencies: string[]
}

export interface BackendConfig {
  groups: Record<string, Record<string, string[]>>
  instruments: ConfigInstrument[]
}

export function useBackendConfig() {
  const [config, setConfig] = useState<BackendConfig | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/config')
      .then(r => r.json())
      .then((data: BackendConfig) => {
        setConfig(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return { config, loading }
}
