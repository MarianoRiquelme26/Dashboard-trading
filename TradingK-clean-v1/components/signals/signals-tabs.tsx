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

export function SignalsTabs({ active, onChange }: { active: SignalTab; onChange: (tab: SignalTab) => void }) {
  return (
    <div className="flex flex-wrap gap-2 rounded-lg bg-secondary/30 p-1.5">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            active === tab.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
