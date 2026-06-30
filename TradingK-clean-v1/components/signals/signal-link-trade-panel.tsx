import type { ReactNode } from "react"
import type { SignalBoardItem } from "@/types/snapshots"
import { StatusPill, toneForStatus } from "@/components/data-status/status-pill"
import { formatNumber, formatPrice, getPrimaryEntry } from "@/lib/data/format"
import { linkStatusForSignal, linkStatusLabel, linkStatusTone, linkTradeId } from "@/lib/data/signal-trade-links"

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

export function SignalLinkTradePanel({ signal }: { signal: SignalBoardItem }) {
  const trade = signal.linkedTrade
  const link = signal.tradeLink
  const linkStatus = linkStatusForSignal(signal)
  const plan = link?.signalPlan
  const execution = link?.tradeExecution
  const fallbackPlan = getPrimaryEntry(signal.entries)

  return (
    <section className="rounded-lg border border-border p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="font-heading text-sm font-semibold text-foreground">Vinculacion senal / trade</h4>
        <StatusPill label={linkStatusLabel(linkStatus)} tone={linkStatusTone(linkStatus)} />
      </div>

      {!trade && !link ? (
        <div className="mt-4 space-y-4">
          <p className="text-sm text-muted-foreground">
            Sin trade vinculado. No se infiere resultado desde la senal ni se muestran acciones manuales hasta que exista endpoint seguro.
          </p>
          <div className="rounded-md border border-border bg-secondary/20 p-3">
            <p className="mb-3 font-heading text-sm font-semibold text-foreground">Plan sugerido vs ejecucion real</p>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <Field label="Base" value={fallbackPlan?.baseId ?? "N/D"} />
              <Field label="Entrada plan" value={<span className="font-mono">{formatPrice(fallbackPlan?.entryPrice)}</span>} />
              <Field label="Entrada trade" value={<span className="font-mono">N/D</span>} />
              <Field label="SL plan" value={<span className="font-mono">{formatPrice(fallbackPlan?.slPrice)}</span>} />
              <Field label="SL trade" value={<span className="font-mono">N/D</span>} />
              <Field label="Delta SL" value={<span className="font-mono">N/D</span>} />
              <Field label="TP plan" value={<span className="font-mono">{formatPrice(fallbackPlan?.tpPrice)}</span>} />
              <Field label="TP trade" value={<span className="font-mono">N/D</span>} />
              <Field label="Delta TP" value={<span className="font-mono">N/D</span>} />
              <Field label="Delta entrada" value={<span className="font-mono">N/D</span>} />
              <Field label="Delta tiempo" value="N/D" />
              <Field label="Notas" value="N/D" />
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <Field label="trade_id" value={<span className="font-mono">{linkTradeId(signal) ?? "N/D"}</span>} />
            <Field label="position_id" value={<span className="font-mono">{link?.positionId ?? execution?.positionId ?? "N/D"}</span>} />
            <Field label="Tipo" value={link?.linkType ?? trade?.linkStatus ?? "N/D"} />
            <Field
              label="Confianza"
              value={formatNumber(link?.linkConfidence ?? trade?.linkConfidence, 2)}
            />
            <Field
              label="Score match"
              value={
                link?.matchScoreTotal == null
                  ? "N/D"
                  : `${formatNumber(link.matchScoreTotal, 2)} / ${formatNumber(link.matchScoreMax, 2)}`
              }
            />
            <Field
              label="Estado legacy"
              value={<StatusPill label={trade?.linkStatus ?? "N/D"} tone={toneForStatus(trade?.linkStatus)} />}
            />
          </div>

          <div className="rounded-md border border-border bg-secondary/20 p-3">
            <p className="mb-3 font-heading text-sm font-semibold text-foreground">Plan sugerido vs ejecucion real</p>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <Field label="Base" value={plan?.baseId ?? fallbackPlan?.baseId ?? "N/D"} />
              <Field label="Entrada plan" value={<span className="font-mono">{formatPrice(plan?.entryPrice ?? fallbackPlan?.entryPrice)}</span>} />
              <Field label="Entrada trade" value={<span className="font-mono">{formatPrice(execution?.entryPrice)}</span>} />
              <Field label="SL plan" value={<span className="font-mono">{formatPrice(plan?.slPrice ?? fallbackPlan?.slPrice)}</span>} />
              <Field label="SL trade" value={<span className="font-mono">{formatPrice(execution?.initialSlPrice)}</span>} />
              <Field label="Delta SL" value={<span className="font-mono">{formatDelta(link?.comparison.slDeltaPoints)}</span>} />
              <Field label="TP plan" value={<span className="font-mono">{formatPrice(plan?.tpPrice ?? fallbackPlan?.tpPrice)}</span>} />
              <Field label="TP trade" value={<span className="font-mono">{formatPrice(execution?.initialTpPrice)}</span>} />
              <Field label="Delta TP" value={<span className="font-mono">{formatDelta(link?.comparison.tpDeltaPoints)}</span>} />
              <Field label="Delta entrada" value={<span className="font-mono">{formatDelta(link?.comparison.entryDeltaPoints)}</span>} />
              <Field label="Delta tiempo" value={formatDelta(link?.comparison.timeDeltaSeconds, "seg")} />
              <Field label="Notas" value={link?.notes ?? "N/D"} />
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
