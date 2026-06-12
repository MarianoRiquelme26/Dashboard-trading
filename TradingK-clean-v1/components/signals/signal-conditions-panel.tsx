const groups = ["Contexto", "Disparo", "Ejecucion", "Riesgo", "Warnings"]

export function SignalConditionsPanel({ signal }: { signal: Record<string, unknown> }) {
  const conditions = typeof signal.conditions === "object" && signal.conditions ? (signal.conditions as Record<string, unknown>) : {}
  return (
    <section className="rounded-lg border border-border p-4">
      <h4 className="font-heading text-sm font-semibold text-foreground">Condiciones tecnicas</h4>
      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-5">
        {groups.map((group) => {
          const key = group.toLowerCase()
          const values = Array.isArray(conditions[key]) ? conditions[key] : []
          return (
            <div key={group} className="rounded-lg bg-secondary/30 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{group}</p>
              {values.length === 0 ? (
                <p className="mt-2 text-xs text-muted-foreground">Sin datos</p>
              ) : (
                <ul className="mt-2 space-y-1 text-xs text-foreground/80">
                  {values.map((value, index) => (
                    <li key={`${group}-${index}`}>{String(value)}</li>
                  ))}
                </ul>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
