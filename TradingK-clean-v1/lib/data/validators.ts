import type {
  AnalyticsSummarySnapshot,
  PlaybookStrategiesSnapshot,
  SnapshotBase,
  WatchlistGroup,
  WatchlistGroupsSnapshot,
} from "@/types/snapshots"

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value)
}

function isString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0
}

function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean"
}

function hasBaseEnvelope(snapshot: SnapshotBase) {
  return isString(snapshot.schema_version) && Array.isArray(snapshot.items)
}

function isWatchlistGroup(value: unknown): value is WatchlistGroup {
  if (!isObject(value)) return false
  return isString(value.group_id) && isString(value.group_name) && Array.isArray(value.asset_symbols) && isBoolean(value.is_active)
}

export function isAnalyticsSummarySnapshot(snapshot: SnapshotBase): snapshot is AnalyticsSummarySnapshot {
  return hasBaseEnvelope(snapshot)
}

export function isWatchlistGroupsSnapshot(snapshot: SnapshotBase): snapshot is WatchlistGroupsSnapshot {
  return hasBaseEnvelope(snapshot) && snapshot.items.every(isWatchlistGroup)
}

export function isPlaybookStrategiesSnapshot(snapshot: SnapshotBase): snapshot is PlaybookStrategiesSnapshot {
  return (
    hasBaseEnvelope(snapshot) &&
    snapshot.items.every((item) => isObject(item) && isString(item.strategy_id) && isString(item.name) && Array.isArray(item.rules))
  )
}
