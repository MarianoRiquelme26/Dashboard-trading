"use client"

import type { SnapshotRecord } from "@/types/snapshots"
import { SignalConditionsPanel } from "./signal-conditions-panel"
import { SignalDebugPanel } from "./signal-debug-panel"
import { SignalEntriesPanel } from "./signal-entries-panel"
import { SignalLinkTradePanel } from "./signal-link-trade-panel"
import { SignalTelegramPanel } from "./signal-telegram-panel"

function text(value: unknown, fallback = "-") {
  return typeof value === "string" || typeof value === "number" ? String(value) : fallback
}

export function SignalDetailDrawer({ signal }: { signal: SnapshotRecord["items"][number] | null }) {
  if (!signal) {
    return (
      <aside className="glass rounded-lg p-5">
        <h3 className="font-heading text-lg font-semibold text-foreground">Detalle de senal</h3>
        <p className="mt-2 text-sm text-muted-foreground">Selecciona una fila para ver evidencia, plan y debug.</p>
      </aside>
    )
  }

  return (
    <aside className="glass space-y-4 rounded-lg p-5">
      <div>
        <h3 className="font-heading text-lg font-semibold text-foreground">
          {text(signal.strategy)} / {text(signal.symbol)}
        </h3>
        <p className="text-sm text-muted-foreground">event_id: {text(signal.event_id)}</p>
      </div>
      <SignalTelegramPanel signal={signal} />
      <SignalEntriesPanel signal={signal} />
      <SignalConditionsPanel signal={signal} />
      <SignalLinkTradePanel signal={signal} />
      <SignalDebugPanel signal={signal} />
    </aside>
  )
}
