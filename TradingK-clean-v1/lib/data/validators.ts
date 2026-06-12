import type {
  AnalyticsSummarySnapshot,
  JournalTradeItem,
  JournalTradesSnapshot,
  PlaybookStrategiesSnapshot,
  RecentSignalItem,
  SignalBoardItem,
  SignalsBoardSnapshot,
  SignalsRecentSnapshot,
  SnapshotBase,
  SystemService,
  SystemStatusSnapshot,
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

function isSignalBoardItem(value: unknown): value is SignalBoardItem {
  if (!isObject(value)) return false
  return (
    isString(value.event_id) &&
    isString(value.created_at_utc) &&
    isString(value.bar_close_time_utc) &&
    isString(value.platform) &&
    isString(value.environment) &&
    isString(value.bot_name) &&
    isString(value.symbol) &&
    isString(value.timeframe_signal) &&
    isString(value.strategy_name) &&
    isString(value.direction) &&
    isString(value.signal_status) &&
    isBoolean(value.telegram_sent) &&
    Array.isArray(value.entries) &&
    Array.isArray(value.conditions)
  )
}

function isRecentSignalItem(value: unknown): value is RecentSignalItem {
  if (!isObject(value)) return false
  return (
    isString(value.event_id) &&
    isString(value.bar_close_time_utc) &&
    isString(value.bot_name) &&
    isString(value.strategy_name) &&
    isString(value.symbol) &&
    isString(value.timeframe_signal) &&
    isString(value.direction) &&
    isString(value.signal_status) &&
    isBoolean(value.telegram_sent)
  )
}

function isJournalTradeItem(value: unknown): value is JournalTradeItem {
  if (!isObject(value)) return false
  return (
    isString(value.trade_id) &&
    isString(value.platform) &&
    isString(value.environment) &&
    isString(value.symbol) &&
    isString(value.direction) &&
    isString(value.entry_time_utc) &&
    typeof value.entry_price === "number" &&
    ["open", "closed", "cancelled", "error"].includes(String(value.trade_status))
  )
}

function isSystemService(value: unknown): value is SystemService {
  if (!isObject(value)) return false
  return isString(value.name) && ["ok", "warning", "error", "unknown"].includes(String(value.status))
}

function isWatchlistGroup(value: unknown): value is WatchlistGroup {
  if (!isObject(value)) return false
  return isString(value.group_id) && isString(value.group_name) && Array.isArray(value.asset_symbols) && isBoolean(value.is_active)
}

export function isSignalsBoardSnapshot(snapshot: SnapshotBase): snapshot is SignalsBoardSnapshot {
  return hasBaseEnvelope(snapshot) && snapshot.items.every(isSignalBoardItem)
}

export function isSignalsRecentSnapshot(snapshot: SnapshotBase): snapshot is SignalsRecentSnapshot {
  return hasBaseEnvelope(snapshot) && snapshot.items.every(isRecentSignalItem)
}

export function isJournalTradesSnapshot(snapshot: SnapshotBase): snapshot is JournalTradesSnapshot {
  return hasBaseEnvelope(snapshot) && snapshot.items.every(isJournalTradeItem)
}

export function isSystemStatusSnapshot(snapshot: SnapshotBase): snapshot is SystemStatusSnapshot {
  const candidate = snapshot as Partial<SystemStatusSnapshot>
  return (
    hasBaseEnvelope(snapshot) &&
    isString(candidate.overall_status) &&
    Array.isArray(candidate.services) &&
    candidate.services.every(isSystemService) &&
    Array.isArray(candidate.recent_errors)
  )
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
