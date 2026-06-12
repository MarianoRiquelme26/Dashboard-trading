"use client"

import { Lock } from "lucide-react"
import { DataState } from "@/components/data-status/data-state"
import { DataStatusBadge } from "@/components/data-status/data-status-badge"
import { useSnapshot } from "@/lib/data/load-json"
import { formatSnapshotTime } from "@/lib/data/status"
import { isAnalyticsSummarySnapshot } from "@/lib/data/validators"
import type { AnalyticsSummarySnapshot } from "@/types/snapshots"

export function AnalyticsView() {
  const { data, status, error, isLoading } = useSnapshot<AnalyticsSummarySnapshot>("/data/analytics_summary.json", {
    validate: isAnalyticsSummarySnapshot,
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="font-heading text-2xl font-semibold text-foreground">Analytics</h2>
            <DataStatusBadge status={status} generatedAtUtc={data?.generated_at_utc} />
          </div>
          <p className="text-muted-foreground">Bloqueado honestamente hasta trade_results.</p>
          <p className="mt-1 text-xs text-muted-foreground">Último snapshot: {formatSnapshotTime(data?.generated_at_utc)}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="h-40 animate-pulse rounded-lg bg-secondary/50" />
      ) : (
        <DataState
          status={status}
          error={error}
          generatedAtUtc={data?.generated_at_utc}
          emptyTitle="Analytics bloqueado"
          emptyDescription={data?.blocked_reason ?? "Motivo: no hay trade_results confiables."}
        >
          <section className="glass rounded-lg p-8 text-center">
            <Lock className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
            <h3 className="font-heading text-xl font-semibold text-foreground">Analytics bloqueado</h3>
            <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
              Motivo: {data?.blocked_reason ?? "no hay trade_results confiables."}
            </p>
          </section>
        </DataState>
      )}
    </div>
  )
}
