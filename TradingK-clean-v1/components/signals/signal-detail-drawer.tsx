"use client"

import type { SignalBoardItem } from "@/types/snapshots"
import { StatusPill, toneForDirection, toneForStatus } from "@/components/data-status/status-pill"
import { formatNumber } from "@/lib/data/format"
import { SignalConditionsPanel } from "./signal-conditions-panel"
import { SignalDebugPanel } from "./signal-debug-panel"
import { SignalEntriesPanel } from "./signal-entries-panel"
import { SignalLinkTradePanel } from "./signal-link-trade-panel"
import { SignalTelegramPanel } from "./signal-telegram-panel"

function WarningsPanel({ signal }: { signal: SignalBoardItem }) {
  const warnings = signal.warnings ?? []
  return (
    <section className="rounded-lg border border-border p-4">
      <h4 className="font-heading text-sm font-semibold text-foreground">Warnings</h4>
      {warnings.length === 0 ? (
        <p className="mt-2 text-sm text-muted-foreground">Sin warnings reportados.</p>
      ) : (
        <ul className="mt-3 space-y-2 text-sm text-foreground/80">
          {warnings.map((warning) => (
            <li key={warning} className="rounded-md bg-amber-500/10 p-2 text-amber-100">
              {warning}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export function SignalDetailDrawer({ signal }: { signal: SignalBoardItem | null }) {
  if (!signal) {
    return (
      <aside className="glass rounded-lg p-5">
        <h3 className="font-heading text-lg font-semibold text-foreground">Detalle de señal</h3>
        <p className="mt-2 text-sm text-muted-foreground">Seleccioná una fila para ver evidencia, plan y debug.</p>
      </aside>
    )
  }

  const operationStatus = signal.operation_status ?? signal.signal_status

  return (
    <aside className="glass space-y-4 rounded-lg p-5">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-heading text-lg font-semibold text-foreground">
            {signal.strategy_name} / {signal.symbol}
          </h3>
          <StatusPill label={signal.direction.toUpperCase()} tone={toneForDirection(signal.direction)} />
          <StatusPill label={signal.timeframe_signal} tone="neutral" />
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          <StatusPill label={`Score ${formatNumber(signal.score_total, 1)}`} tone="info" />
          <StatusPill label={operationStatus} tone={toneForStatus(operationStatus)} />
        </div>
        <p className="mt-2 break-all text-sm text-muted-foreground">event_id: {signal.event_id}</p>
      </div>
      <SignalTelegramPanel signal={signal} />
      <SignalEntriesPanel signal={signal} />
      <SignalConditionsPanel signal={signal} />
      <WarningsPanel signal={signal} />
      <SignalLinkTradePanel signal={signal} />
      <SignalDebugPanel signal={signal} />
    </aside>
  )
}
