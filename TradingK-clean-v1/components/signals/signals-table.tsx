"use client"

import type { SignalBoardItem } from "@/types/snapshots"
import { SignalMobileCard, SignalRow, signalGrid } from "./signal-row"

const headers = [
  "Hora",
  "Bot",
  "Estrategia",
  "Símbolo",
  "TF",
  "Dirección",
  "Score",
  "Entrada",
  "SL",
  "TP",
  "Telegram",
  "Estado",
  "Trade",
  "Acción",
]

export function SignalsTable({
  items,
  selectedId,
  onSelect,
}: {
  items: SignalBoardItem[]
  selectedId: string | null
  onSelect: (signal: SignalBoardItem) => void
}) {
  return (
    <>
      <div className="hidden overflow-x-auto rounded-lg border border-border md:block">
        <div className={`grid min-w-[1420px] gap-3 bg-secondary/50 px-4 py-3 text-[11px] uppercase tracking-wide text-muted-foreground ${signalGrid}`}>
          {headers.map((header) => (
            <div key={header}>{header}</div>
          ))}
        </div>
        {items.map((signal) => (
          <SignalRow key={signal.event_id} signal={signal} selected={selectedId === signal.event_id} onSelect={() => onSelect(signal)} />
        ))}
      </div>
      <div className="space-y-3 md:hidden">
        {items.map((signal) => (
          <SignalMobileCard key={signal.event_id} signal={signal} selected={selectedId === signal.event_id} onSelect={() => onSelect(signal)} />
        ))}
      </div>
    </>
  )
}
