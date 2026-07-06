import type { ReactNode } from "react"
import type { SignalBoardItem } from "@/types/snapshots"
import { StatusPill, toneForStatus } from "@/components/data-status/status-pill"
import { formatNumber, formatPrice, getPrimaryEntry } from "@/lib/data/format"
import { linkStatusForSignal, linkStatusLabel, linkStatusTone, linkTradeId } from "@/lib/data/signal-trade-links"
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

export function SignalLinkTradePanel({ signal }: { signal: SignalBoardItem }) {
  const trade = signal.linkedTrade
  const link = signal.tradeLink
  const linkStatus = linkStatusForSignal(signal)
  const plan = link?.signalPlan
  const execution = link?.tradeExecution
  const fallbackPlan = getPrimaryEntry(signal.entries)
  const hasLink = Boolean(link || trade)

  return (
    <section className="rounded-lg border border-border p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="font-heading text-sm font-semibold text-foreground">Vinculacion senal - trade</h4>
          {link?.isTest && <StatusPill label="TEST" tone="mock" />}
        </div>
        <StatusPill label={linkStatusLabel(linkStatus)} tone={linkStatusTone(linkStatus)} />
      </div>

      {!hasLink ? (
        <div className="mt-4 space-y-3">
          <p className="text-sm text-muted-foreground">Sin vinculo senal-trade disponible.</p>
          <p className="rounded-md border border-border bg-secondary/20 p-3 text-sm text-muted-foreground">
            Vinculacion manual pendiente de backend seguro.
          </p>
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <Field label="Trade ID" value={<span className="font-mono">{linkTradeId(signal) ?? "N/D"}</span>} />
            <Field label="Position ID" value={<span className="font-mono">{link?.positionId ?? execution?.positionId ?? "N/D"}</span>} />
            <Field label="Tipo de vinculo" value={link?.linkType ?? trade?.linkStatus ?? "N/D"} />
            <Field label="Confianza" value={formatNumber(link?.linkConfidence ?? trade?.linkConfidence, 2)} />
            <Field
              label="Score"
              value={
                link?.matchScoreTotal == null
                  ? "N/D"
                  : `${formatNumber(link.matchScoreTotal, 2)} / ${formatNumber(link.matchScoreMax, 2)}`
              }
            />
            <Field label="Estado legacy" value={<StatusPill label={trade?.linkStatus ?? "N/D"} tone={toneForStatus(trade?.linkStatus)} />} />
            <Field label="Test case" value={link?.isTest ? `${link.testCaseId ?? "N/D"} ${link.testCaseLabel ?? ""}`.trim() : "N/D"} />
            <Field label="Creado" value={formatArgTime(link?.createdAtUtc)} />
            <Field label="Actualizado" value={formatArgTime(link?.updatedAtUtc)} />
          </div>

          {link && (
            <div className="rounded-md border border-border bg-secondary/20 p-3">
              <p className="mb-3 font-heading text-sm font-semibold text-foreground">Motivos de matching</p>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                <Field label="Simbolo" value={yesNo(link.matchedBySymbol)} />
                <Field label="Direccion" value={yesNo(link.matchedByDirection)} />
                <Field label="Ventana tiempo" value={yesNo(link.matchedByTimeWindow)} />
                <Field label="Distancia entrada" value={yesNo(link.matchedByEntryDistance)} />
                <Field label="Estrategia" value={yesNo(link.matchedByStrategy)} />
                <Field label="Cuenta/entorno" value={yesNo(link.matchedByAccount)} />
              </div>
            </div>
          )}

          {link ? (
            <div className="rounded-md border border-border bg-secondary/20 p-3">
              <p className="mb-3 font-heading text-sm font-semibold text-foreground">Plan sugerido vs ejecucion real</p>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <Field label="Base" value={plan?.baseId ?? fallbackPlan?.baseId ?? "N/D"} />
                <Field label="Entrada plan" value={<span className="font-mono">{formatPrice(plan?.entryPrice ?? fallbackPlan?.entryPrice)}</span>} />
                <Field label="Entrada real" value={<span className="font-mono">{formatPrice(execution?.entryPrice)}</span>} />
                <Field label="SL plan" value={<span className="font-mono">{formatPrice(plan?.slPrice ?? fallbackPlan?.slPrice)}</span>} />
                <Field label="SL inicial real" value={<span className="font-mono">{formatPrice(execution?.initialSlPrice)}</span>} />
                <Field label="Delta SL" value={<span className="font-mono">{formatDelta(link.comparison.slDeltaPoints)}</span>} />
                <Field label="TP plan" value={<span className="font-mono">{formatPrice(plan?.tpPrice ?? fallbackPlan?.tpPrice)}</span>} />
                <Field label="TP inicial real" value={<span className="font-mono">{formatPrice(execution?.initialTpPrice)}</span>} />
                <Field label="Delta TP" value={<span className="font-mono">{formatDelta(link.comparison.tpDeltaPoints)}</span>} />
                <Field label="R:R" value={formatNumber(plan?.riskReward ?? fallbackPlan?.riskReward, 2)} />
                <Field label="Trade status" value={<StatusPill label={execution?.tradeStatus ?? "N/D"} tone={toneForStatus(execution?.tradeStatus)} />} />
                <Field label="Delta entrada" value={<span className="font-mono">{formatDelta(link.comparison.entryDeltaPoints)}</span>} />
                <Field label="Delta tiempo" value={formatDelta(link.comparison.timeDeltaSeconds, "seg")} />
                <Field label="Notas" value={link.notes ?? "N/D"} />
              </div>
            </div>
          ) : (
            <p className="rounded-md border border-border bg-secondary/20 p-3 text-sm text-muted-foreground">
              Hay link legacy en Signals, pero no existe comparacion signal_trade_links.v1 para mostrar.
            </p>
          )}

          <p className="rounded-md border border-border bg-secondary/20 p-3 text-sm text-muted-foreground">
            Vinculacion manual pendiente de backend seguro.
          </p>
        </div>
      )}
    </section>
  )
}
