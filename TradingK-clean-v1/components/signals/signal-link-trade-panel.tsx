import type { SignalBoardItem } from "@/types/snapshots"
import { StatusPill, toneForStatus } from "@/components/data-status/status-pill"
import { formatNumber } from "@/lib/data/format"

export function SignalLinkTradePanel({ signal }: { signal: SignalBoardItem }) {
  const trade = signal.linkedTrade
  return (
    <section className="rounded-lg border border-border p-4">
      <h4 className="font-heading text-sm font-semibold text-foreground">Vinculacion con trade</h4>
      {!trade ? (
        <p className="mt-2 text-sm text-muted-foreground">Sin trade vinculado. No se infiere resultado desde la senal.</p>
      ) : (
        <div className="mt-3 grid grid-cols-1 gap-3 text-sm md:grid-cols-3">
          <p>trade_id: <span className="font-mono">{trade.tradeId}</span></p>
          <p>
            Estado: <StatusPill label={trade.linkStatus ?? "sin estado"} tone={toneForStatus(trade.linkStatus)} />
          </p>
          <p>Confianza: {formatNumber(trade.linkConfidence, 2)}</p>
        </div>
      )}
    </section>
  )
}
