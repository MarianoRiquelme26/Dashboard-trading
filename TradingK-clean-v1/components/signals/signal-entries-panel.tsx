import type { SignalBoardItem } from "@/types/snapshots"
import { StatusPill } from "@/components/data-status/status-pill"
import { formatNumber, formatPercent, formatPrice } from "@/lib/data/format"

function boolLabel(value: boolean | null | undefined) {
  if (value === true) return "Si"
  if (value === false) return "No"
  return "N/D"
}

export function SignalEntriesPanel({ signal }: { signal: SignalBoardItem }) {
  return (
    <section className="rounded-lg border border-border p-4">
      <h4 className="font-heading text-sm font-semibold text-foreground">Plan sugerido</h4>
      {signal.entries.length === 0 ? (
        <p className="mt-2 text-sm text-muted-foreground">Sin entries en snapshot.</p>
      ) : (
        <div className="mt-3 grid grid-cols-1 gap-3">
          {signal.entries.map((entry) => (
            <div key={entry.baseId} className="rounded-lg bg-secondary/30 p-3 text-sm">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <p className="font-medium text-foreground">{entry.label ?? entry.baseId}</p>
                <StatusPill label={entry.entryStatus ?? "sin estado"} tone="neutral" />
              </div>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <p>baseId: {entry.baseId}</p>
                <p>Entrada: {formatPrice(entry.entryPrice)}</p>
                <p>SL: {formatPrice(entry.slPrice)}</p>
                <p>TP: {formatPrice(entry.tpPrice)}</p>
                <p>R:R: {formatNumber(entry.riskReward, 2)}</p>
                <p>Riesgo: {formatPercent(entry.riskPercent)}</p>
                <p>SL protegido: {boolLabel(entry.slProtectedByEmas)}</p>
                <p>EMA8: {boolLabel(entry.slProtectedByEma8)}</p>
                <p>EMA21: {boolLabel(entry.slProtectedByEma21)}</p>
                <p>EMA50: {boolLabel(entry.slProtectedByEma50)}</p>
              </div>
              {entry.slProtectionDetails && <p className="mt-2 text-muted-foreground">Detalle: {entry.slProtectionDetails}</p>}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
