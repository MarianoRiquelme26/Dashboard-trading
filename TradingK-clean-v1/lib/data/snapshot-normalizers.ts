import type {
  RawJournalTradeItem,
  RawJournalTradesResponse,
  RawLinkedTrade,
  RawSignalTradeLinkItem,
  RawSignalCore,
  RawSignalCondition,
  RawSignalEntry,
  RawSignalPrimaryEntry,
  RawSignalStatuses,
  RawSignalsBoardItem,
  RawSignalsRecentItem,
  RawSnapshotEnvelope,
  SnapshotResponseMeta,
  SnapshotResponsePayload,
  RawSystemStatusResponse,
} from "@/types/snapshot-api"
import type {
  JournalTradeItem,
  JournalTradesSnapshot,
  LinkedTrade,
  RecentSignalItem,
  SignalPlanSnapshot,
  SignalBoardItem,
  SignalCondition,
  SignalEntry,
  SignalTradeComparison,
  SignalTradeLink,
  SignalTradeLinkSignalSnapshot,
  SignalTradeLinkStatus,
  SignalTradeLinksSnapshot,
  SignalTradeMatchFlags,
  SignalsBoardSnapshot,
  SignalsRecentSnapshot,
  SystemStatusSnapshot,
  TradeExecutionSnapshot,
  UiDataStatus,
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

function asNullableBoolean(value: unknown): boolean | null {
  if (value === null || value === undefined) return null
  if (value === true || value === 1 || value === "1") return true
  if (value === false || value === 0 || value === "0") return false
  return null
}

function unwrapSnapshotPayload(raw: unknown): { body: unknown; responseMeta: SnapshotResponseMeta } {
  if (isRecord(raw) && "body" in raw) {
    const payload = raw as unknown as SnapshotResponsePayload
    return { body: payload.body, responseMeta: payload.meta ?? {} }
  }
  return { body: raw, responseMeta: {} }
}

function asEnvelope<TItem>(body: unknown): RawSnapshotEnvelope<TItem> | null {
  if (!isRecord(body) || !Array.isArray(body.items)) return null
  return body as RawSnapshotEnvelope<TItem>
}

function envelopeItems<TItem>(body: unknown): TItem[] {
  const envelope = asEnvelope<TItem>(body)
  if (envelope) return asArray<TItem>(envelope.items)
  return asArray<TItem>(body)
}

function statusFromEnvelope(
  envelope: RawSnapshotEnvelope | null,
  responseMeta: SnapshotResponseMeta,
  itemCount: number,
): UiDataStatus {
  const sourceStatus = asString(envelope?.source_status)
  const snapshotStatus = asString(envelope?.snapshot_status) ?? responseMeta.headerStatus
  if (sourceStatus === "EMPTY" || (sourceStatus === "OK" && itemCount === 0)) return "empty"
  if (sourceStatus === "ERROR") return "error"
  if (snapshotStatus === "STALE" && itemCount > 0) return "stale"
  return statusFromItems(sourceStatus, itemCount)
}

function snapshotMetaFromEnvelope(
  envelope: RawSnapshotEnvelope | null,
  responseMeta: SnapshotResponseMeta,
  itemCount: number,
) {
  const generatedAtUtc = asString(envelope?.generated_at_utc) ?? responseMeta.headerGeneratedAtUtc ?? null
  const staleAfterSeconds = asNumber(envelope?.snapshot_stale_after_seconds) ?? responseMeta.headerStaleAfterSeconds ?? null
  const ageSeconds = asNumber(envelope?.snapshot_age_seconds) ?? responseMeta.headerAgeSeconds ?? snapshotAgeSeconds(generatedAtUtc)
  const sourceStatus = asString(envelope?.source_status) ?? asString(envelope?.snapshot_status) ?? responseMeta.headerStatus
  return {
    status: statusFromEnvelope(envelope, responseMeta, itemCount),
    generatedAtUtc,
    staleAfterSeconds,
    ageSeconds,
    sourceStatus,
  }
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

export function normalizeLinkStatus(value: string | null | undefined): SignalTradeLinkStatus {
  if (value === "auto_linked" || value === "suggested" || value === "ambiguous" || value === "manual_linked" || value === "rejected") {
    return value
  }
  return "unlinked"
}

function normalizeSignalPlan(plan: RawSignalTradeLinkItem["signal_plan"]): SignalPlanSnapshot | null {
  if (!plan) return null
  return {
    baseId: asString(plan.base_id),
    label: asString(plan.label),
    entryPrice: asNumber(plan.entry_price),
    slPrice: asNumber(plan.sl_price),
    tpPrice: asNumber(plan.tp_price),
    riskReward: asNumber(plan.risk_reward),
  }
}

function normalizeTradeExecution(execution: RawSignalTradeLinkItem["trade_execution"], fallback: RawSignalTradeLinkItem): TradeExecutionSnapshot | null {
  const tradeId = asString(execution?.trade_id) ?? asString(fallback.trade_id)
  const positionId = execution?.position_id == null ? fallback.position_id : execution.position_id
  if (!tradeId && positionId == null) return null
  return {
    tradeId,
    positionId: positionId == null ? null : String(positionId),
    platform: asString(execution?.platform),
    environment: asString(execution?.environment),
    symbol: asString(execution?.symbol),
    direction: asString(execution?.direction),
    entryTimeUtc: asString(execution?.entry_time_utc),
    entryPrice: asNumber(execution?.entry_price),
    initialSlPrice: asNumber(execution?.initial_sl_price),
    initialTpPrice: asNumber(execution?.initial_tp_price),
    tradeStatus: asString(execution?.trade_status),
    resultStatus: asString(execution?.result_status),
  }
}

function normalizeLinkSignal(signal: RawSignalTradeLinkItem["signal"], fallback: RawSignalTradeLinkItem): SignalTradeLinkSignalSnapshot | null {
  const eventId = asString(signal?.event_id) ?? asString(fallback.signal_event_id)
  if (!eventId) return null
  return {
    eventId,
    barCloseTimeUtc: asString(signal?.bar_close_time_utc),
    botName: asString(signal?.bot_name),
    strategyName: asString(signal?.strategy_name),
    symbol: asString(signal?.symbol),
    timeframeSignal: asString(signal?.timeframe_signal),
    direction: asString(signal?.direction),
    scoreTotal: asNumber(signal?.score_total),
  }
}

function normalizeLinkMatches(item: RawSignalTradeLinkItem): SignalTradeMatchFlags {
  const matchedByTimeWindow = asNullableBoolean(item.matched_by_time_window) ?? asNullableBoolean(item.match_time)
  const matchedBySymbol = asNullableBoolean(item.matched_by_symbol) ?? asNullableBoolean(item.match_symbol)
  const matchedByDirection = asNullableBoolean(item.matched_by_direction) ?? asNullableBoolean(item.match_direction)
  const matchedByEntryDistance =
    asNullableBoolean(item.matched_by_entry_distance) ??
    asNullableBoolean(item.matched_by_price_distance) ??
    asNullableBoolean(item.match_entry_price)
  return {
    time: matchedByTimeWindow,
    symbol: matchedBySymbol,
    direction: matchedByDirection,
    entryPrice: matchedByEntryDistance,
    entryDistance: matchedByEntryDistance,
    strategy: asNullableBoolean(item.matched_by_strategy),
    account: asNullableBoolean(item.matched_by_account),
    sl: asNullableBoolean(item.match_sl),
    tp: asNullableBoolean(item.match_tp),
  }
}

function normalizeLinkComparison(item: RawSignalTradeLinkItem): SignalTradeComparison {
  return {
    timeDeltaSeconds: asNumber(item.time_delta_seconds),
    entryDeltaPoints: asNumber(item.entry_delta_points),
    slDeltaPoints: asNumber(item.sl_delta_points),
    tpDeltaPoints: asNumber(item.tp_delta_points),
  }
}

function normalizeSignalTradeLinkItem(item: RawSignalTradeLinkItem): SignalTradeLink {
  const matches = normalizeLinkMatches(item)
  return {
    linkId: asString(item.link_id),
    signalEventId: asString(item.signal_event_id) ?? asString(item.signal?.event_id),
    tradeId: asString(item.trade_id) ?? asString(item.trade_execution?.trade_id),
    positionId: item.position_id == null ? (item.trade_execution?.position_id == null ? null : String(item.trade_execution.position_id)) : String(item.position_id),
    linkStatus: normalizeLinkStatus(asString(item.link_status)),
    linkType: asString(item.link_type),
    linkConfidence: asNumber(item.link_confidence),
    matchScoreTotal: asNumber(item.match_score_total),
    matchScoreMax: asNumber(item.match_score_max),
    matchedBySymbol: matches.symbol,
    matchedByDirection: matches.direction,
    matchedByTimeWindow: matches.time,
    matchedByEntryDistance: matches.entryDistance,
    matchedByStrategy: matches.strategy,
    matchedByAccount: matches.account,
    matches,
    comparison: normalizeLinkComparison(item),
    signal: normalizeLinkSignal(item.signal, item),
    signalPlan: normalizeSignalPlan(item.signal_plan),
    tradeExecution: normalizeTradeExecution(item.trade_execution, item),
    isTest: asBoolean(item.is_test),
    testCaseId: asString(item.test_case_id),
    testCaseLabel: asString(item.test_case_label),
    createdAtUtc: asString(item.created_at_utc),
    updatedAtUtc: asString(item.updated_at_utc),
    createdBy: asString(item.created_by),
    updatedBy: asString(item.updated_by),
    notes: asString(item.notes),
  }
}

export function normalizeSignalsRecent(raw: unknown): SignalsRecentSnapshot {
  const { body, responseMeta } = unwrapSnapshotPayload(raw)
  const envelope = asEnvelope<RawSignalsRecentItem>(body)
  const items = envelopeItems<RawSignalsRecentItem>(body)
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
  const meta = snapshotMetaFromEnvelope(envelope, responseMeta, items.length)

  return {
    ...meta,
    items,
  }
}

export function normalizeSignalsBoard(raw: unknown): SignalsBoardSnapshot {
  const { body, responseMeta } = unwrapSnapshotPayload(raw)
  const envelope = asEnvelope<RawSignalsBoardItem>(body)
  const items = envelopeItems<RawSignalsBoardItem>(body)
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
        tradeLink: null,
        warnings: [],
        raw: item,
      }
    })
  const meta = snapshotMetaFromEnvelope(envelope, responseMeta, items.length)

  return {
    ...meta,
    items,
  }
}

export function normalizeJournalTrades(raw: unknown): JournalTradesSnapshot {
  const { body, responseMeta } = unwrapSnapshotPayload(raw)
  const response = isRecord(body) ? (body as RawJournalTradesResponse) : {}
  const envelope = asEnvelope<RawJournalTradeItem>(body)
  const rawItems = envelope ? envelopeItems<RawJournalTradeItem>(body) : asArray<RawJournalTradeItem>(response.items)
  const items = rawItems
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
      tradeLink: null,
    }))
  const meta = snapshotMetaFromEnvelope(envelope, responseMeta, items.length)

  return {
    ...meta,
    items,
    schemaVersion: asString(response.schema_version),
  }
}

export function normalizeSystemStatus(raw: unknown): SystemStatusSnapshot {
  const { body, responseMeta } = unwrapSnapshotPayload(raw)
  const envelope = asEnvelope<RawSystemStatusResponse>(body)
  const response = envelopeItems<RawSystemStatusResponse>(body)[0] ?? (isRecord(body) ? (body as RawSystemStatusResponse) : {})
  const meta = snapshotMetaFromEnvelope(envelope, responseMeta, envelope ? envelopeItems<RawSystemStatusResponse>(body).length : 1)
  const legacySourceStatus = isRecord(body) ? asString(body.source_status) : null
  const status = meta.status === "empty" || legacySourceStatus === "EMPTY" ? "empty" : meta.status === "stale" ? "stale" : statusFromSystemSnapshot(response.snapshot_status)
  return {
    ...meta,
    status,
    generatedAtUtc: asString(response.generated_at_utc) ?? meta.generatedAtUtc ?? null,
    dbStatus: asString(response.db_status),
    lastSignalAtUtc: asString(response.last_signal_at_utc),
    lastTelegramSentAtUtc: asString(response.last_telegram_sent_at_utc),
    lastErrorAtUtc: asString(response.last_error_at_utc),
    recentErrorsCount: asNumber(response.recent_errors_count),
    snapshotStatus: asString(response.snapshot_status),
    snapshotAgeSeconds: asNumber(response.snapshot_age_seconds) ?? meta.ageSeconds ?? null,
    snapshotStaleAfterSeconds: asNumber(response.snapshot_stale_after_seconds) ?? meta.staleAfterSeconds ?? null,
    ageSeconds: meta.ageSeconds ?? asNumber(response.snapshot_age_seconds),
    sourceStatus: meta.sourceStatus ?? asString(response.snapshot_status),
  }
}

export function normalizeSignalTradeLinks(raw: unknown): SignalTradeLinksSnapshot {
  const { body, responseMeta } = unwrapSnapshotPayload(raw)
  const envelope = asEnvelope<RawSignalTradeLinkItem>(body)
  const items = envelopeItems<RawSignalTradeLinkItem>(body)
    .filter((item) => isRecord(item))
    .map(normalizeSignalTradeLinkItem)
  const meta = snapshotMetaFromEnvelope(envelope, responseMeta, items.length)
  return {
    ...meta,
    schemaVersion: asString(envelope?.schema_version),
    items,
  }
}
