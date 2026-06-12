import type { SnapshotRecord } from "@/types/snapshots"

function countBy(items: SnapshotRecord["items"], key: string, value: string) {
  return items.filter((item) => item[key] === value).length
}

export function SignalsSummary({ items }: { items: SnapshotRecord["items"] }) {
  const cards = [
    ["Total senales", items.length],
    ["Pendientes", countBy(items, "operation_status", "pending")],
    ["Tomadas", countBy(items, "operation_status", "taken")],
    ["Sin vincular", countBy(items, "operation_status", "unlinked")],
    ["Errores", countBy(items, "signal_status", "error")],
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
