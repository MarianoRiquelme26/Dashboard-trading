"use client"

import { useCallback, useEffect, useState } from "react"
import type { SnapshotMeta, SnapshotQueryResult, UiDataStatus } from "@/types/snapshots"
import {
  fetchJournalTrades,
  fetchSignalsBoard,
  fetchSignalsRecent,
  fetchSystemStatus,
} from "./snapshot-api"

type SnapshotFetcher<T extends SnapshotMeta> = () => Promise<T>

function useSnapshotQuery<T extends SnapshotMeta>(
  fetcher: SnapshotFetcher<T>,
  refreshIntervalMs: number,
): SnapshotQueryResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [status, setStatus] = useState<UiDataStatus>("loading")
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setStatus((current) => (current === "stale" ? "stale" : "loading"))
    setError(null)
    try {
      const snapshot = await fetcher()
      setData(snapshot)
      setStatus(snapshot.status)
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : "Error desconocido cargando snapshot.")
      setStatus("error")
    }
  }, [fetcher])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    const timer = window.setInterval(load, refreshIntervalMs)
    return () => window.clearInterval(timer)
  }, [load, refreshIntervalMs])

  return {
    status,
    data,
    error,
    generatedAtUtc: data?.generatedAtUtc,
    staleAfterSeconds: data?.staleAfterSeconds,
    ageSeconds: data?.ageSeconds,
    sourceStatus: data?.sourceStatus,
    isLoading: status === "loading" && data === null,
    refetch: load,
  }
}

export function useSignalsRecent() {
  return useSnapshotQuery(fetchSignalsRecent, 60_000)
}

export function useSignalsBoard() {
  return useSnapshotQuery(fetchSignalsBoard, 60_000)
}

export function useJournalTrades() {
  return useSnapshotQuery(fetchJournalTrades, 90_000)
}

export function useSystemStatus() {
  return useSnapshotQuery(fetchSystemStatus, 30_000)
}
