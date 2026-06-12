"use client"

import { RecentErrorsCard } from "./recent-errors-card"
import { RecentSignalsCard } from "./recent-signals-card"
import { SnapshotStatusBanner } from "./snapshot-status-banner"
import { SystemStatusCard } from "./system-status-card"

export function DashboardView() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-semibold text-foreground">Dashboard</h2>
          <p className="text-muted-foreground">Vista rápida del sistema, noticias y últimas señales.</p>
        </div>
      </div>

      <SnapshotStatusBanner />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <RecentSignalsCard />
          <RecentErrorsCard />
        </div>
        <div className="space-y-6">
          <SystemStatusCard />
          <section className="glass rounded-lg p-5">
            <h3 className="font-heading text-lg font-semibold text-foreground">Noticias</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Feed de noticias pendiente de snapshot dedicado. No se muestran eventos inventados.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
