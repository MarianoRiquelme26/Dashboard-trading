import type { SignalBoardItem } from "@/types/snapshots"
import { StatusPill } from "@/components/data-status/status-pill"
import { formatNumber, formatPercent, formatPrice } from "@/lib/data/format"

function boolLabel(value: boolean | null | undefined) {
  if (value === true) return "Sí"
  if (value === false) return "No"
  return "-"
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
            <div key={entry.base_id} className="rounded-lg bg-secondary/30 p-3 text-sm">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <p className="font-medium text-foreground">{entry.label ?? entry.base_id}</p>
                <StatusPill label={entry.entry_status ?? "sin estado"} tone="neutral" />
              </div>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <p>base_id: {entry.base_id}</p>
                <p>Entrada: {formatPrice(entry.entry_price)}</p>
                <p>SL: {formatPrice(entry.sl_price)}</p>
                <p>TP: {formatPrice(entry.tp_price)}</p>
                <p>R:R: {formatNumber(entry.risk_reward, 2)}</p>
                <p>Riesgo: {formatPercent(entry.risk_percent)}</p>
                <p>SL protegido: {boolLabel(entry.sl_protected_by_emas)}</p>
                <p>EMA8: {boolLabel(entry.sl_protected_by_ema8)}</p>
                <p>EMA21: {boolLabel(entry.sl_protected_by_ema21)}</p>
                <p>EMA50: {boolLabel(entry.sl_protected_by_ema50)}</p>
              </div>
              {entry.sl_protection_details && <p className="mt-2 text-muted-foreground">Detalle: {entry.sl_protection_details}</p>}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
