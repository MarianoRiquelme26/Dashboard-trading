import { DataStatusBadge } from "@/components/data-status/data-status-badge"
import type { DataSourceStatus } from "@/types/snapshots"

export function PerformanceHero({ status }: { status: DataSourceStatus }) {
  return (
    <section className="glass rounded-lg p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-heading text-lg font-semibold text-foreground">Journal real</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Métricas de performance ocultas hasta que existan operaciones reales y resultados confiables.
          </p>
        </div>
        <DataStatusBadge status={status} />
      </div>
    </section>
  )
}
