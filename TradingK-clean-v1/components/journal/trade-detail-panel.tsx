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

function yesNo(value: boolean | null | undefined) {
  if (value === true) return "Si"
  if (value === false) return "No"
  return "N/D"
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
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-heading text-base font-semibold text-foreground">{trade.symbol ?? "N/D"}</h3>
            {link?.isTest && <StatusPill label="TEST" tone="mock" />}
          </div>
          <p className="mt-1 break-all font-mono text-xs text-muted-foreground">{trade.tradeId}</p>
        </div>
        <StatusPill label={linkStatusLabel(linkStatus)} tone={linkStatusTone(linkStatus)} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="Entrada" value={<span className="font-mono">{formatArgTime(trade.entryTimeUtc)}</span>} />
        <Field label="Direccion" value={<StatusPill label={(trade.direction ?? "N/D").toUpperCase()} tone={toneForDirection(trade.direction ?? "")} />} />
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
          <p className="mt-2 text-sm text-muted-foreground">Trade sin senal vinculada.</p>
        ) : (
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Event ID" value={<span className="break-all font-mono">{link.signalEventId ?? "N/D"}</span>} />
            <Field label="Estrategia senal" value={link.signal?.strategyName ?? trade.strategyName ?? "N/D"} />
            <Field label="Tipo link" value={link.linkType ?? "N/D"} />
            <Field label="Confianza" value={formatNumber(link.linkConfidence, 2)} />
            <Field label="Score" value={link.matchScoreTotal == null ? "N/D" : `${formatNumber(link.matchScoreTotal, 2)} / ${formatNumber(link.matchScoreMax, 2)}`} />
            <Field label="Test case" value={link.isTest ? `${link.testCaseId ?? "N/D"} ${link.testCaseLabel ?? ""}`.trim() : "N/D"} />
          </div>
        )}
      </div>

      {link ? (
        <>
          <div className="mt-4 rounded-md border border-border bg-secondary/20 p-3">
            <p className="font-heading text-sm font-semibold text-foreground">Motivos de matching</p>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <Field label="Simbolo" value={yesNo(link.matchedBySymbol)} />
              <Field label="Direccion" value={yesNo(link.matchedByDirection)} />
              <Field label="Ventana tiempo" value={yesNo(link.matchedByTimeWindow)} />
              <Field label="Distancia entrada" value={yesNo(link.matchedByEntryDistance)} />
              <Field label="Estrategia" value={yesNo(link.matchedByStrategy)} />
              <Field label="Cuenta/entorno" value={yesNo(link.matchedByAccount)} />
            </div>
          </div>

          <div className="mt-4 rounded-md border border-border bg-secondary/20 p-3">
            <p className="font-heading text-sm font-semibold text-foreground">Plan sugerido vs ejecucion real</p>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Base plan" value={plan?.baseId ?? "N/D"} />
              <Field label="Position ID" value={<span className="font-mono">{trade.positionId ?? execution?.positionId ?? "N/D"}</span>} />
              <Field label="Entrada plan" value={<span className="font-mono">{formatPrice(plan?.entryPrice)}</span>} />
              <Field label="Entrada real" value={<span className="font-mono">{formatPrice(execution?.entryPrice ?? trade.entryPrice)}</span>} />
              <Field label="SL plan" value={<span className="font-mono">{formatPrice(plan?.slPrice)}</span>} />
              <Field label="SL inicial real" value={<span className="font-mono">{formatPrice(execution?.initialSlPrice ?? trade.initialSlPrice)}</span>} />
              <Field label="TP plan" value={<span className="font-mono">{formatPrice(plan?.tpPrice)}</span>} />
              <Field label="TP inicial real" value={<span className="font-mono">{formatPrice(execution?.initialTpPrice ?? trade.initialTpPrice)}</span>} />
              <Field label="R:R" value={formatNumber(plan?.riskReward, 2)} />
              <Field label="Trade status" value={<StatusPill label={execution?.tradeStatus ?? trade.tradeStatus ?? "N/D"} tone={toneForStatus(execution?.tradeStatus ?? trade.tradeStatus)} />} />
              <Field label="Delta entrada" value={<span className="font-mono">{formatDelta(link.comparison.entryDeltaPoints)}</span>} />
              <Field label="Delta SL" value={<span className="font-mono">{formatDelta(link.comparison.slDeltaPoints)}</span>} />
              <Field label="Delta TP" value={<span className="font-mono">{formatDelta(link.comparison.tpDeltaPoints)}</span>} />
              <Field label="Delta tiempo" value={formatDelta(link.comparison.timeDeltaSeconds, "seg")} />
            </div>
          </div>
        </>
      ) : (
        <p className="mt-4 rounded-md border border-border bg-secondary/20 p-3 text-sm text-muted-foreground">
          No se muestra comparacion plan vs ejecucion porque no existe link real ni caso test explicito.
        </p>
      )}
    </aside>
  )
}
