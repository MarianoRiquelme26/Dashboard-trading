export type UiDataStatus = "loading" | "ready" | "empty" | "stale" | "error"

export type DataSourceStatus = "REAL" | "PARTIAL" | "MOCK" | "EMPTY" | "ERROR" | "STALE"

export interface SnapshotQueryResult<T> {
  status: UiDataStatus
  data: T | null
  error: string | null
  generatedAtUtc?: string | null
  staleAfterSeconds?: number | null
  ageSeconds?: number | null
  sourceStatus?: string | null
  isLoading: boolean
  refetch: () => void
}

export interface SnapshotMeta {
  status: UiDataStatus
  generatedAtUtc?: string | null
  staleAfterSeconds?: number | null
  ageSeconds?: number | null
  sourceStatus?: string | null
}

export interface SignalEntry {
  baseId: string
  label: string | null
  entryType: string | null
  entryPrice: number | null
  slPrice: number | null
  tpPrice: number | null
  riskReward: number | null
  riskPercent?: number | null
  entryStatus?: string | null
  slProtectedByEmas?: boolean | null
  slProtectedByEma8?: boolean | null
  slProtectedByEma21?: boolean | null
  slProtectedByEma50?: boolean | null
  slProtectionDetails?: string | null
}

export interface SignalCondition {
  conditionCode: string
  label: string
  category: string
  timeframe: string | null
  expectedValue: string | null
  actualValue: string | null
  numericValue: number | null
  unit: string | null
  status: string
  severity: string
  scorePoints: number | null
  details: string | null
}

export interface LinkedTrade {
  tradeId: string
  linkStatus: string | null
  linkConfidence: number | null
}

export interface RecentSignalItem {
  eventId: string
  barCloseTimeUtc: string | null
  botName: string | null
  strategyName: string | null
  symbol: string | null
  timeframeSignal: string | null
  direction: string | null
  scoreTotal: number | null
  scoreLabel: string | null
  signalStatus: string | null
  operationStatus: string | null
  telegramSent: boolean
  linkedTradeId: string | null
  primaryEntry: SignalEntry | null
}

export interface SignalsRecentSnapshot extends SnapshotMeta {
  items: RecentSignalItem[]
}

export interface SignalBoardItem {
  eventId: string
  createdAtUtc: string | null
  barCloseTimeUtc: string | null
  botName: string | null
  strategyName: string | null
  symbol: string | null
  timeframeSignal: string | null
  direction: string | null
  scoreTotal: number | null
  scoreLabel: string | null
  signalStatus: string | null
  operationStatus: string | null
  resultStatus: string | null
  telegramSent: boolean
  telegramSentAtUtc?: string | null
  rawTelegramText: string | null
  entries: SignalEntry[]
  conditions: SignalCondition[]
  linkedTrade: LinkedTrade | null
  linkedTradeId: string | null
  warnings: string[]
  raw: unknown
}

export interface SignalsBoardSnapshot extends SnapshotMeta {
  items: SignalBoardItem[]
}

export interface JournalTradeItem {
  tradeId: string
  platform: string | null
  environment: string | null
  symbol: string | null
  direction: string | null
  strategyName: string | null
  entryTimeUtc: string | null
  entryPrice: number | null
  initialSlPrice: number | null
  initialTpPrice: number | null
  volume: number | null
  positionId: string | null
  tradeStatus: string | null
  linkedSignalEventId: string | null
  closedAtUtc: string | null
  exitPrice: number | null
  netProfit: number | null
  commission: number | null
  swap: number | null
  resultPips: number | null
  resultR: number | null
  closeReason: string | null
  resultStatus: string | null
  maePips: number | null
  mfePips: number | null
  reviewStatus: string | null
  mistakeType: string | null
  ruleComplianceScore: number | null
  journalNotes: string | null
}

export interface JournalTradesSnapshot extends SnapshotMeta {
  schemaVersion: string | null
  items: JournalTradeItem[]
}

export interface SystemStatusSnapshot extends SnapshotMeta {
  generatedAtUtc: string | null
  dbStatus: string | null
  lastSignalAtUtc: string | null
  lastTelegramSentAtUtc: string | null
  lastErrorAtUtc: string | null
  recentErrorsCount: number | null
  snapshotStatus: string | null
  snapshotAgeSeconds: number | null
  snapshotStaleAfterSeconds: number | null
}

export interface SnapshotBase<TItem = unknown> {
  schema_version: string
  generated_at_utc: string | null
  source_status: DataSourceStatus
  source_name?: string
  stale_after_seconds?: number
  error_message?: string | null
  items: TItem[]
}

export interface SnapshotLoadResult<TSnapshot extends SnapshotBase = SnapshotBase> {
  data: TSnapshot | null
  status: DataSourceStatus
  error: string | null
  isLoading: boolean
  isStale: boolean
  refetch: () => void
}

export interface AnalyticsSummarySnapshot extends SnapshotBase<never> {
  blocked_reason?: string
  trade_results_available?: boolean
}

export interface WatchlistGroup {
  group_id: string
  group_name: string
  asset_symbols: string[]
  news_currencies?: string[]
  correlation_theme?: string | null
  priority?: number | null
  is_active: boolean
  notes?: string | null
}

export type WatchlistGroupsSnapshot = SnapshotBase<WatchlistGroup>

export interface PlaybookRule {
  section: string
  description: string
}

export interface PlaybookStrategy {
  strategy_id: string
  name: string
  rules: PlaybookRule[]
}

export type PlaybookStrategiesSnapshot = SnapshotBase<PlaybookStrategy>
