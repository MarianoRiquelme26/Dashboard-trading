import type {
  RawJournalTradeItem,
  RawJournalTradesResponse,
  RawLinkedTrade,
  RawSignalCore,
  RawSignalCondition,
  RawSignalEntry,
  RawSignalPrimaryEntry,
  RawSignalStatuses,
  RawSignalsBoardItem,
  RawSignalsRecentItem,
  RawSystemStatusResponse,
} from "@/types/snapshot-api"
import type {
  JournalTradeItem,
  JournalTradesSnapshot,
  LinkedTrade,
  RecentSignalItem,
  SignalBoardItem,
  SignalCondition,
  SignalEntry,
  SignalsBoardSnapshot,
  SignalsRecentSnapshot,
  SystemStatusSnapshot,
} from "@/types/snapshots"
import { snapshotAgeSeconds, statusFromItems, statusFromSystemSnapshot } from "./snapshot-status"

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value)
}

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : []
}

function asString(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null
}

function asNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null
}

function asBoolean(value: unknown): boolean {
  return value === true || value === 1 || value === "1"
}

function normalizeEntry(entry: RawSignalEntry | RawSignalPrimaryEntry | null | undefined): SignalEntry | null {
  if (!entry) return null
  const baseId = asString(entry.base_id)
  if (!baseId) return null
  return {
    baseId,
    label: asString(entry.label),
    entryType: asString(entry.entry_type),
    entryPrice: asNumber(entry.entry_price),
    slPrice: asNumber(entry.sl_price),
    tpPrice: asNumber(entry.tp_price),
    riskReward: asNumber(entry.risk_reward),
    riskPercent: "risk_percent" in entry ? asNumber(entry.risk_percent) : null,
    entryStatus: "entry_status" in entry ? asString(entry.entry_status) : null,
    slProtectedByEmas: "sl_protected_by_emas" in entry ? asBoolean(entry.sl_protected_by_emas) : null,
    slProtectedByEma8: "sl_protected_by_ema8" in entry ? asBoolean(entry.sl_protected_by_ema8) : null,
    slProtectedByEma21: "sl_protected_by_ema21" in entry ? asBoolean(entry.sl_protected_by_ema21) : null,
    slProtectedByEma50: "sl_protected_by_ema50" in entry ? asBoolean(entry.sl_protected_by_ema50) : null,
    slProtectionDetails: "sl_protection_details" in entry ? asString(entry.sl_protection_details) : null,
  }
}

function normalizeCondition(condition: RawSignalCondition, index: number): SignalCondition {
  return {
    conditionCode: asString(condition.condition_code) ?? `condition_${index}`,
    label: asString(condition.label) ?? "Condicion sin label",
    category: asString(condition.category) ?? "other",
    timeframe: asString(condition.timeframe),
    status: asString(condition.status) ?? "unknown",
    severity: asString(condition.severity) ?? "unknown",
    scorePoints: asNumber(condition.score_points),
    expectedValue: asString(condition.expected_value),
    actualValue: asString(condition.actual_value),
    numericValue: asNumber(condition.numeric_value),
    unit: asString(condition.unit),
    details: asString(condition.details),
  }
}

function normalizeLinkedTrade(linkedTrade: RawLinkedTrade | null | undefined): LinkedTrade | null {
  if (!linkedTrade) return null
  const tradeId = asString(linkedTrade.trade_id) ?? asString(linkedTrade.linked_trade_id)
  if (!tradeId) return null
  return {
    tradeId,
    linkStatus: asString(linkedTrade.link_status),
    linkConfidence: asNumber(linkedTrade.link_confidence),
  }
}

export function normalizeSignalsRecent(raw: unknown): SignalsRecentSnapshot {
  const items = asArray<RawSignalsRecentItem>(raw)
    .filter((item) => isRecord(item) && typeof item.event_id === "string")
    .map<RecentSignalItem>((item) => ({
      eventId: item.event_id,
      barCloseTimeUtc: asString(item.bar_close_time_utc),
      botName: asString(item.bot_name),
      strategyName: asString(item.strategy_name),
      symbol: asString(item.symbol),
      timeframeSignal: asString(item.timeframe_signal),
      direction: asString(item.direction),
      scoreTotal: asNumber(item.score_total),
      scoreLabel: asString(item.score_label),
      signalStatus: asString(item.signal_status),
      operationStatus: asString(item.operation_status),
      telegramSent: asBoolean(item.telegram_sent),
      linkedTradeId: asString(item.linked_trade_id),
      primaryEntry: normalizeEntry(item.primary_entry),
    }))

  return {
    status: items.length > 0 ? "ready" : "empty",
    items,
    generatedAtUtc: null,
    staleAfterSeconds: 60,
    ageSeconds: null,
    sourceStatus: items.length > 0 ? "OK" : "EMPTY",
  }
}

export function normalizeSignalsBoard(raw: unknown): SignalsBoardSnapshot {
  const items = asArray<RawSignalsBoardItem>(raw)
    .filter((item) => isRecord(item))
    .map<SignalBoardItem>((item, index) => {
      const signal: RawSignalCore = item.signal ?? {}
      const statuses: RawSignalStatuses = item.statuses ?? {}
      const entries = asArray<RawSignalEntry>(item.entries).map(normalizeEntry).filter((entry): entry is SignalEntry => entry !== null)
      const linkedTrade = normalizeLinkedTrade(item.linked_trade as RawLinkedTrade | null | undefined)
      return {
        eventId: asString(signal.event_id) ?? `signal_${index}`,
        createdAtUtc: asString(signal.created_at_utc),
        barCloseTimeUtc: asString(signal.bar_close_time_utc),
        botName: asString(signal.bot_name),
        strategyName: asString(signal.strategy_name),
        symbol: asString(signal.symbol),
        timeframeSignal: asString(signal.timeframe_signal),
        direction: asString(signal.direction),
        scoreTotal: asNumber(signal.score_total),
        scoreLabel: asString(signal.score_label),
        signalStatus: asString(statuses.signal_status) ?? asString(signal.signal_status),
        operationStatus: asString(statuses.operation_status) ?? asString(signal.operation_status),
        resultStatus: asString(statuses.result_status) ?? asString(signal.result_status),
        telegramSent: asBoolean(statuses.telegram_sent),
        telegramSentAtUtc: asString(statuses.telegram_sent_at_utc),
        rawTelegramText: asString(item.raw_telegram_text),
        entries,
        conditions: asArray<RawSignalCondition>(item.conditions).map(normalizeCondition),
        linkedTrade,
        linkedTradeId: asString(signal.linked_trade_id) ?? linkedTrade?.tradeId ?? null,
        warnings: [],
        raw: item,
      }
    })

  return {
    status: items.length > 0 ? "ready" : "empty",
    items,
    generatedAtUtc: null,
    staleAfterSeconds: 60,
    ageSeconds: null,
    sourceStatus: items.length > 0 ? "OK" : "EMPTY",
  }
}

export function normalizeJournalTrades(raw: unknown): JournalTradesSnapshot {
  const response = isRecord(raw) ? (raw as RawJournalTradesResponse) : {}
  const items = asArray<RawJournalTradeItem>(response.items)
    .filter((item) => isRecord(item) && typeof item.trade_id === "string")
    .map<JournalTradeItem>((item) => ({
      tradeId: item.trade_id,
      platform: asString(item.platform),
      environment: asString(item.environment),
      symbol: asString(item.symbol),
      direction: asString(item.direction),
      strategyName: asString(item.strategy_name),
      entryTimeUtc: asString(item.entry_time_utc),
      entryPrice: asNumber(item.entry_price),
      initialSlPrice: asNumber(item.initial_sl_price),
      initialTpPrice: asNumber(item.initial_tp_price),
      volume: asNumber(item.volume),
      positionId: item.position_id == null ? null : String(item.position_id),
      tradeStatus: asString(item.trade_status),
      linkedSignalEventId: asString(item.linked_signal_event_id),
      closedAtUtc: asString(item.closed_at_utc),
      exitPrice: asNumber(item.exit_price),
      netProfit: asNumber(item.net_profit),
      commission: asNumber(item.commission),
      swap: asNumber(item.swap),
      resultPips: asNumber(item.result_pips),
      resultR: asNumber(item.result_r),
      closeReason: asString(item.close_reason),
      resultStatus: asString(item.result_status),
      maePips: asNumber(item.mae_pips),
      mfePips: asNumber(item.mfe_pips),
      reviewStatus: asString(item.review_status),
      mistakeType: asString(item.mistake_type),
      ruleComplianceScore: asNumber(item.rule_compliance_score),
      journalNotes: asString(item.journal_notes),
    }))

  return {
    status: statusFromItems(response.source_status, items.length),
    items,
    schemaVersion: asString(response.schema_version),
    generatedAtUtc: asString(response.generated_at_utc),
    staleAfterSeconds: null,
    ageSeconds: snapshotAgeSeconds(response.generated_at_utc),
    sourceStatus: asString(response.source_status),
  }
}

export function normalizeSystemStatus(raw: unknown): SystemStatusSnapshot {
  const response = isRecord(raw) ? (raw as RawSystemStatusResponse) : {}
  const legacySourceStatus = isRecord(raw) ? asString(raw.source_status) : null
  const status = legacySourceStatus === "EMPTY" ? "empty" : statusFromSystemSnapshot(response.snapshot_status)
  return {
    status,
    generatedAtUtc: asString(response.generated_at_utc),
    dbStatus: asString(response.db_status),
    lastSignalAtUtc: asString(response.last_signal_at_utc),
    lastTelegramSentAtUtc: asString(response.last_telegram_sent_at_utc),
    lastErrorAtUtc: asString(response.last_error_at_utc),
    recentErrorsCount: asNumber(response.recent_errors_count),
    snapshotStatus: asString(response.snapshot_status),
    snapshotAgeSeconds: asNumber(response.snapshot_age_seconds),
    snapshotStaleAfterSeconds: asNumber(response.snapshot_stale_after_seconds),
    ageSeconds: asNumber(response.snapshot_age_seconds),
    sourceStatus: asString(response.snapshot_status),
  }
}
