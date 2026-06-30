import type { SignalBoardItem } from "@/types/snapshots"
import { linkStatusForSignal } from "@/lib/data/signal-trade-links"

function countBy(items: SignalBoardItem[], predicate: (item: SignalBoardItem) => boolean) {
  return items.filter(predicate).length
}

export function SignalsSummary({ items }: { items: SignalBoardItem[] }) {
  const cards = [
    ["Total senales", items.length],
    ["Pendientes", countBy(items, (item) => item.operationStatus === "pending")],
    ["Tomadas", countBy(items, (item) => item.operationStatus === "taken")],
    ["Sin vincular", countBy(items, (item) => linkStatusForSignal(item) === "unlinked")],
    ["Errores", countBy(items, (item) => item.signalStatus === "error")],
  ] as const

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map(([label, value]) => (
        <div key={label} className="glass rounded-lg p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
          <p className="mt-2 font-heading text-2xl font-semibold text-foreground">{value}</p>
        </div>
      ))}
    </div>
  )
}
