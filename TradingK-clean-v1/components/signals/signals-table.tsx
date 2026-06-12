"use client"

import type { SnapshotRecord } from "@/types/snapshots"
import { SignalRow, signalGrid } from "./signal-row"

const headers = ["Hora senal", "Bot", "Estrategia", "Simbolo", "TF", "Direccion", "Score", "Entrada", "SL", "TP", "Telegram", "Estado", "Trade"]

export function SignalsTable({
  items,
  selectedId,
  onSelect,
}: {
  items: SnapshotRecord["items"]
  selectedId: string | null
  onSelect: (signal: SnapshotRecord["items"][number]) => void
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <div className={`grid min-w-[1280px] gap-3 bg-secondary/50 px-4 py-3 text-[11px] uppercase tracking-wide text-muted-foreground ${signalGrid}`}>
        {headers.map((header) => (
          <div key={header}>{header}</div>
        ))}
      </div>
      {items.map((signal, index) => {
        const id = typeof signal.event_id === "string" ? signal.event_id : `signal-${index}`
        return <SignalRow key={id} signal={signal} selected={selectedId === id} onSelect={() => onSelect(signal)} />
      })}
    </div>
  )
}
