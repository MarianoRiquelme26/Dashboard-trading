"use client"

import { useEffect, useState } from "react"
import type { SnapshotBase, SnapshotLoadResult } from "@/types/snapshots"
import { isDataSourceStatus, isSnapshotLike, resolveSnapshotStatus } from "./status"

export function useSnapshot<TSnapshot extends SnapshotBase = SnapshotBase>(
  path: `/data/${string}`,
): SnapshotLoadResult<TSnapshot> {
  const [state, setState] = useState<SnapshotLoadResult<TSnapshot>>({
    data: null,
    status: "EMPTY",
    error: null,
    isLoading: true,
    isStale: false,
  })

  useEffect(() => {
    let cancelled = false

    async function load() {
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

        const status = resolveSnapshotStatus(json)
        if (!cancelled) {
          setState({
            data: json as TSnapshot,
            status,
            error: status === "ERROR" ? json.error_message ?? "Snapshot en estado ERROR." : null,
            isLoading: false,
            isStale: status === "STALE",
          })
        }
      } catch (error) {
        if (!cancelled) {
          setState({
            data: null,
            status: "ERROR",
            error: error instanceof Error ? error.message : "Error desconocido cargando snapshot.",
            isLoading: false,
            isStale: false,
          })
        }
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [path])

  return state
}
