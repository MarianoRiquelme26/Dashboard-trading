import type { JournalTradeItem } from "@/types/snapshots"
import { StatusPill, toneForDirection, toneForStatus } from "@/components/data-status/status-pill"
import { formatNumber, formatPrice } from "@/lib/data/format"
import { linkStatusForTrade, linkStatusLabel, linkStatusTone } from "@/lib/data/signal-trade-links"
import { formatArgTime } from "@/lib/data/status"
import { cn } from "@/lib/utils"

const tradeGrid =
  "grid-cols-[130px_90px_90px_130px_100px_90px_90px_120px_130px_100px_100px_100px_130px_140px_180px]"

const headers = [
  "Hora entrada",
  "Simbolo",
  "Direccion",
  "Estrategia",
  "Entrada",
  "SL inicial",
  "TP inicial",
  "Estado trade",
  "Senal vinculada",
  "Salida",
  "Resultado R",
  "Resultado neto",
  "Resultado pips",
  "Error / Review",
  "Notas",
]

function display(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") return "N/D"
  return String(value)
}

export function TradeTable({
  items,
  selectedTradeId,
  onSelect,
}: {
  items: JournalTradeItem[]
  selectedTradeId: string | null
  onSelect: (trade: JournalTradeItem) => void
}) {
  return (
    <>
      <div className="hidden overflow-x-auto rounded-lg border border-border md:block">
        <div className={`grid min-w-[1680px] gap-3 bg-secondary/50 px-4 py-3 text-[11px] uppercase tracking-wide text-muted-foreground ${tradeGrid}`}>
          {headers.map((header) => (
            <div key={header}>{header}</div>
          ))}
        </div>
        {items.map((trade) => (
          <button
            key={trade.tradeId}
            type="button"
            onClick={() => onSelect(trade)}
            className={cn(
              `grid w-full min-w-[1680px] gap-3 border-t border-border px-4 py-3 text-left text-sm transition-colors hover:bg-secondary/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${tradeGrid}`,
              selectedTradeId === trade.tradeId && "bg-primary/10",
            )}
          >
            <div className="font-mono text-xs text-muted-foreground">{formatArgTime(trade.entryTimeUtc)}</div>
            <div>{trade.symbol ?? "N/D"}</div>
            <div>
              <StatusPill label={(trade.direction ?? "N/D").toUpperCase()} tone={toneForDirection(trade.direction ?? "")} />
            </div>
            <div>{trade.strategyName ?? "N/D"}</div>
            <div className="font-mono">{formatPrice(trade.entryPrice)}</div>
            <div className="font-mono">{formatPrice(trade.initialSlPrice)}</div>
            <div className="font-mono">{formatPrice(trade.initialTpPrice)}</div>
            <div>
              <StatusPill label={trade.tradeStatus ?? "N/D"} tone={toneForStatus(trade.tradeStatus)} />
            </div>
            <div className="min-w-0 space-y-1">
              <StatusPill label={linkStatusLabel(linkStatusForTrade(trade))} tone={linkStatusTone(linkStatusForTrade(trade))} />
              <div className="truncate font-mono text-xs text-muted-foreground">{trade.linkedSignalEventId ?? "N/D"}</div>
            </div>
            <div className="font-mono text-xs">{trade.closedAtUtc ? formatArgTime(trade.closedAtUtc) : "N/D"}</div>
            <div>{trade.resultR === null ? "N/D" : formatNumber(trade.resultR, 2)}</div>
            <div>{trade.netProfit === null ? "N/D" : formatNumber(trade.netProfit, 2)}</div>
            <div>{trade.resultPips === null ? "N/D" : formatNumber(trade.resultPips, 1)}</div>
            <div>{display(trade.mistakeType ?? trade.reviewStatus)}</div>
            <div>{display(trade.journalNotes)}</div>
          </button>
        ))}
      </div>
      <div className="space-y-3 md:hidden">
        {items.map((trade) => (
          <button
            key={trade.tradeId}
            type="button"
            onClick={() => onSelect(trade)}
            className={cn(
              "w-full rounded-lg border border-border bg-card p-4 text-left transition-colors hover:bg-secondary/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary",
              selectedTradeId === trade.tradeId && "border-primary bg-primary/10",
            )}
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-xs text-muted-foreground">{formatArgTime(trade.entryTimeUtc)}</p>
                <h3 className="font-heading text-base font-semibold text-foreground">{trade.symbol ?? "N/D"}</h3>
                <p className="text-sm text-muted-foreground">{trade.strategyName ?? "N/D"}</p>
              </div>
              <StatusPill label={trade.tradeStatus ?? "N/D"} tone={toneForStatus(trade.tradeStatus)} />
            </div>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <p>Entrada: {formatPrice(trade.entryPrice)}</p>
              <p>SL: {formatPrice(trade.initialSlPrice)}</p>
              <p>TP: {formatPrice(trade.initialTpPrice)}</p>
            </div>
            <div className="mt-3 grid gap-1 text-sm text-muted-foreground">
              <p>Vinculo: {linkStatusLabel(linkStatusForTrade(trade))}</p>
              <p>Salida: {trade.closedAtUtc ? formatArgTime(trade.closedAtUtc) : "N/D"}</p>
              <p>Resultado R: {trade.resultR === null ? "N/D" : formatNumber(trade.resultR, 2)}</p>
              <p>Neto: {trade.netProfit === null ? "N/D" : formatNumber(trade.netProfit, 2)}</p>
            </div>
          </button>
        ))}
      </div>
    </>
  )
}
