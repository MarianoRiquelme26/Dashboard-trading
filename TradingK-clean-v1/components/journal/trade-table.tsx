import type { JournalTradeItem } from "@/types/snapshots"
import { StatusPill, toneForDirection, toneForStatus } from "@/components/data-status/status-pill"
import { formatNumber, formatPrice } from "@/lib/data/format"
import { formatArgTime } from "@/lib/data/status"

const tradeGrid =
  "grid-cols-[130px_90px_90px_130px_100px_90px_90px_120px_100px_120px_130px_140px_180px]"

const headers = [
  "Hora entrada",
  "Símbolo",
  "Dirección",
  "Estrategia",
  "Entrada",
  "SL inicial",
  "TP inicial",
  "Salida",
  "Resultado R",
  "Net profit",
  "Señal vinculada",
  "Error/review",
  "Nota",
]

export function TradeTable({ items }: { items: JournalTradeItem[] }) {
  return (
    <>
      <div className="hidden overflow-x-auto rounded-lg border border-border md:block">
        <div className={`grid min-w-[1480px] gap-3 bg-secondary/50 px-4 py-3 text-[11px] uppercase tracking-wide text-muted-foreground ${tradeGrid}`}>
          {headers.map((header) => (
            <div key={header}>{header}</div>
          ))}
        </div>
        {items.map((trade) => (
          <div key={trade.trade_id} className={`grid min-w-[1480px] gap-3 border-t border-border px-4 py-3 text-sm ${tradeGrid}`}>
            <div className="font-mono text-xs text-muted-foreground">{formatArgTime(trade.entry_time_utc)}</div>
            <div>{trade.symbol}</div>
            <div>
              <StatusPill label={trade.direction.toUpperCase()} tone={toneForDirection(trade.direction)} />
            </div>
            <div>{trade.strategy_name ?? "-"}</div>
            <div className="font-mono">{formatPrice(trade.entry_price)}</div>
            <div className="font-mono">{formatPrice(trade.initial_sl_price)}</div>
            <div className="font-mono">{formatPrice(trade.initial_tp_price)}</div>
            <div className="font-mono text-xs">{formatArgTime(trade.result?.closed_at_utc)}</div>
            <div>{formatNumber(trade.result?.result_r, 2)}</div>
            <div>{formatNumber(trade.result?.net_profit, 2)}</div>
            <div className="font-mono text-xs">{trade.linked_signal?.event_id ?? "-"}</div>
            <div>{trade.review?.mistake_type ?? "-"}</div>
            <div>{trade.review?.journal_notes ?? "-"}</div>
          </div>
        ))}
      </div>
      <div className="space-y-3 md:hidden">
        {items.map((trade) => (
          <article key={trade.trade_id} className="rounded-lg border border-border bg-card p-4">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-xs text-muted-foreground">{formatArgTime(trade.entry_time_utc)}</p>
                <h3 className="font-heading text-base font-semibold text-foreground">{trade.symbol}</h3>
                <p className="text-sm text-muted-foreground">{trade.strategy_name ?? "Sin estrategia"}</p>
              </div>
              <StatusPill label={trade.trade_status} tone={toneForStatus(trade.trade_status)} />
            </div>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <p>Entrada: {formatPrice(trade.entry_price)}</p>
              <p>SL: {formatPrice(trade.initial_sl_price)}</p>
              <p>TP: {formatPrice(trade.initial_tp_price)}</p>
            </div>
          </article>
        ))}
      </div>
    </>
  )
}
