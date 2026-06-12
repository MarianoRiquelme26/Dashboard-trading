"use client"

import { DataState } from "@/components/data-status/data-state"
import { DataStatusBadge } from "@/components/data-status/data-status-badge"
import { useSnapshot } from "@/lib/data/load-json"
import { formatSnapshotTime } from "@/lib/data/status"
import type { SnapshotRecord } from "@/types/snapshots"

export function PlaybookView() {
  const { data, status, error, isLoading } = useSnapshot<SnapshotRecord>("/data/playbook_strategies.json")

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3">
          <h2 className="font-heading text-2xl font-semibold text-foreground">Playbook</h2>
          <DataStatusBadge status={status} generatedAtUtc={data?.generated_at_utc} />
        </div>
        <p className="text-muted-foreground">Reglas base TradingK. Sin setups genericos inventados.</p>
        <p className="mt-1 text-xs text-muted-foreground">Ultimo snapshot: {formatSnapshotTime(data?.generated_at_utc)}</p>
      </div>

      {isLoading ? (
        <div className="h-52 animate-pulse rounded-lg bg-secondary/50" />
      ) : (
        <DataState status={status} error={error} generatedAtUtc={data?.generated_at_utc}>
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {data?.items.map((strategy, index) => {
              const rules = Array.isArray(strategy.rules) ? strategy.rules : []
              return (
                <article key={String(strategy.strategy_id ?? index)} className="glass rounded-lg p-5">
                  <h3 className="font-heading text-lg font-semibold text-foreground">{String(strategy.name ?? "Estrategia")}</h3>
                  <div className="mt-4 space-y-3">
                    {rules.map((rule, ruleIndex) => (
                      <div key={`${index}-${ruleIndex}`} className="rounded-lg bg-secondary/30 p-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          {typeof rule === "object" && rule ? String((rule as Record<string, unknown>).section ?? "Regla") : "Regla"}
                        </p>
                        <p className="mt-1 text-sm text-foreground/85">
                          {typeof rule === "object" && rule ? String((rule as Record<string, unknown>).description ?? "") : String(rule)}
                        </p>
                      </div>
                    ))}
                  </div>
                </article>
              )
            })}
          </div>
        </DataState>
      )}
    </div>
  )
}
