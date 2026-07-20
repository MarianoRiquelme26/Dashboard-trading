"use client"

import type { SignalBoardItem } from "@/types/snapshots"
import { StatusPill, toneForDirection, toneForStatus } from "@/components/data-status/status-pill"
import { formatNumber } from "@/lib/data/format"
import { hasExplicitTestMetadata, testCaseText } from "@/lib/data/signal-trade-links"
import { SignalConditionsPanel } from "./signal-conditions-panel"
import { SignalDebugPanel } from "./signal-debug-panel"
import { SignalEntriesPanel } from "./signal-entries-panel"
import { SignalLinkTradePanel } from "./signal-link-trade-panel"
import { SignalTelegramPanel } from "./signal-telegram-panel"

function WarningsPanel({ signal }: { signal: SignalBoardItem }) {
  return (
    <section className="rounded-lg border border-border p-4">
      <h4 className="font-heading text-sm font-semibold text-foreground">Warnings</h4>
      {signal.warnings.length === 0 ? (
        <p className="mt-2 text-sm text-muted-foreground">Sin warnings reportados.</p>
      ) : (
        <ul className="mt-3 space-y-2 text-sm text-foreground/80">
          {signal.warnings.map((warning) => (
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
        <h3 className="font-heading text-lg font-semibold text-foreground">Detalle de senal</h3>
        <p className="mt-2 text-sm text-muted-foreground">Selecciona una fila para ver evidencia, plan y debug.</p>
      </aside>
    )
  }

  const operationStatus = signal.operationStatus ?? signal.signalStatus ?? "sin estado"

  return (
    <aside className="glass space-y-4 rounded-lg p-5">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-heading text-lg font-semibold text-foreground">
            {signal.strategyName ?? "N/D"} / {signal.symbol ?? "N/D"}
          </h3>
          <StatusPill label={(signal.direction ?? "N/D").toUpperCase()} tone={toneForDirection(signal.direction ?? "")} />
          <StatusPill label={signal.timeframeSignal ?? "N/D"} tone="neutral" />
          {hasExplicitTestMetadata(signal) && <StatusPill label="TEST" tone="mock" />}
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          <StatusPill label={`Score ${formatNumber(signal.scoreTotal, 1)}`} tone="info" />
          <StatusPill label={operationStatus} tone={toneForStatus(operationStatus)} />
        </div>
        <p className="mt-2 break-all text-sm text-muted-foreground">eventId: {signal.eventId}</p>
        {hasExplicitTestMetadata(signal) && <p className="mt-1 text-sm text-muted-foreground">Test case: {testCaseText(signal)}</p>}
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
