import type { UiDataStatus } from "@/types/snapshots"

export function statusFromItems(sourceStatus: string | null | undefined, itemCount: number): UiDataStatus {
  if (sourceStatus === "EMPTY") return "empty"
  if (sourceStatus === "ERROR") return "error"
  if (sourceStatus === "STALE") return itemCount > 0 ? "stale" : "empty"
  if (sourceStatus === "OK" && itemCount === 0) return "empty"
  if (sourceStatus === "OK" && itemCount > 0) return "ready"
  return itemCount > 0 ? "ready" : "empty"
}

export function statusFromSystemSnapshot(snapshotStatus: string | null | undefined): UiDataStatus {
  if (snapshotStatus === "STALE") return "stale"
  if (snapshotStatus === "OK") return "ready"
  return "error"
}

export function snapshotAgeSeconds(generatedAtUtc: string | null | undefined) {
  if (!generatedAtUtc) return null
  const generatedAt = Date.parse(generatedAtUtc)
  if (Number.isNaN(generatedAt)) return null
  return Math.max(0, Math.floor((Date.now() - generatedAt) / 1000))
}
