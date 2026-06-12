"use client"

import type { SignalBoardItem } from "@/types/snapshots"
import { StatusPill, toneForDirection, toneForStatus } from "@/components/data-status/status-pill"
import { formatNumber, formatOperationalTime, formatPrice, getPrimaryEntry } from "@/lib/data/format"
import { cn } from "@/lib/utils"

const signalGrid =
  "grid-cols-[130px_110px_150px_90px_60px_90px_95px_90px_90px_90px_100px_110px_120px_110px]"

function scoreLabel(signal: SignalBoardItem) {
  if (typeof signal.score_total !== "number") return "-"
  return signal.score_label ? `${formatNumber(signal.score_total, 1)} ${signal.score_label}` : formatNumber(signal.score_total, 1)
}

export function SignalRow({
  signal,
  selected,
  onSelect,
}: {
  signal: SignalBoardItem
  selected: boolean
  onSelect: () => void
}) {
  const entry = getPrimaryEntry(signal.entries)
  const operationStatus = signal.operation_status ?? signal.signal_status
  const linkedTrade = signal.linked_trade?.trade_id ?? "-"

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "grid w-full min-w-[1420px] gap-3 border-t border-border px-4 py-3 text-left text-sm transition-colors hover:bg-secondary/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary",
        signalGrid,
        selected && "bg-primary/10",
      )}
    >
      <div className="font-mono text-xs text-muted-foreground">{formatOperationalTime(signal.bar_close_time_local, signal.bar_close_time_utc)}</div>
      <div className="truncate">{signal.bot_name}</div>
      <div className="truncate text-primary">{signal.strategy_name}</div>
      <div className="font-mono">{signal.symbol}</div>
      <div>{signal.timeframe_signal}</div>
      <div>
        <StatusPill label={signal.direction.toUpperCase()} tone={toneForDirection(signal.direction)} />
      </div>
      <div>{scoreLabel(signal)}</div>
      <div className="font-mono">{formatPrice(entry?.entry_price)}</div>
      <div className="font-mono">{formatPrice(entry?.sl_price)}</div>
      <div className="font-mono">{formatPrice(entry?.tp_price)}</div>
      <div>
        <StatusPill label={signal.telegram_sent ? "Sí" : "No"} tone={signal.telegram_sent ? "success" : "neutral"} />
      </div>
      <div>
        <StatusPill label={operationStatus} tone={toneForStatus(operationStatus)} />
      </div>
      <div className="truncate font-mono text-xs">{linkedTrade}</div>
      <div className="font-medium text-primary">Ver detalle</div>
    </button>
  )
}

export function SignalMobileCard({
  signal,
  selected,
  onSelect,
}: {
  signal: SignalBoardItem
  selected: boolean
  onSelect: () => void
}) {
  const entry = getPrimaryEntry(signal.entries)
  const operationStatus = signal.operation_status ?? signal.signal_status

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "w-full rounded-lg border border-border bg-card p-4 text-left transition-colors hover:bg-secondary/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary",
        selected && "border-primary bg-primary/10",
      )}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xs text-muted-foreground">{formatOperationalTime(signal.bar_close_time_local, signal.bar_close_time_utc)}</p>
          <h3 className="mt-1 font-heading text-base font-semibold text-foreground">{signal.strategy_name}</h3>
          <p className="text-sm text-muted-foreground">
            {signal.symbol} · {signal.timeframe_signal}
          </p>
        </div>
        <StatusPill label={signal.direction.toUpperCase()} tone={toneForDirection(signal.direction)} />
      </div>
      <div className="grid grid-cols-3 gap-2 text-sm">
        <div>
          <p className="text-[11px] uppercase text-muted-foreground">Entrada</p>
          <p className="font-mono">{formatPrice(entry?.entry_price)}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase text-muted-foreground">SL</p>
          <p className="font-mono">{formatPrice(entry?.sl_price)}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase text-muted-foreground">TP</p>
          <p className="font-mono">{formatPrice(entry?.tp_price)}</p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <StatusPill label={`Score ${scoreLabel(signal)}`} tone="info" />
        <StatusPill label={operationStatus} tone={toneForStatus(operationStatus)} />
        {signal.entries.length > 1 && <StatusPill label={`${signal.entries.length} bases`} tone="neutral" />}
      </div>
    </button>
  )
}

export { signalGrid }
