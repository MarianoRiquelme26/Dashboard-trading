"use client"

import { cn } from "@/lib/utils"

export type SignalTab = "all" | "pending" | "taken" | "discarded" | "expired" | "unlinked"

const tabs: Array<{ id: SignalTab; label: string }> = [
  { id: "all", label: "Todas" },
  { id: "pending", label: "Pendientes" },
  { id: "taken", label: "Tomadas" },
  { id: "discarded", label: "Descartadas" },
  { id: "expired", label: "Vencidas" },
  { id: "unlinked", label: "Sin vincular" },
]

export function SignalsTabs({
  active,
  counts,
  onChange,
}: {
  active: SignalTab
  counts: Record<SignalTab, number>
  onChange: (tab: SignalTab) => void
}) {
  return (
    <div className="flex flex-wrap gap-2 rounded-lg bg-secondary/30 p-1.5" role="tablist" aria-label="Estados de señales">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={active === tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary",
            active === tab.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {tab.label} <span className="ml-1 font-mono text-xs opacity-80">{counts[tab.id]}</span>
        </button>
      ))}
    </div>
  )
}
