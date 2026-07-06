import type { SignalBoardItem, SignalCondition } from "@/types/snapshots"
import { StatusPill, toneForStatus } from "@/components/data-status/status-pill"
import { formatNumber } from "@/lib/data/format"

const categoryLabels: Record<string, string> = {
  context: "Contexto",
  trigger: "Disparo",
  execution: "Ejecucion",
  risk: "Riesgo",
  warning: "Warnings",
}

function groupedConditions(conditions: SignalCondition[]) {
  return conditions.reduce<Record<string, SignalCondition[]>>((groups, condition) => {
    const category = condition.category || "other"
    groups[category] = [...(groups[category] ?? []), condition]
    return groups
  }, {})
}

export function SignalConditionsPanel({ signal }: { signal: SignalBoardItem }) {
  const groups = groupedConditions(signal.conditions)
  const categories = ["context", "trigger", "execution", "risk", "warning", ...Object.keys(groups).filter((key) => !categoryLabels[key])]

  return (
    <section className="rounded-lg border border-border p-4">
      <h4 className="font-heading text-sm font-semibold text-foreground">Condiciones tecnicas</h4>
      <div className="mt-3 space-y-3">
        {categories.map((category) => {
          const values = groups[category] ?? []
          return (
            <div key={category} className="rounded-lg bg-secondary/30 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{categoryLabels[category] ?? category}</p>
              {values.length === 0 ? (
                <p className="mt-2 text-xs text-muted-foreground">Sin datos</p>
              ) : (
                <div className="mt-2 space-y-2">
                  {values.map((condition) => (
                    <div key={condition.conditionCode} className="rounded-md border border-border bg-card/50 p-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium text-foreground">{condition.label}</p>
                        {condition.timeframe && <StatusPill label={condition.timeframe} tone="neutral" />}
                        <StatusPill label={condition.status} tone={toneForStatus(condition.status)} />
                        <StatusPill label={condition.severity} tone={toneForStatus(condition.severity)} />
                      </div>
                      <div className="mt-2 grid grid-cols-1 gap-2 text-xs text-muted-foreground md:grid-cols-2">
                        <p>Score: {formatNumber(condition.scorePoints, 2)}</p>
                        <p>Actual: {condition.actualValue ?? "N/D"}</p>
                        <p>
                          Valor: {formatNumber(condition.numericValue, 4)} {condition.unit ?? ""}
                        </p>
                        <p>Esperado: {condition.expectedValue ?? "N/D"}</p>
                      </div>
                      {condition.details && <p className="mt-2 whitespace-pre-wrap text-xs text-foreground/80">{condition.details}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
