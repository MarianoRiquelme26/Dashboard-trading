export type DataSourceStatus =
  | "REAL"
  | "PARTIAL"
  | "MOCK"
  | "EMPTY"
  | "ERROR"
  | "STALE"

export interface SnapshotBase<TItem = unknown> {
  schema_version: string
  generated_at_utc: string | null
  source_status: DataSourceStatus
  source_name?: string
  stale_after_seconds?: number
  error_message?: string | null
  items: TItem[]
}

export type SnapshotRecord = SnapshotBase<Record<string, unknown>> & Record<string, unknown>

export interface SnapshotLoadResult<TSnapshot extends SnapshotBase = SnapshotBase> {
  data: TSnapshot | null
  status: DataSourceStatus
  error: string | null
  isLoading: boolean
  isStale: boolean
  refetch: () => void
}

export interface SignalEntry {
  base_id: string
  label?: string | null
  entry_type?: string | null
  entry_price?: number | null
  entry_level_type?: string | null
  entry_fib_level?: number | null
  sl_price?: number | null
  sl_level_type?: string | null
  sl_fib_level?: number | null
  tp_price?: number | null
  tp_level_type?: string | null
  tp_fib_level?: number | null
  risk_amount?: number | null
  risk_percent?: number | null
  risk_reward?: number | null
  sl_protected_by_emas?: boolean | null
  sl_protected_by_ema8?: boolean | null
  sl_protected_by_ema21?: boolean | null
  sl_protected_by_ema50?: boolean | null
  sl_protection_details?: string | null
  entry_status?: string | null
}

export interface SignalCondition {
  condition_code: string
  label: string
  category: string
  timeframe?: string | null
  expected_value?: string | null
  actual_value?: string | null
  numeric_value?: number | null
  unit?: string | null
  status: string
  severity: string
  score_points?: number | null
  details?: string | null
}

export interface LinkedTradeSummary {
  trade_id: string
  link_status: "auto_linked" | "manual_linked" | "suggested" | "ambiguous"
  link_confidence?: number | null
}

export interface SignalBoardItem {
  event_id: string
  created_at_utc: string
  bar_open_time_utc?: string | null
  bar_close_time_utc: string
  bar_close_time_local?: string | null
  platform: string
  environment: string
  bot_name: string
  bot_version?: string | null
  symbol: string
  asset_class?: string | null
  timeframe_signal: string
  timeframe_context?: string | null
  strategy_name: string
  strategy_family?: string | null
  strategy_variant?: string | null
  setup_type?: string | null
  direction: string
  signal_price?: number | null
  context_status?: string | null
  trigger_status?: string | null
  score_total?: number | null
  score_max?: number | null
  score_grade?: string | null
  score_label?: string | null
  signal_status: string
  operation_status?: string | null
  result_status?: string | null
  telegram_sent: boolean
  telegram_sent_at_utc?: string | null
  raw_telegram_text?: string | null
  entries: SignalEntry[]
  conditions: SignalCondition[]
  linked_trade?: LinkedTradeSummary | null
  warnings?: string[]
  raw_payload_json?: unknown
}

export interface SignalsBoardSnapshot extends SnapshotBase<SignalBoardItem> {
  filters?: {
    strategies?: string[]
    statuses?: string[]
  }
}

export interface RecentSignalItem {
  event_id: string
  bar_close_time_utc: string
  bar_close_time_local?: string | null
  bot_name: string
  strategy_name: string
  symbol: string
  timeframe_signal: string
  direction: string
  score_total?: number | null
  score_label?: string | null
  signal_status: string
  operation_status?: string | null
  telegram_sent: boolean
  linked_trade?: LinkedTradeSummary | null
  primary_entry?: {
    base_id?: string | null
    entry_price?: number | null
    sl_price?: number | null
    tp_price?: number | null
    risk_reward?: number | null
    sl_protected_by_emas?: boolean | null
  } | null
}

export type SignalsRecentSnapshot = SnapshotBase<RecentSignalItem>

export interface JournalTradeItem {
  trade_id: string
  platform: string
  environment: string
  symbol: string
  direction: string
  strategy_name?: string | null
  entry_time_utc: string
  entry_price: number
  initial_sl_price?: number | null
  initial_tp_price?: number | null
  trade_status: "open" | "closed" | "cancelled" | "error"
  linked_signal?: {
    event_id: string
    link_status: string
    link_confidence?: number | null
  } | null
  signal_plan?: {
    entry_price?: number | null
    sl_price?: number | null
    tp_price?: number | null
    risk_reward?: number | null
  } | null
  execution_delta?: {
    entry_delta_points?: number | null
    sl_delta_points?: number | null
    tp_delta_points?: number | null
  } | null
  result?: {
    closed_at_utc?: string | null
    exit_price?: number | null
    result_r?: number | null
    net_profit?: number | null
    commission?: number | null
    swap?: number | null
  } | null
  review?: {
    mistake_type?: string | null
    rule_compliance_score?: number | null
    journal_notes?: string | null
  } | null
}

export type JournalTradesSnapshot = SnapshotBase<JournalTradeItem>

export interface SystemService {
  name: string
  status: "ok" | "warning" | "error" | "unknown"
  last_seen_utc?: string | null
  last_insert_utc?: string | null
  last_generated_utc?: string | null
  message?: string | null
}

export interface SystemError {
  level?: string | null
  component?: string | null
  message: string
  created_at_utc?: string | null
  related_event_id?: string | null
}

export interface SystemStatusSnapshot extends SnapshotBase<never> {
  overall_status: string
  services: SystemService[]
  recent_errors: SystemError[]
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
