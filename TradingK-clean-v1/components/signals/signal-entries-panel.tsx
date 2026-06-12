function primitive(value: unknown) {
  return typeof value === "string" || typeof value === "number" || typeof value === "boolean" ? String(value) : "-"
}

export function SignalEntriesPanel({ signal }: { signal: Record<string, unknown> }) {
  const entries = Array.isArray(signal.entries) ? signal.entries : []
  return (
    <section className="rounded-lg border border-border p-4">
      <h4 className="font-heading text-sm font-semibold text-foreground">Plan sugerido</h4>
      {entries.length === 0 ? (
        <p className="mt-2 text-sm text-muted-foreground">Sin entries en snapshot.</p>
      ) : (
        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
          {entries.map((entry, index) => {
            const record = typeof entry === "object" && entry ? (entry as Record<string, unknown>) : {}
            return (
              <div key={`${primitive(record.label)}-${index}`} className="rounded-lg bg-secondary/30 p-3 text-sm">
                <p className="mb-2 font-medium text-foreground">{primitive(record.label) || `Base ${index + 1}`}</p>
                <p>Entrada: {primitive(record.entry)}</p>
                <p>SL: {primitive(record.sl)}</p>
                <p>TP: {primitive(record.tp)}</p>
                <p>R:R: {primitive(record.rr)}</p>
                <p>SL protegido por EMAs: {primitive(record.ema_protected)}</p>
                <p className="text-muted-foreground">Detalle: {primitive(record.detail)}</p>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
