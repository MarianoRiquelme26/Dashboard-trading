import { DataStatusBadge } from "@/components/data-status/data-status-badge"
import type { UiDataStatus } from "@/types/snapshots"

export function PerformanceHero({ status }: { status: UiDataStatus }) {
  return (
    <section className="glass rounded-lg p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-heading text-lg font-semibold text-foreground">Journal real</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Metricas de performance ocultas hasta que Analytics tenga resultados finales confiables.
          </p>
        </div>
        <DataStatusBadge status={status} />
      </div>
    </section>
  )
}
