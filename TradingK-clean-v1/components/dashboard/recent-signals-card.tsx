"use client"

import { RadioTower } from "lucide-react"
import { DataState } from "@/components/data-status/data-state"
import { DataStatusBadge } from "@/components/data-status/data-status-badge"
import { StatusPill, toneForDirection, toneForStatus } from "@/components/data-status/status-pill"
import { useNavigation } from "@/components/navigation-context"
import { formatNumber, formatPrice } from "@/lib/data/format"
import { formatSnapshotLabel, formatSnapshotTime } from "@/lib/data/status"
import { useSignalsRecent } from "@/lib/data/use-snapshot-query"

export function RecentSignalsCard() {
  const { openSignal, setCurrentView } = useNavigation()
  const { data, status, error, isLoading, refetch } = useSignalsRecent()
  const items = data?.items.slice(0, 8) ?? []

  return (
    <section className="glass rounded-lg p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <RadioTower className="h-4 w-4 text-primary" />
            <h3 className="font-heading text-lg font-semibold text-foreground">Recent Signals</h3>
          </div>
          <p className="text-xs text-muted-foreground">Ultimo snapshot: {formatSnapshotLabel(data?.generatedAtUtc, (data?.items.length ?? 0) > 0)}</p>
        </div>
        <DataStatusBadge status={status} generatedAtUtc={data?.generatedAtUtc} />
      </div>

      {isLoading ? (
        <div className="h-24 animate-pulse rounded-lg bg-secondary/50" />
      ) : (
        <DataState
          status={status}
          error={error}
          generatedAtUtc={data?.generatedAtUtc}
          onRetry={refetch}
          emptyTitle="Recent Signals EMPTY"
          emptyDescription="No hay senales recientes para mostrar."
        >
          <div className="overflow-hidden rounded-lg border border-border">
            <div className="hidden grid-cols-6 gap-3 bg-secondary/50 px-4 py-3 text-[11px] uppercase tracking-wide text-muted-foreground md:grid">
              <div>Hora</div>
              <div>Estrategia</div>
              <div>Simbolo</div>
              <div>Direccion</div>
              <div>Score</div>
              <div>Estado</div>
            </div>
            {items.map((item) => (
              <button
                key={item.eventId}
                type="button"
                onClick={() => openSignal(item.eventId)}
                className="grid w-full grid-cols-1 gap-2 border-t border-border px-4 py-3 text-left text-sm transition-colors hover:bg-secondary/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary md:grid-cols-6 md:gap-3"
              >
                <div className="font-mono text-xs text-muted-foreground">{formatSnapshotTime(item.barCloseTimeUtc)}</div>
                <div className="truncate text-foreground">{item.strategyName ?? "N/D"}</div>
                <div className="font-mono text-foreground/80">{item.symbol ?? "N/D"}</div>
                <div>
                  <StatusPill label={(item.direction ?? "N/D").toUpperCase()} tone={toneForDirection(item.direction ?? "")} />
                </div>
                <div>
                  {formatNumber(item.scoreTotal, 1)} {item.scoreLabel ?? ""}
                </div>
                <div>
                  <StatusPill
                    label={item.operationStatus ?? item.signalStatus ?? "sin estado"}
                    tone={toneForStatus(item.operationStatus ?? item.signalStatus)}
                  />
                </div>
                {item.primaryEntry && (
                  <div className="text-xs text-muted-foreground md:col-span-6">
                    Entrada {formatPrice(item.primaryEntry.entryPrice)} / SL {formatPrice(item.primaryEntry.slPrice)} / TP{" "}
                    {formatPrice(item.primaryEntry.tpPrice)}
                  </div>
                )}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setCurrentView("signals")}
            className="mt-4 text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
          >
            Ver todas las senales
          </button>
        </DataState>
      )}
    </section>
  )
}
