export interface RawSnapshotEnvelope<TItem = unknown> {
  schema_version?: string | null
  generated_at_utc?: string | null
  source_status?: "OK" | "EMPTY" | "STALE" | "ERROR" | "PARTIAL" | string | null
  snapshot_stale_after_seconds?: number | null
  snapshot_age_seconds?: number | null
  snapshot_status?: string | null
  error_message?: string | null
  items?: TItem[] | null
}

export interface SnapshotResponseMeta {
  headerGeneratedAtUtc?: string | null
  headerAgeSeconds?: number | null
  headerStaleAfterSeconds?: number | null
  headerStatus?: string | null
}

export interface SnapshotResponsePayload<TPayload = unknown> {
  body: TPayload
  meta?: SnapshotResponseMeta
}

export interface RawSignalPrimaryEntry {
  base_id?: string | null
  label?: string | null
  entry_type?: string | null
  entry_price?: number | null
  sl_price?: number | null
  tp_price?: number | null
  risk_reward?: number | null
}

export interface RawSignalsRecentItem {
  event_id: string
  bar_close_time_utc?: string | null
  bot_name?: string | null
  strategy_name?: string | null
  symbol?: string | null
  timeframe_signal?: string | null
  direction?: string | null
  score_total?: number | null
  score_label?: string | null
  signal_status?: string | null
  operation_status?: string | null
  telegram_sent?: boolean | number | null
  linked_trade_id?: string | null
  primary_entry?: RawSignalPrimaryEntry | null
}

export interface RawSignalCore {
  event_id?: string | null
  created_at_utc?: string | null
  bar_close_time_utc?: string | null
  bot_name?: string | null
  strategy_name?: string | null
  symbol?: string | null
  timeframe_signal?: string | null
  direction?: string | null
  score_total?: number | null
  score_label?: string | null
  signal_status?: string | null
  operation_status?: string | null
  result_status?: string | null
  linked_trade_id?: string | null
}

export interface RawSignalEntry extends RawSignalPrimaryEntry {
  is_primary?: boolean | number | null
  entry_status?: string | null
  risk_percent?: number | null
  sl_protected_by_emas?: boolean | number | null
  sl_protected_by_ema8?: boolean | number | null
  sl_protected_by_ema21?: boolean | number | null
  sl_protected_by_ema50?: boolean | number | null
  sl_protection_details?: string | null
}

export interface RawSignalCondition {
  condition_code?: string | null
  label?: string | null
  category?: string | null
  timeframe?: string | null
  status?: string | null
  severity?: string | null
  score_points?: number | null
  expected_value?: string | null
  actual_value?: string | null
  numeric_value?: number | null
  unit?: string | null
  details?: string | null
}

export interface RawLinkedTrade {
  trade_id?: string | null
  linked_trade_id?: string | null
  link_status?: string | null
  link_confidence?: number | null
  position_id?: string | number | null
  link_type?: string | null
  match_score_total?: number | null
  match_score_max?: number | null
}

export interface RawSignalStatuses {
  telegram_sent?: boolean | number | null
  telegram_sent_at_utc?: string | null
  signal_status?: string | null
  operation_status?: string | null
  result_status?: string | null
}

export interface RawSignalsBoardItem {
  signal?: RawSignalCore | null
  entries?: RawSignalEntry[] | null
  conditions?: RawSignalCondition[] | null
  raw_telegram_text?: string | null
  linked_trade?: RawLinkedTrade | null
  statuses?: RawSignalStatuses | null
}

export interface RawJournalTradesResponse {
  schema_version?: string
  source_status?: "OK" | "EMPTY" | string
  generated_at_utc?: string | null
  items?: RawJournalTradeItem[]
}

export interface RawJournalTradeItem {
  trade_id: string
  platform?: string | null
  environment?: string | null
  symbol?: string | null
  direction?: string | null
  strategy_name?: string | null
  entry_time_utc?: string | null
  entry_price?: number | null
  initial_sl_price?: number | null
  initial_tp_price?: number | null
  volume?: number | null
  position_id?: string | number | null
  trade_status?: string | null
  linked_signal_event_id?: string | null
  closed_at_utc?: string | null
  exit_price?: number | null
  net_profit?: number | null
  commission?: number | null
  swap?: number | null
  result_pips?: number | null
  result_r?: number | null
  close_reason?: string | null
  result_status?: string | null
  mae_pips?: number | null
  mfe_pips?: number | null
  review_status?: string | null
  mistake_type?: string | null
  rule_compliance_score?: number | null
  journal_notes?: string | null
}

export interface RawSystemStatusResponse {
  generated_at_utc?: string | null
  db_status?: string | null
  last_signal_at_utc?: string | null
  last_telegram_sent_at_utc?: string | null
  last_error_at_utc?: string | null
  recent_errors_count?: number | null
  snapshot_status?: "OK" | "STALE" | string
  snapshot_age_seconds?: number | null
  snapshot_stale_after_seconds?: number | null
}

export interface RawSignalTradeLinkSignal {
  event_id?: string | null
  bar_close_time_utc?: string | null
  bot_name?: string | null
  strategy_name?: string | null
  symbol?: string | null
  timeframe_signal?: string | null
  direction?: string | null
  score_total?: number | null
}

export interface RawSignalTradeLinkSignalPlan {
  base_id?: string | null
  label?: string | null
  entry_price?: number | null
  sl_price?: number | null
  tp_price?: number | null
  risk_reward?: number | null
}

export interface RawSignalTradeLinkTradeExecution {
  trade_id?: string | null
  position_id?: string | number | null
  platform?: string | null
  environment?: string | null
  symbol?: string | null
  direction?: string | null
  entry_time_utc?: string | null
  entry_price?: number | null
  initial_sl_price?: number | null
  initial_tp_price?: number | null
  trade_status?: string | null
  result_status?: string | null
}

export interface RawSignalTradeLinkItem {
  link_id?: string | null
  signal_event_id?: string | null
  trade_id?: string | null
  position_id?: string | number | null
  link_status?: string | null
  link_type?: string | null
  link_confidence?: number | null
  match_score_total?: number | null
  match_score_max?: number | null
  match_time?: boolean | number | null
  match_symbol?: boolean | number | null
  match_direction?: boolean | number | null
  match_entry_price?: boolean | number | null
  match_sl?: boolean | number | null
  match_tp?: boolean | number | null
  matched_by_symbol?: boolean | number | null
  matched_by_direction?: boolean | number | null
  matched_by_time_window?: boolean | number | null
  matched_by_price_distance?: boolean | number | null
  matched_by_entry_distance?: boolean | number | null
  matched_by_strategy?: boolean | number | null
  matched_by_account?: boolean | number | null
  time_delta_seconds?: number | null
  entry_delta_points?: number | null
  sl_delta_points?: number | null
  tp_delta_points?: number | null
  signal?: RawSignalTradeLinkSignal | null
  signal_plan?: RawSignalTradeLinkSignalPlan | null
  trade_execution?: RawSignalTradeLinkTradeExecution | null
  is_test?: boolean | number | null
  test_case_id?: string | null
  test_case_label?: string | null
  created_at_utc?: string | null
  updated_at_utc?: string | null
  created_by?: string | null
  updated_by?: string | null
  notes?: string | null
}
