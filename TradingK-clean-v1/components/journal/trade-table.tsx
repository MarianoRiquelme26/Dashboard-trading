import type { SnapshotRecord } from "@/types/snapshots"

const tradeGrid =
  "grid-cols-[120px_90px_90px_130px_100px_90px_90px_120px_100px_120px_130px_140px_180px]"

const headers = [
  "Hora entrada",
  "Simbolo",
  "Direccion",
  "Estrategia",
  "Entrada real",
  "SL real",
  "TP real",
  "Salida",
  "Resultado R",
  "Resultado dinero",
  "Senal vinculada",
  "Error operativo",
  "Nota",
]

function text(item: Record<string, unknown>, key: string) {
  const value = item[key]
  return typeof value === "string" || typeof value === "number" ? String(value) : "-"
}

export function TradeTable({ items }: { items: SnapshotRecord["items"] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <div className={`grid min-w-[1480px] gap-3 bg-secondary/50 px-4 py-3 text-[11px] uppercase tracking-wide text-muted-foreground ${tradeGrid}`}>
        {headers.map((header) => (
          <div key={header}>{header}</div>
        ))}
      </div>
      {items.map((trade, index) => (
        <div key={`${text(trade, "trade_id")}-${index}`} className={`grid min-w-[1480px] gap-3 border-t border-border px-4 py-3 text-sm ${tradeGrid}`}>
          <div className="font-mono text-xs text-muted-foreground">{text(trade, "entry_time_utc")}</div>
          <div>{text(trade, "symbol")}</div>
          <div>{text(trade, "direction")}</div>
          <div>{text(trade, "strategy")}</div>
          <div>{text(trade, "real_entry")}</div>
          <div>{text(trade, "real_sl")}</div>
          <div>{text(trade, "real_tp")}</div>
          <div>{text(trade, "exit_time_utc")}</div>
          <div>{text(trade, "result_r")}</div>
          <div>{text(trade, "result_money")}</div>
          <div>{text(trade, "signal_event_id")}</div>
          <div>{text(trade, "operational_error")}</div>
          <div>{text(trade, "note")}</div>
        </div>
      ))}
    </div>
  )
}
