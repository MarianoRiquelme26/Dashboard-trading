"use client"

import { useCallback, useEffect, useState } from "react"
import type { SnapshotBase, SnapshotLoadResult } from "@/types/snapshots"
import { isDataSourceStatus, isSnapshotLike, resolveSnapshotStatus } from "./status"

interface UseSnapshotOptions<TSnapshot extends SnapshotBase> {
  refreshIntervalMs?: number
  staleCheckIntervalMs?: number
  validate?: (snapshot: SnapshotBase) => snapshot is TSnapshot
}

export function useSnapshot<TSnapshot extends SnapshotBase = SnapshotBase>(
  path: `/data/${string}`,
  options: UseSnapshotOptions<TSnapshot> = {},
): SnapshotLoadResult<TSnapshot> {
  const [state, setState] = useState<SnapshotLoadResult<TSnapshot>>({
    data: null,
    status: "EMPTY",
    error: null,
    isLoading: true,
    isStale: false,
    refetch: () => undefined,
  })
  const { refreshIntervalMs, staleCheckIntervalMs = 30_000, validate } = options

  const load = useCallback(async () => {
    setState((current) => ({ ...current, isLoading: true, error: null }))

    try {
      const response = await fetch(path, { cache: "no-store" })
      if (!response.ok) {
        throw new Error(`Fetch failed ${response.status} ${response.statusText}`)
      }

      const json = (await response.json()) as unknown
      if (!isSnapshotLike(json)) {
        throw new Error("Snapshot invalido: falta schema_version o items.")
      }
      if (!isDataSourceStatus(json.source_status)) {
        throw new Error("Snapshot invalido: source_status no reconocido.")
      }
      if (validate && !validate(json)) {
        throw new Error("Snapshot invalido: campos estructurales requeridos ausentes.")
      }

      const status = resolveSnapshotStatus(json)
      setState({
        data: json as TSnapshot,
        status,
        error: status === "ERROR" ? json.error_message ?? "Snapshot en estado ERROR." : null,
        isLoading: false,
        isStale: status === "STALE",
        refetch: () => undefined,
      })
    } catch (error) {
      setState({
        data: null,
        status: "ERROR",
        error: error instanceof Error ? error.message : "Error desconocido cargando snapshot.",
        isLoading: false,
        isStale: false,
        refetch: () => undefined,
      })
    }
  }, [path, validate])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    if (!refreshIntervalMs) return
    const timer = window.setInterval(load, refreshIntervalMs)
    return () => window.clearInterval(timer)
  }, [load, refreshIntervalMs])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setState((current) => {
        if (!current.data) return current
        const status = resolveSnapshotStatus(current.data)
        return {
          ...current,
          status,
          isStale: status === "STALE",
          error: status === "ERROR" ? current.data.error_message ?? current.error : null,
        }
      })
    }, staleCheckIntervalMs)

    return () => window.clearInterval(timer)
  }, [staleCheckIntervalMs])

  return { ...state, refetch: load }
}
