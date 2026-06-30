import type { ReactNode } from "react"
import type { JournalTradeItem } from "@/types/snapshots"
import { StatusPill, toneForDirection, toneForStatus } from "@/components/data-status/status-pill"
import { formatNumber, formatPrice } from "@/lib/data/format"
import { linkStatusForTrade, linkStatusLabel, linkStatusTone } from "@/lib/data/signal-trade-links"
import { formatArgTime } from "@/lib/data/status"

function Field({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="mt-1 text-sm text-foreground">{value}</div>
    </div>
  )
}

function formatDelta(value: number | null | undefined, suffix = "pts") {
  if (typeof value !== "number" || Number.isNaN(value)) return "N/D"
  return `${formatNumber(value, 4)} ${suffix}`
}

export function TradeDetailPanel({ trade }: { trade: JournalTradeItem | null }) {
  if (!trade) {
    return (
      <aside className="rounded-lg border border-border bg-card p-4">
        <h3 className="font-heading text-base font-semibold text-foreground">Detalle Journal</h3>
        <p className="mt-2 text-sm text-muted-foreground">Selecciona una operacion para revisar ejecucion y vinculo con senal.</p>
      </aside>
    )
  }

  const link = trade.tradeLink
  const plan = link?.signalPlan
  const execution = link?.tradeExecution
  const linkStatus = linkStatusForTrade(trade)

  return (
    <aside className="rounded-lg border border-border bg-card p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-heading text-base font-semibold text-foreground">{trade.symbol ?? "N/D"}</h3>
          <p className="mt-1 break-all font-mono text-xs text-muted-foreground">{trade.tradeId}</p>
        </div>
        <StatusPill label={linkStatusLabel(linkStatus)} tone={linkStatusTone(linkStatus)} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="Entrada" value={<span className="font-mono">{formatArgTime(trade.entryTimeUtc)}</span>} />
        <Field label="Direccion" value={<StatusPill label={(trade.direction ?? "-").toUpperCase()} tone={toneForDirection(trade.direction ?? "")} />} />
        <Field label="Estado trade" value={<StatusPill label={trade.tradeStatus ?? "N/D"} tone={toneForStatus(trade.tradeStatus)} />} />
        <Field label="Resultado" value={<StatusPill label={trade.resultStatus ?? "N/D"} tone={toneForStatus(trade.resultStatus)} />} />
        <Field label="Precio entrada" value={<span className="font-mono">{formatPrice(trade.entryPrice)}</span>} />
        <Field label="Precio salida" value={<span className="font-mono">{formatPrice(trade.exitPrice)}</span>} />
        <Field label="Neto" value={trade.netProfit === null ? "N/D" : formatNumber(trade.netProfit, 2)} />
        <Field label="Resultado R" value={trade.resultR === null ? "N/D" : formatNumber(trade.resultR, 2)} />
      </div>

      <div className="mt-4 rounded-md border border-border bg-secondary/20 p-3">
        <p className="font-heading text-sm font-semibold text-foreground">Senal vinculada</p>
        {!link ? (
          <p className="mt-2 text-sm text-muted-foreground">Sin senal vinculada. No se infiere plan desde el trade.</p>
        ) : (
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="event_id" value={<span className="break-all font-mono">{link.signalEventId ?? "N/D"}</span>} />
            <Field label="Estrategia senal" value={link.signal?.strategyName ?? trade.strategyName ?? "N/D"} />
            <Field label="Tipo link" value={link.linkType ?? "N/D"} />
            <Field label="Confianza" value={formatNumber(link.linkConfidence, 2)} />
          </div>
        )}
      </div>

      <div className="mt-4 rounded-md border border-border bg-secondary/20 p-3">
        <p className="font-heading text-sm font-semibold text-foreground">Plan vs ejecucion</p>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Base plan" value={plan?.baseId ?? "N/D"} />
          <Field label="Position ID" value={<span className="font-mono">{trade.positionId ?? execution?.positionId ?? "N/D"}</span>} />
          <Field label="Entrada plan" value={<span className="font-mono">{formatPrice(plan?.entryPrice)}</span>} />
          <Field label="Entrada real" value={<span className="font-mono">{formatPrice(execution?.entryPrice ?? trade.entryPrice)}</span>} />
          <Field label="SL plan" value={<span className="font-mono">{formatPrice(plan?.slPrice)}</span>} />
          <Field label="SL real" value={<span className="font-mono">{formatPrice(execution?.initialSlPrice ?? trade.initialSlPrice)}</span>} />
          <Field label="TP plan" value={<span className="font-mono">{formatPrice(plan?.tpPrice)}</span>} />
          <Field label="TP real" value={<span className="font-mono">{formatPrice(execution?.initialTpPrice ?? trade.initialTpPrice)}</span>} />
          <Field label="Delta entrada" value={<span className="font-mono">{formatDelta(link?.comparison.entryDeltaPoints)}</span>} />
          <Field label="Delta tiempo" value={formatDelta(link?.comparison.timeDeltaSeconds, "seg")} />
        </div>
      </div>
    </aside>
  )
}
