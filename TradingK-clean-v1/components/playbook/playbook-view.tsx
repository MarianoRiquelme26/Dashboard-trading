"use client"

import { DataState } from "@/components/data-status/data-state"
import { DataStatusBadge } from "@/components/data-status/data-status-badge"
import { useSnapshot } from "@/lib/data/load-json"
import { formatSnapshotTime } from "@/lib/data/status"
import { isPlaybookStrategiesSnapshot } from "@/lib/data/validators"
import type { PlaybookStrategiesSnapshot } from "@/types/snapshots"

export function PlaybookView() {
  const { data, status, error, isLoading } = useSnapshot<PlaybookStrategiesSnapshot>("/data/playbook_strategies.json", {
    validate: isPlaybookStrategiesSnapshot,
  })

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3">
          <h2 className="font-heading text-2xl font-semibold text-foreground">Playbook</h2>
          <DataStatusBadge status={status} generatedAtUtc={data?.generated_at_utc} />
        </div>
        <p className="text-muted-foreground">Reglas base TradingK. Sin setups genéricos inventados.</p>
        <p className="mt-1 text-xs text-muted-foreground">Último snapshot: {formatSnapshotTime(data?.generated_at_utc)}</p>
      </div>

      {isLoading ? (
        <div className="h-52 animate-pulse rounded-lg bg-secondary/50" />
      ) : (
        <DataState status={status} error={error} generatedAtUtc={data?.generated_at_utc}>
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {data?.items.map((strategy) => (
              <article key={strategy.strategy_id} className="glass rounded-lg p-5">
                <h3 className="font-heading text-lg font-semibold text-foreground">{strategy.name}</h3>
                <div className="mt-4 space-y-3">
                  {strategy.rules.map((rule) => (
                    <div key={`${strategy.strategy_id}-${rule.section}`} className="rounded-lg bg-secondary/30 p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{rule.section}</p>
                      <p className="mt-1 text-sm text-foreground/85">{rule.description}</p>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </DataState>
      )}
    </div>
  )
}
