import type { SignalBoardItem } from "@/types/snapshots"
import { StatusPill, toneForStatus } from "@/components/data-status/status-pill"
import { formatNumber } from "@/lib/data/format"

export function SignalLinkTradePanel({ signal }: { signal: SignalBoardItem }) {
  const trade = signal.linked_trade
  return (
    <section className="rounded-lg border border-border p-4">
      <h4 className="font-heading text-sm font-semibold text-foreground">Vinculación con trade</h4>
      {!trade ? (
        <p className="mt-2 text-sm text-muted-foreground">Sin trade vinculado. No se infiere resultado desde la señal.</p>
      ) : (
        <div className="mt-3 grid grid-cols-1 gap-3 text-sm md:grid-cols-3">
          <p>trade_id: <span className="font-mono">{trade.trade_id}</span></p>
          <p>
            Estado: <StatusPill label={trade.link_status} tone={toneForStatus(trade.link_status)} />
          </p>
          <p>Confianza: {formatNumber(trade.link_confidence, 2)}</p>
        </div>
      )}
    </section>
  )
}
